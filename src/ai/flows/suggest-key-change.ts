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
      key: z.string().describe('Predloženi tonalitet za promjenu.'),
      confidence: z.number().describe('Ocjena pouzdanosti za prijedlog (0-1).'),
    })
  ).describe('Lista predloženih promjena tonaliteta sa ocjenama pouzdanosti.'),
});
export type SuggestKeyChangeOutput = z.infer<typeof SuggestKeyChangeOutputSchema>;

export async function suggestKeyChange(input: SuggestKeyChangeInput): Promise<SuggestKeyChangeOutput> {
  return suggestKeyChangeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestKeyChangePrompt',
  input: {schema: SuggestKeyChangeInputSchema},
  output: {schema: SuggestKeyChangeOutputSchema},
  prompt: `Vi ste muzički stručnjak pokretan vještačkom inteligencijom. Vaš zadatak je da analizirate priloženi audio i predložite optimalne promjene tonaliteta za pjesmu.

Analizirajte audio sa sljedećeg URL-a: {{{audioUrl}}}

Predložite promjene tonaliteta koje bi olakšale izvođenje pjesme, zajedno sa ocjenama pouzdanosti za svaki prijedlog. Dajte najmanje 3 prijedloga.
Osigurajte da ocjene pouzdanosti odražavaju vašu sigurnost u tačnost svakog prijedloga za promjenu tonaliteta.

Formatirajte svoj izlaz kao JSON niz objekata, gdje svaki objekat sadrži predloženi tonalitet i odgovarajuću ocjenu pouzdanosti.
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
