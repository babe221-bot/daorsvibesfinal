'use server';

/**
 * @fileOverview Extracts song data (title, artist, lyrics, chords) from a URL.
 *
 * - extractSongData - Fetches content from a URL and uses AI to extract song information.
 * - ExtractSongDataInput - The input type for the extractSongData function.
 * - ExtractSongDataOutput - The return type for the extractSongData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { ZodError } from 'zod';

const ExtractSongDataInputSchema = z.object({
  songUrl: z.string().url().describe('The URL of the song content to process.'),
});
export type ExtractSongDataInput = z.infer<typeof ExtractSongDataInputSchema>;

const ExtractSongDataOutputSchema = z.object({
  title: z.string().describe('The title of the song.'),
  artist: z.string().describe('The artist of the song.'),
  lyricsAndChords: z.string().describe('The full lyrics and chords of the song.'),
});
export type ExtractSongDataOutput = z.infer<typeof ExtractSongDataOutputSchema>;

async function fetchContentFromUrl(url: string): Promise<string> {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch URL: ${response.statusText}`);
        }
        return await response.text();
    } catch (error) {
        console.error("Error fetching URL content:", error);
        throw new Error("Could not retrieve content from the provided URL.");
    }
}


export async function extractSongData(input: ExtractSongDataInput): Promise<ExtractSongDataOutput> {
  const parsedInput = ExtractSongDataInputSchema.safeParse(input);
  if (!parsedInput.success) {
    throw new ZodError(parsedInput.error.issues);
  }
  
  const rawContent = await fetchContentFromUrl(parsedInput.data.songUrl);
  
  return extractSongDataFlow({ rawContent });
}

const prompt = ai.definePrompt({
  name: 'extractSongDataPrompt',
  input: {schema: z.object({ rawContent: z.string() })},
  output: {schema: ExtractSongDataOutputSchema},
  prompt: `You are an expert music analysis AI. Your task is to analyze the provided raw text, which contains lyrics and chords for a song, and extract the song's title, artist, and the full lyrics and chords content.

Analyze the following content and return it in the specified JSON format.

RAW CONTENT:
{{{rawContent}}}
`,
});

const extractSongDataFlow = ai.defineFlow(
  {
    name: 'extractSongDataFlow',
    inputSchema: z.object({ rawContent: z.string() }),
    outputSchema: ExtractSongDataOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
