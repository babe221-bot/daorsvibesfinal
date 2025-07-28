export const noteStrings = [
  "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"
];

// A4 is 440 Hz
const A4 = 440;
const C0 = A4 * Math.pow(2, -4.75);

export function getNote(frequency: number): { name: string; value: number; octave: number } | null {
  if (frequency === 0) return null;
  const noteValue = Math.round(12 * (Math.log(frequency / C0) / Math.log(2)));
  const noteName = noteStrings[noteValue % 12];
  const octave = Math.floor(noteValue / 12);
  return {
    name: noteName,
    value: noteValue,
    octave: octave
  };
}

export function getCents(frequency: number, noteValue: number): number {
  if (frequency === 0) return 0;
  const idealFrequency = C0 * Math.pow(2, noteValue / 12);
  return Math.floor(1200 * Math.log2(frequency / idealFrequency));
}
