"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Play, Pause } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import './metronome.css';

export function Metronome() {
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = useState(false);
  const [tempo, setTempo] = useState(120);
  const [beatsPerMeasure, setBeatsPerMeasure] = useState(4);
  const [currentBeat, setCurrentBeat] = useState(0);

  const audioContextRef = useRef<AudioContext | null>(null);
  const nextNoteTimeRef = useRef<number>(0);
  const scheduleAheadTime = 0.1;
  const timerRef = useRef<number | null>(null);

  const scheduleNote = () => {
    if (!audioContextRef.current) return;
    
    while (nextNoteTimeRef.current < audioContextRef.current.currentTime + scheduleAheadTime) {
      const isFirstBeat = (currentBeat % beatsPerMeasure) === 0;
      playClick(isFirstBeat, nextNoteTimeRef.current);
      
      const secondsPerBeat = 60.0 / tempo;
      nextNoteTimeRef.current += secondsPerBeat;
      setCurrentBeat(prev => (prev + 1) % beatsPerMeasure);
    }
    
    timerRef.current = window.setTimeout(scheduleNote, 25.0);
  };
  
  const playClick = (isFirstBeat: boolean, time: number) => {
    if (!audioContextRef.current) return;
    const osc = audioContextRef.current.createOscillator();
    const gain = audioContextRef.current.createGain();
    
    osc.frequency.setValueAtTime(isFirstBeat ? 1000 : 800, time);
    gain.gain.setValueAtTime(1, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);

    osc.connect(gain);
    gain.connect(audioContextRef.current.destination);
    
    osc.start(time);
    osc.stop(time + 0.05);
  };

  const startStop = async () => {
    if (isPlaying) {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
      setIsPlaying(false);
      setCurrentBeat(0);
      if (audioContextRef.current && audioContextRef.current.state === 'running') {
        await audioContextRef.current.suspend();
      }
    } else {
      try {
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        if (audioContextRef.current.state === 'suspended') {
          await audioContextRef.current.resume();
        }
        nextNoteTimeRef.current = audioContextRef.current.currentTime;
        setCurrentBeat(0);
        setIsPlaying(true);
        scheduleNote();
      } catch (error) {
         toast({
            variant: "destructive",
            title: "Audio Error",
            description: "Could not start audio context. Please allow audio playback in your browser settings.",
        });
      }
    }
  };

  const handleTempoChange = (value: number[]) => {
    setTempo(value[0]);
  };
  
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      if (audioContextRef.current && audioContextRef.current.state === 'running') {
        audioContextRef.current.close();
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center p-6 rounded-lg bg-white/10 text-white shadow-xl backdrop-blur-lg border border-white/20">
      <div className="w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <div className="text-lg font-bold">Tempo: {tempo} BPM</div>
          <div className="flex space-x-2">
            {Array.from({ length: beatsPerMeasure }).map((_, i) => (
                <div key={i} className={`beat-indicator ${isPlaying && currentBeat === i ? 'active' : ''}`}></div>
            ))}
          </div>
        </div>
        <Slider
          min={40}
          max={220}
          step={1}
          value={[tempo]}
          onValueChange={handleTempoChange}
          className="mb-6"
        />
        <Button onClick={startStop} className="w-full text-lg py-6 bg-white text-black hover:bg-gray-200 shadow-lg">
          {isPlaying ? <Pause className="mr-2 h-6 w-6" /> : <Play className="mr-2 h-6 w-6" />}
          {isPlaying ? 'Stop' : 'Start'}
        </Button>
      </div>
    </div>
  );
}
