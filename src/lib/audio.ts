
let audioContext: AudioContext | null = null;

const createAudioContext = (): AudioContext | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContext) {
    console.error("Browser does not support Web Audio API");
    return null;
  }
  return new AudioContext();
}

export const getAudioContext = (): AudioContext | null => {
  if (!audioContext) {
    audioContext = createAudioContext();
  }
  return audioContext;
};

export const initAudio = async (): Promise<AudioContext | null> => {
  const context = getAudioContext();
  if (!context) {
    return null;
  }

  if (context.state === 'suspended') {
    try {
      await context.resume();
    } catch (error) {
      console.error("Failed to resume audio context:", error);
      return null;
    }
  }
  
  return context;
};
