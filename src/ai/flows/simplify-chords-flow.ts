'use server';

/**
 * @fileOverview AI flow to simplify chords in a song.
 *
 * - simplifyChords - Takes a song's details and returns a version with simplified chords.
 * - SimplifyChordsInput - The input type for the simplifyChords function.
 * - SimplifyChordsOutput - The return type for the simplifyChords function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { ZodError } from 'zod';

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
    throw new ZodError(parsedInput.error.issues);
  }

  return simplifyChordsFlow(parsedInput.data);
}

const prompt = ai.definePrompt({
  name: 'simplifyChordsPrompt',
  input: {schema: SimplifyChordsInputSchema},
  output: {schema: SimplifyChordsOutputSchema},
  prompt: `You are an expert musician and music teacher. Your task is to simplify the chords for the following song to make it easier for a beginner to play on guitar. Replace complex chords (e.g., Bm7b5, C#m7) with their simpler, more common equivalents (e.g., Bm, C#m or C). Maintain the original song structure and lyrics.

Song Title: {{{title}}}
{{#if artist}}
Artist: {{{artist}}}
{{/if}}

Lyrics and Chords:
{{{lyricsAndChords}}}

Provide the full song text with the simplified chords above the corresponding lyrics.
`,
});

const simplifyChordsFlow = ai.defineFlow(
  {
    name: 'simplifyChordsFlow',
    inputSchema: SimplifyChordsInputSchema,
    outputSchema: SimplifyChordsOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
