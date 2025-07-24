import type { SuggestKeyChangeOutput } from '@/ai/flows/suggest-key-change';

export interface KeyChangeSuggesterState {
  result?: SuggestKeyChangeOutput;
  error?: string;
  message?: string;
}
