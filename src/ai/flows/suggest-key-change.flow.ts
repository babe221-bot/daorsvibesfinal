import { generateObject } from 'ai';
import { defaultModel } from '@/ai/ai-config';
import {
  SuggestKeyChangeFromKeyInputSchema,
  SuggestKeyChangeOutputSchema,
} from './suggest-key-change.schemas';
import type { z } from 'zod';

type SuggestKeyChangeFromKeyInput = z.infer<typeof SuggestKeyChangeFromKeyInputSchema>;
type SuggestKeyChangeOutput = z.infer<typeof SuggestKeyChangeOutputSchema>;

export async function suggestKeyChangeFromKeyFlow(input: SuggestKeyChangeFromKeyInput): Promise<SuggestKeyChangeOutput> {
  const parsedInput = SuggestKeyChangeFromKeyInputSchema.safeParse(input);
  if (!parsedInput.success) {
    throw new Error('Invalid input');
  }

  const { object } = await generateObject({
    model: defaultModel,
    schema: SuggestKeyChangeOutputSchema,
    system: "You are a music theory expert AI.",
    prompt: `A song's key has been detected as ${parsedInput.data.detectedKey}.
Your task is to suggest three alternative keys that would be suitable for different vocal ranges or to create a different mood.
For each suggestion, provide the new key, a confidence score (from 0 to 1), and a brief justification for why it's a good alternative.

Format your output as a JSON object that strictly follows the defined schema.
The original detected key should also be included in the output object.`,
  });

  return object;
}
