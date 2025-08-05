'use server';

/**
 * @fileOverview AI-powered tool that suggests optimal key changes for a given audio file.
 * This version uses `wavefile` for robust WAV decoding and `aubiojs` with Pitch detection for analysis.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import fetch from 'node-fetch';
import { WaveFile } from 'wavefile';
import aubio from 'aubiojs';

// Define the final output schema for the frontend
export const SuggestKeyChangeOutputSchema = z.object({
  detectedKey: z.string().describe('The original key detected in the audio.'),
  suggestedKeyChanges: z.array(
    z.object({
      key: z.string().describe('Suggested new key.'),
      confidence: z.number().describe('Confidence score for the suggestion (0-1).'),
      justification: z.string().describe('Reasoning for the suggestion.')
    })
  ).describe('List of suggested key changes with confidence scores and justifications.'),
});
export type SuggestKeyChangeOutput = z.infer<typeof SuggestKeyChangeOutputSchema>;

// Input schema for the server action
const SuggestKeyChangeInputSchema = z.object({
  audioUrl: z.string().url().describe('URL of the audio file to analyze (must be a .wav file).'),
});
export type SuggestKeyChangeInput = z.infer<typeof SuggestKeyChangeInputSchema>;

/**
 * The main function called by the server action.
 * Orchestrates fetching, decoding, analyzing, and calling the AI flow.
 */
export async function suggestKeyChange(input: SuggestKeyChangeInput): Promise<SuggestKeyChangeOutput> {
  if (!input.audioUrl.toLowerCase().endsWith('.wav')) {
    throw new Error('Audio URL must point to a .wav file.');
  }

  // 1. Fetch Audio
  const response = await fetch(input.audioUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch audio file: ${response.statusText}`);
  }
  const buffer = Buffer.from(await response.arrayBuffer());

  // 2. Decode Audio using wavefile
  const wav = new WaveFile(buffer);
  wav.toBitDepth('32f'); // Convert to 32-bit float for aubio
  wav.toSampleRate(44100); // Resample to a standard rate
  let samples = wav.getSamples(true) as Float32Array;

  // 3. Detect Key
  const { Pitch } = await aubio();
  const detectedKey = await detectKeyFromSamples(samples, Pitch);

  // 4. Call AI Flow with the detected key
  return suggestKeyChangeFromKeyFlow({ detectedKey });
}

/**
 * Uses aubiojs Pitch detector to analyze audio samples and determine the key.
 */
export async function detectKeyFromSamples(samples: Float32Array, Pitch: any): Promise<string> {
    const sampleRate = 44100;
    const bufferSize = 4096;
    const hopSize = 512;
    const pitchDetector = new Pitch('default', bufferSize, hopSize, sampleRate);
    const chroma = new Array(12).fill(0);

    for (let i = 0; i < samples.length; i += hopSize) {
        const frame = samples.slice(i, i + hopSize);
        if (frame.length < hopSize) break;

        const pitch = pitchDetector.do(frame);
        if (pitch > 0) { // If a pitch is detected
            const midiNote = 69 + 12 * Math.log2(pitch / 440);
            const chromaIndex = Math.round(midiNote) % 12;
            chroma[chromaIndex]++;
        }
    }

    if (chroma.reduce((a, b) => a + b, 0) === 0) {
        throw new Error('Could not detect any pitches in the audio. Unable to determine key.');
    }

    // Krumhansl-Schmuckler key-finding algorithm profiles
    const majorProfile = [6.35, 2.23, 3.48, 2.33, 4.38, 4.09, 2.52, 5.19, 2.39, 3.66, 2.29, 2.88];
    const minorProfile = [6.33, 2.68, 3.52, 5.38, 2.60, 3.53, 2.54, 4.75, 3.98, 2.69, 3.34, 3.17];
    const keys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

    let bestMatch = { key: 'Unknown', score: -1, mode: '' };

    for (let i = 0; i < 12; i++) {
        // Correlate chroma vector with major and minor profiles for each possible root note
        let majorScore = 0;
        let minorScore = 0;
        for (let j = 0; j < 12; j++) {
            majorScore += chroma[j] * majorProfile[(j - i + 12) % 12];
            minorScore += chroma[j] * minorProfile[(j - i + 12) % 12];
        }

        if (majorScore > bestMatch.score) {
            bestMatch = { key: keys[i], score: majorScore, mode: 'Major' };
        }
        if (minorScore > bestMatch.score) {
            bestMatch = { key: keys[i], score: minorScore, mode: 'Minor' };
        }
    }

    return `${bestMatch.key} ${bestMatch.mode}`;
}


// Define the input for the AI-only flow
const SuggestKeyChangeFromKeyInputSchema = z.object({
    detectedKey: z.string().describe('The detected musical key of a song (e.g., "A Minor").'),
});

const prompt = ai.definePrompt({
  name: 'suggestKeyChangeFromKeyPrompt',
  input: { schema: SuggestKeyChangeFromKeyInputSchema },
  output: { schema: SuggestKeyChangeOutputSchema },
  prompt: `You are a music theory expert AI. A song's key has been detected as {{detectedKey}}.
Your task is to suggest three alternative keys that would be suitable for different vocal ranges or to create a different mood.
For each suggestion, provide the new key, a confidence score (from 0 to 1), and a brief justification for why it's a good alternative.

Format your output as a JSON object that strictly follows the defined schema.
The original detected key should also be included in the output object.`,
});

const suggestKeyChangeFromKeyFlow = ai.defineFlow(
  {
    name: 'suggestKeyChangeFromKeyFlow',
    inputSchema: SuggestKeyChangeFromKeyInputSchema,
    outputSchema: SuggestKeyChangeOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
