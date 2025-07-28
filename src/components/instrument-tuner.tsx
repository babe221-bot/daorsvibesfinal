"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import './instrument-tuner.css';

const noteStrings = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

const notePresets = {
    guitar: {
        name: 'Guitar',
        notes: [
            { value: 'autodetect', text: 'Autodetect' },
            { value: 'E4', text: 'E4 (1st string)' },
            { value: 'B3', text: 'B3 (2nd string)' },
            { value: 'G3', text: 'G3 (3rd string)' },
            { value: 'D3', text: 'D3 (4th string)' },
            { value: 'A2', text: 'A2 (5th string)' },
            { value: 'E2', text: 'E2 (6th string)' }
        ]
    },
    bass: {
        name: 'Bass',
        notes: [
            { value: 'G2', text: 'G2 (1st string)' },
            { value: 'D2', text: 'D2 (2nd string)' },
            { value: 'A1', text: 'A1 (3rd string)' },
            { value: 'E1', text: 'E1 (4th string)' }
        ]
    },
    ukulele: {
        name: 'Ukulele',
        notes: [
            { value: 'A4', text: 'A4 (1st string)' },
            { value: 'E4', text: 'E4 (2nd string)' },
            { value: 'C4', text: 'C4 (3rd string)' },
            { value: 'G4', text: 'G4 (4th string)' }
        ]
    },
    drum: {
        name: 'Drum',
        notes: [
            { value: 'G3', text: 'G3 (Snare)' },
            { value: 'C3', text: 'C3 (High Tom)' },
            { value: 'G2', text: 'G2 (Low Tom)' },
            { value: 'E2', text: 'E2 (Kick)' }
        ]
    },
};

type TunerMode = keyof typeof notePresets;

const noteToFreq = (note: string): number => {
    const noteParts = note.match(/([A-G]#?)([0-9])/);
    if (!noteParts) return 0;
    const keyNumber = noteStrings.indexOf(noteParts[1]);
    const octave = parseInt(noteParts[2], 10);
    if (keyNumber === -1) return 0;
    const semiTone = (octave - 4) * 12 + keyNumber - 9;
    return 440 * Math.pow(2, semiTone / 12);
};

export default function InstrumentTuner() {
    const { toast } = useToast();
    const [isTuning, setIsTuning] = useState(false);
    const [note, setNote] = useState('--');
    const [frequency, setFrequency] = useState(0);
    const [cents, setCents] = useState(0);
    const [mode, setMode] = useState<TunerMode>('guitar');
    const [targetNote, setTargetNote] = useState(notePresets.guitar.notes[0].value);

    const toneRef = useRef<any>(null);
    const analyserRef = useRef<any>(null);
    const micRef = useRef<any>(null);
    const animationFrameRef = useRef<number | null>(null);

    const startTuning = async () => {
        try {
            if (!toneRef.current) {
                toneRef.current = await import('tone');
            }
            const Tone = toneRef.current;
            await Tone.start();
            micRef.current = new Tone.UserMedia();
            await micRef.current.open();

            analyserRef.current = new Tone.Analyser('fft', 2048);
            micRef.current.connect(analyserRef.current);
            setIsTuning(true);
        } catch (error) {
            console.error("Error initializing audio:", error);
            toast({
                variant: "destructive",
                title: "Microphone Error",
                description: "Could not access microphone. Please allow microphone access in your browser settings.",
            });
        }
    };

    const stopTuning = () => {
        if (micRef.current) {
            micRef.current.close();
        }
        setIsTuning(false);
        setNote('--');
        setFrequency(0);
        setCents(0);
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }
    };
    
    const findFundamentalFreq = (fftData: Float32Array, sampleRate: number): number => {
        let maxVal = -Infinity;
        let maxIndex = -1;

        for (let i = 1; i < fftData.length; i++) {
            if (fftData[i] > maxVal) {
                maxVal = fftData[i];
                maxIndex = i;
            }
        }
        
        if (maxVal < -70) return 0;

        const freq = maxIndex * sampleRate / (analyserRef.current!.size * 2);
        return (freq > 30 && freq < 1200) ? freq : 0;
    };

    const freqToNoteDetails = (freq: number) => {
        const noteNum = 12 * (Math.log(freq / 440) / Math.log(2));
        const roundedNoteNum = Math.round(noteNum) + 69;
        const noteName = noteStrings[roundedNoteNum % 12];
        const octave = Math.floor(roundedNoteNum / 12) - 1;
        return { name: `${noteName}${octave}`, noteName, octave, roundedNoteNum };
    };

    const tuningLoop = () => {
        if (!isTuning || !analyserRef.current || !toneRef.current) return;
        const Tone = toneRef.current;
        const fftData = analyserRef.current.getValue();
        if (fftData instanceof Float32Array) {
            const fundamentalFreq = findFundamentalFreq(fftData, Tone.context.sampleRate);
            
            if (fundamentalFreq > 0) {
                const currentNoteDetails = freqToNoteDetails(fundamentalFreq);
                setNote(currentNoteDetails.name);
                setFrequency(fundamentalFreq);

                let noteToCompare = targetNote;

                if (mode === 'guitar' && targetNote === 'autodetect') {
                    let minDiff = Infinity;
                    let closestNote = '';
                    
                    notePresets.guitar.notes.forEach(preset => {
                        if (preset.value !== 'autodetect') {
                            const presetFreq = noteToFreq(preset.value);
                            const diff = Math.abs(fundamentalFreq - presetFreq);
                            if (diff < minDiff) {
                                minDiff = diff;
                                closestNote = preset.value;
                            }
                        }
                    });
                    noteToCompare = closestNote;
                }
                
                const targetFreq = noteToFreq(noteToCompare);
                if (targetFreq > 0) {
                    const centsOff = 1200 * Math.log2(fundamentalFreq / targetFreq);
                    setCents(centsOff);
                }

            }
        }
        animationFrameRef.current = requestAnimationFrame(tuningLoop);
    };

    useEffect(() => {
        if (isTuning) {
            tuningLoop();
        }
        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [isTuning, targetNote, mode]);
    
    useEffect(() => {
        stopTuning();
        setTargetNote(notePresets[mode].notes[0].value);
    }, [mode]);

    const needleRotation = Math.max(-45, Math.min(45, cents * 0.9));
    const isNoteInTune = Math.abs(cents) < 5;

    return (
        <div className="flex flex-col items-center justify-center p-4">
            <div className="tuner-mode-switch mb-6">
                {(Object.keys(notePresets) as TunerMode[]).map((key) => (
                    <button 
                        key={key}
                        onClick={() => setMode(key)} 
                        className={cn(mode === key && 'active')}
                    >
                        {notePresets[key].name}
                    </button>
                ))}
            </div>
            
            <div className="flex items-center justify-center space-x-3 mb-4 text-white">
                <label htmlFor="target-note" className="font-semibold">Target Note:</label>
                <Select value={targetNote} onValueChange={setTargetNote} disabled={isTuning}>
                    <SelectTrigger id="target-note" className="w-[200px] bg-white/10 border-white/30">
                        <SelectValue placeholder="Select a note" />
                    </SelectTrigger>
                    <SelectContent>
                        {notePresets[mode].notes.map(note => (
                            <SelectItem key={note.value} value={note.value}>{note.text}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            
            <div className="tuner-display my-4">
                <div 
                    id="needle" 
                    className={cn('needle', isNoteInTune && 'in-tune')} 
                    style={{ transform: `rotate(${needleRotation}deg)` }}
                ></div>
                {Array.from({ length: 9 }).map((_, i) => {
                    const angle = (i - 4) * 11;
                    return (
                        <div key={i} className="tick-container" style={{ transform: `rotate(${angle}deg)` }}>
                            <div className={cn("tick", i === 4 && "tick-center")}></div>
                            {(i % 2 === 0) && (
                                <div className="tick-label" style={{ transform: `rotate(${-angle}deg) translateX(-50%)` }}>
                                    {(i - 4) * 10}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="text-center my-4 text-white">
                <div className="note-display">{note}</div>
                <div className="freq-display">{frequency.toFixed(2)} Hz</div>
            </div>

            <div className="flex items-center justify-center space-x-4">
                <div className={cn("status-light", isTuning && "active")}></div>
                {!isTuning ? (
                    <Button onClick={startTuning} className="bg-primary hover:bg-primary/90 text-primary-foreground w-32">Start</Button>
                ) : (
                    <Button onClick={stopTuning} variant="destructive" className="w-32">Stop</Button>
                )}
            </div>
        </div>
    );
}
