import type { ExtractSongDataOutput } from '@/ai/flows/extract-song-data-flow';
import type { SuggestKeyChangeOutput } from '@/ai/flows/suggest-key-change';

export interface SongDataExtractorState {
  result?: ExtractSongDataOutput;
  error?: string;
  message?: string;
}

export interface KeyChangeSuggesterState {
  result?: SuggestKeyChangeOutput;
  error?: string;
}

export type SongData = ExtractSongDataOutput;

// This type is no longer needed with client-side logic
// export interface SaveSongResult {
//   success?: boolean;
//   error?: string;
//   message?: string;
// }
