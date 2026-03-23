'use server';

/**
 * @fileOverview Formats raw song content (lyrics and chords) into a clean, readable format.
 */

import { generateObject } from 'ai';
import { z } from 'zod';
import { defaultModel } from '@/ai/ai-config';

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
    throw new z.ZodError(parsedInput.error.issues);
  }
  
  const { object } = await generateObject({
    model: defaultModel,
    schema: FormatSongContentOutputSchema,
    system: `You are an expert music transcription AI. Your task is to format the provided raw text, which contains lyrics and chords for a song.

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
And this is another one.`,
    prompt: `Analyze and format the following content and return it in the specified JSON format.\n\nRAW CONTENT:\n${parsedInput.data.content}`,
  });

  return object;
}
