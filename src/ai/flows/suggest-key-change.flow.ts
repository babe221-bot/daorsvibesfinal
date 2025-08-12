import { ai } from '@/ai/genkit';
import {
  SuggestKeyChangeFromKeyInputSchema,
  SuggestKeyChangeOutputSchema,
} from './suggest-key-change.schemas';

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

export const suggestKeyChangeFromKeyFlow = ai.defineFlow(
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
