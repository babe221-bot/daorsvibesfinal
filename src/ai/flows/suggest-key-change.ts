'use server';

import {
  SuggestKeyChangeInputSchema,
  SuggestKeyChangeOutputSchema,
} from './suggest-key-change.schemas';
import { suggestKeyChangeFromKeyFlow } from './suggest-key-change.flow';
import fetch from 'node-fetch';
import { WaveFile } from 'wavefile';
import aubio from 'aubiojs';
import { z } from 'zod';

export type PitchMethod =
  | 'default'
  | 'schmitt'
  | 'fcomb'
  | 'mcomb'
  | 'yin'
  | 'yinfft';

export type SuggestKeyChangeOutput = z.infer<
  typeof SuggestKeyChangeOutputSchema
>;
export type SuggestKeyChangeInput = z.infer<
  typeof SuggestKeyChangeInputSchema
>;

export async function suggestKeyChange(
  input: SuggestKeyChangeInput
): Promise<SuggestKeyChangeOutput> {
  if (!input.audioUrl.toLowerCase().endsWith('.wav')) {
    throw new Error('Audio URL must point to a .wav file.');
  }

  const response = await fetch(input.audioUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch audio file: ${response.statusText}`);
  }
  const buffer = Buffer.from(await response.arrayBuffer());

  const wav = new WaveFile(buffer);
  wav.toBitDepth('32f');
  wav.toSampleRate(44100);
  const samples = wav.getSamples(true) as unknown as Float32Array;

  const { Pitch } = await aubio();
  const detectedKey = await detectKeyFromSamples(samples, Pitch);

  return suggestKeyChangeFromKeyFlow({ detectedKey });
}

export async function detectKeyFromSamples(
  samples: Float32Array,
  Pitch: new (
    type: PitchMethod,
    bufferSize: number,
    hopSize: number,
    sampleRate: number
  ) => {
    do: (frame: Float32Array) => number;
  }
): Promise<string> {
  const sampleRate = 44100;
  const bufferSize = 4096;
  const hopSize = 512;
  const pitchDetector = new Pitch('default', bufferSize, hopSize, sampleRate);
  const chroma: number[] = new Array(12).fill(0);

  for (let i = 0; i < samples.length; i += hopSize) {
    const frame = samples.slice(i, i + hopSize);
    if (frame.length < hopSize) {
      break;
    }

    const pitch = pitchDetector.do(frame);
    if (pitch > 0) {
      const midiNote = 69 + 12 * Math.log2(pitch / 440);
      const chromaIndex = (Math.round(midiNote) % 12 + 12) % 12;
      chroma[chromaIndex] = chroma[chromaIndex]! + 1;
    }
  }

  if (chroma.reduce((a, b) => a + b, 0) === 0) {
    throw new Error(
      'Could not detect any pitches in the audio. Unable to determine key.'
    );
  }

  const majorProfile = [
    6.35, 2.23, 3.48, 2.33, 4.38, 4.09, 2.52, 5.19, 2.39, 3.66, 2.29, 2.88,
  ];
  const minorProfile = [
    6.33, 2.68, 3.52, 5.38, 2.6, 3.53, 2.54, 4.75, 3.98, 2.69, 3.34, 3.17,
  ];
  const keys = [
    'C',
    'C#',
    'D',
    'D#',
    'E',
    'F',
    'F#',
    'G',
    'G#',
    'A',
    'A#',
    'B',
  ];

  let bestMatch = { key: 'Unknown', score: -1, mode: '' };

  for (let i = 0; i < 12; i++) {
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
