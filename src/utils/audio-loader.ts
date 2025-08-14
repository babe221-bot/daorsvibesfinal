// Utility for dynamically loading audio libraries to reduce initial bundle size

export const loadTone = async () => {
  // Dynamically import Tone.js only when needed
  const tone = await import('tone');
  return tone;
};

export const loadAubio = async () => {
  // Dynamically import aubiojs only when needed
  const aubio = await import('aubiojs');
  return aubio;
};