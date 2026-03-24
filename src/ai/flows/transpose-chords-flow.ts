'use server';

/**
 * @fileOverview Transposes chords in a song by a given number of semitones.
 *
 * - transposeChords - Uses AI to transpose all chords while preserving structure.
 * - TransposeChordsInput - Input: lyrics+chords text + semitone offset.
 * - TransposeChordsOutput - Output: transposed content.
 */

import { generateObject } from 'ai';
import { z } from 'zod';
import { defaultModel } from '@/ai/ai-config';

const TransposeChordsInputSchema = z.object({
  lyricsAndChords: z
    .string()
    .min(1)
    .describe('The full lyrics and chords content of the song.'),
  semitones: z
    .number()
    .int()
    .min(-11)
    .max(11)
    .describe(
      'Number of semitones to transpose. Positive = up, negative = down.'
    ),
});
export type TransposeChordsInput = z.infer<typeof TransposeChordsInputSchema>;

const TransposeChordsOutputSchema = z.object({
  transposedContent: z
    .string()
    .describe('The song content with all chords transposed.'),
});
export type TransposeChordsOutput = z.infer<typeof TransposeChordsOutputSchema>;

export async function transposeChords(
  input: TransposeChordsInput
): Promise<TransposeChordsOutput> {
  const parsedInput = TransposeChordsInputSchema.safeParse(input);
  if (!parsedInput.success) {
    throw new z.ZodError(parsedInput.error.issues);
  }

  const { lyricsAndChords, semitones } = parsedInput.data;
  const direction = semitones > 0 ? 'up' : 'down';
  const absSemitones = Math.abs(semitones);

  const systemPrompt = `You are an expert musician. Your task is to transpose all chords in the provided song content by the specified number of semitones.

Rules:
1. Identify ALL chord notations: major (C, D, E, F, G, A, B), minor (Am, Bm, Cm), 7th (C7, Am7), diminished (Bdim), augmented (Caug), sus (Dsus2, Dsus4), add (Cadd9), slash chords (C/G), and any other chord notation.
2. Sharp/flat enharmonic equivalents: prefer flats for flat keys (Bb, Eb, Ab, Db, Gb) and sharps for sharp keys (F#, C#, G#, D#, A#). Use context of surrounding chords to decide.
3. Preserve the EXACT structure: section markers ([Verse], [Chorus], [Bridge], etc.), whitespace, alignment, and line breaks.
4. Do NOT modify lyrics, only chord annotations.
5. Common chromatic scale reference:
   Going UP:  C → C# → D → D# → E → F → F# → G → G# → A → A# → B
   Going DOWN: C → B → Bb → A → Ab → G → Gb → F → E → Eb → D → Db
6. For chords with modifiers (e.g., Am7, F#m7b5, Cmaj7), transpose only the root note, keeping the modifier.

Example (transpose +2):
Input:     C    Am   F    G
Output:    D    Bm   G    A

Example (transpose -3):
Input:     G    Em   C    D
Output:    E    Cm   Ab   Bb`;

  const userPrompt = `Transpose the following song ${direction} by ${absSemitones} semitones:\n\n${lyricsAndChords}`;

  const { object } = await generateObject({
    model: defaultModel,
    schema: TransposeChordsOutputSchema,
    system: systemPrompt,
    prompt: userPrompt,
  });

  return object;
}
