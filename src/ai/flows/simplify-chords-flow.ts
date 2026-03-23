'use server';

/**
 * @fileOverview AI flow to simplify chords in a song.
 */

import { generateObject } from 'ai';
import { z } from 'zod';
import { defaultModel } from '@/ai/ai-config';

const SimplifyChordsInputSchema = z.object({
  title: z.string().describe('The title of the song.'),
  artist: z.string().optional().describe('The artist of the song.'),
  lyricsAndChords: z.string().describe('The full lyrics and chords of the song.'),
});
export type SimplifyChordsInput = z.infer<typeof SimplifyChordsInputSchema>;

const SimplifyChordsOutputSchema = z.object({
  simplifiedContent: z.string().describe('The song content with simplified chords.'),
});
export type SimplifyChordsOutput = z.infer<typeof SimplifyChordsOutputSchema>;

export async function simplifyChords(input: SimplifyChordsInput): Promise<SimplifyChordsOutput> {
  const parsedInput = SimplifyChordsInputSchema.safeParse(input);
  if (!parsedInput.success) {
    throw new z.ZodError(parsedInput.error.issues);
  }

  const { title, artist, lyricsAndChords } = parsedInput.data;
  
  const systemPrompt = `You are an expert musician and music teacher. Your task is to simplify the chords for the following song to make it easier for a beginner to play on guitar. Replace complex chords (e.g., Bm7b5, C#m7) with their simpler, more common equivalents (e.g., Bm, C#m or C). Maintain the original song structure and lyrics.`;
  
  const userPrompt = `Song Title: ${title}\n${artist ? `Artist: ${artist}\n` : ''}\nLyrics and Chords:\n${lyricsAndChords}\n\nProvide the full song text with the simplified chords above the corresponding lyrics.`;

  const { object } = await generateObject({
    model: defaultModel,
    schema: SimplifyChordsOutputSchema,
    system: systemPrompt,
    prompt: userPrompt,
  });

  return object;
}
