import { z } from 'zod';

export const SuggestKeyChangeOutputSchema = z.object({
  detectedKey: z.string().describe('The original key detected in the audio.'),
  suggestedKeyChanges: z
    .array(
      z.object({
        key: z.string().describe('Suggested new key.'),
        confidence: z
          .number()
          .describe('Confidence score for the suggestion (0-1).'),
        justification: z.string().describe('Reasoning for the suggestion.'),
      })
    )
    .describe(
      'List of suggested key changes with confidence scores and justifications.'
    ),
});

export const SuggestKeyChangeInputSchema = z.object({
  audioUrl: z
    .string()
    .url()
    .describe('URL of the audio file to analyze (must be a .wav file).'),
});

export const SuggestKeyChangeFromKeyInputSchema = z.object({
  detectedKey: z
    .string()
    .describe('The detected musical key of a song (e.g., "A Minor").'),
});
