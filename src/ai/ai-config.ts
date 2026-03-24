import { createGoogleGenerativeAI } from '@ai-sdk/google';

if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY environment variable not set');
}

// Prepare abstraction layer:
// Later, if you want to switch to Ollama, you can import from 'ollama-ai-provider'
// and export the ollama model instead.

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// The exported default model. To switch AI providers, just change this instance!
export const defaultModel = google(process.env.GEMINI_MODEL || 'gemini-2.0-flash');
