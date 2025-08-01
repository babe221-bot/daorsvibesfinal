import type { ExtractSongDataOutput } from '@/ai/flows/extract-song-data-flow';

export interface SongDataExtractorState {
  result?: ExtractSongDataOutput;
  error?: string;
  message?: string;
}

export interface SaveSongResult {
  success?: boolean;
  error?: string;
  message?: string;
}
