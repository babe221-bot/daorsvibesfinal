'use server';

/**
 * @fileOverview AI-powered tool that suggests optimal key changes for a given audio URL.
 *
 * - suggestKeyChange - A function that handles the key change suggestion process.
 * - SuggestKeyChangeInput - The input type for the suggestKeyChange function.
 * - SuggestKeyChangeOutput - The return type for the suggestKeyChange function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestKeyChangeInputSchema = z.object({
  audioUrl: z.string().describe('URL of the audio file to analyze.'),
});
export type SuggestKeyChangeInput = z.infer<typeof SuggestKeyChangeInputSchema>;

const SuggestKeyChangeOutputSchema = z.object({
  suggestedKeyChanges: z.array(
    z.object({
      key: z.string().describe('Suggested key to change to.'),
      confidence: z.number().describe('Confidence score for the suggestion (0-1).'),
    })
  ).describe('List of suggested key changes with confidence scores.'),
});
export type SuggestKeyChangeOutput = z.infer<typeof SuggestKeyChangeOutputSchema>;

export async function suggestKeyChange(input: SuggestKeyChangeInput): Promise<SuggestKeyChangeOutput> {
  return suggestKeyChangeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestKeyChangePrompt',
  input: {schema: SuggestKeyChangeInputSchema},
  output: {schema: SuggestKeyChangeOutputSchema},
  prompt: `You are an AI-powered music expert. Your task is to analyze the provided audio and suggest optimal key changes for the song.

Analyze the audio from the following URL: {{{audioUrl}}}

Suggest key changes that would make the song easier to perform, along with confidence scores for each suggestion. Provide at least 3 suggestions.
Ensure that the confidence scores reflect your certainty in the accuracy of each key change suggestion.

Format your output as a JSON array of objects, where each object contains the suggested key and its corresponding confidence score.
`,
});

const suggestKeyChangeFlow = ai.defineFlow(
  {
    name: 'suggestKeyChangeFlow',
    inputSchema: SuggestKeyChangeInputSchema,
    outputSchema: SuggestKeyChangeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
