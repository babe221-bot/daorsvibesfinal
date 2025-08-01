import { config } from 'dotenv';
config();

import '@/ai/flows/extract-song-data-flow.ts';
import '@/ai/flows/format-song-content-flow.ts';
import '@/ai/flows/simplify-chords-flow.ts';
