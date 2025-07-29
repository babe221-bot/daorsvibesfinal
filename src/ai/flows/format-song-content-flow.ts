'use server';

/**
 * @fileOverview Formats raw song content (lyrics and chords) into a clean, readable format.
 *
 * - formatSongContent - Takes raw song text and uses AI to format it.
 * - FormatSongContentInput - The input type for the formatSongContent function.
 * - FormatSongContentOutput - The return type for the formatSongContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { ZodError } from 'zod';

const FormatSongContentInputSchema = z.object({
  content: z.string().describe('The raw song content including lyrics and chords.'),
});
export type FormatSongContentInput = z.infer<typeof FormatSongContentInputSchema>;

const FormatSongContentOutputSchema = z.object({
  formattedContent: z.string().describe('The formatted song content with chords placed above the corresponding lyrics.'),
});
export type FormatSongContentOutput = z.infer<typeof FormatSongContentOutputSchema>;


export async function formatSongContent(input: FormatSongContentInput): Promise<FormatSongContentOutput> {
  const parsedInput = FormatSongContentInputSchema.safeParse(input);
  if (!parsedInput.success) {
    throw new ZodError(parsedInput.error.issues);
  }
  
  return formatSongContentFlow(parsedInput.data);
}

const prompt = ai.definePrompt({
  name: 'formatSongContentPrompt',
  input: {schema: FormatSongContentInputSchema},
  output: {schema: FormatSongContentOutputSchema},
  prompt: `You are an expert music transcription AI. Your task is to format the provided raw text, which contains lyrics and chords for a song.

Your goal is to place the chord annotations directly above the corresponding lyric text where the chord change occurs. Preserve the structure of the song (e.g., verse, chorus, bridge). Ensure chords are aligned correctly.

Example Input:
[Verse 1]
C G
This is a line of lyrics
Am F C G C
And this is another one.

Example Output:
[Verse 1]
C              G
This is a line of lyrics
Am           F         C   G        C
And this is another one.


Analyze and format the following content and return it in the specified JSON format.

RAW CONTENT:
{{{content}}}
`,
});

const formatSongContentFlow = ai.defineFlow(
  {
    name: 'formatSongContentFlow',
    inputSchema: FormatSongContentInputSchema,
    outputSchema: FormatSongContentOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
