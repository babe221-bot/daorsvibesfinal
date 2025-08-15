import type { ExtractSongDataOutput } from '@/ai/flows/extract-song-data-flow';
import type { SuggestKeyChangeOutput } from '@/ai/flows/suggest-key-change';

export interface Song {
  id: string;
  title: string;
  artist?: string;
  lyrics?: string;
  simplifiedChords?: string;
  originalChords?: string;
  transposedChords?: string;
  transposedKey?: string;
  capo?: number;
  tags?: string[];
  comments?: string[];
  ratings?: number[];
  avgRating?: number;
  userId: string;
  lyricsAndChords: string;
}

export interface ExtractSongDataState {
  result?: ExtractSongDataOutput;
  error?: string;
  message?: string;
}

export interface KeyChangeSuggesterState {
  result?: SuggestKeyChangeOutput;
  error?: string;
}

export type SongData = ExtractSongDataOutput;
