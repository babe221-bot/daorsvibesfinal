import type { SuggestKeyChangeOutput } from '@/ai/flows/suggest-key-change';
import type { ExtractSongDataOutput } from '@/ai/flows/extract-song-data-flow';

export interface KeyChangeSuggesterState {
  result?: SuggestKeyChangeOutput;
  error?: string;
  message?: string;
}

export interface SongDataExtractorState {
  result?: ExtractSongDataOutput;
  error?: string;
  message?: string;
}
