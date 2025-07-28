"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Play, Pause, Plus, Minus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import './metronome.css';

export function Metronome() {
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = useState(false);
  const [tempo, setTempo] = useState(120);
  const [beatsPerMeasure, setBeatsPerMeasure] = useState(4);
  const [currentBeat, setCurrentBeat] = useState(-1);
  const [needleRotation, setNeedleRotation] = useState(0);

  const audioContextRef = useRef<AudioContext | null>(null);
  const nextNoteTimeRef = useRef<number>(0);
  const scheduleAheadTime = 0.1;
  const timerRef = useRef<number | null>(null);
  const beatCountRef = useRef<number>(0);

  const scheduleNote = useCallback(() => {
    if (!audioContextRef.current) return;
    
    const secondsPerBeat = 60.0 / tempo;

    while (nextNoteTimeRef.current < audioContextRef.current.currentTime + scheduleAheadTime) {
      const isFirstBeat = (beatCountRef.current % beatsPerMeasure) === 0;
      playClick(isFirstBeat, nextNoteTimeRef.current);
      
      const currentBeatIndex = beatCountRef.current % beatsPerMeasure;
      const rotationAngle = 25 * ((beatCountRef.current % 2 === 0) ? 1 : -1);

      setTimeout(() => {
          setCurrentBeat(currentBeatIndex);
          setNeedleRotation(rotationAngle);
      }, (nextNoteTimeRef.current - audioContextRef.current.currentTime) * 1000);

      nextNoteTimeRef.current += secondsPerBeat;
      beatCountRef.current = beatCountRef.current + 1;
    }
    
    timerRef.current = window.setTimeout(scheduleNote, 25.0);
  }, [beatsPerMeasure, tempo]);
  
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
      if (audioContextRef.current && audioContextRef.current.state === 'running') {
        await audioContextRef.current.suspend();
      }
      // Reset needle after a short delay
      setTimeout(() => {
        setNeedleRotation(0);
        setCurrentBeat(-1)
      }, 100);

    } else {
      try {
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        if (audioContextRef.current.state === 'suspended') {
          await audioContextRef.current.resume();
        }
        nextNoteTimeRef.current = audioContextRef.current.currentTime + 0.1; // Add a small buffer
        beatCountRef.current = 0;
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

  const adjustTempo = (amount: number) => {
    setTempo(prev => Math.max(40, Math.min(220, prev + amount)));
  };

  const pendulumWeightPosition = 100 - ((tempo - 40) / (220 - 40)) * 100;
  
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
  
   useEffect(() => {
    if (isPlaying) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      scheduleNote();
    }
  }, [tempo, isPlaying, scheduleNote]);

  return (
    <div className="flex flex-col items-center p-4 rounded-lg bg-white/10 text-white shadow-xl backdrop-blur-lg border border-white/20">
      <div className="w-full max-w-md flex flex-col items-center">
        
        <div className="metronome-container">
            <div className="metronome-body">
                <div className="metronome-front">
                    <div className="metronome-scale">
                        <div className="tick" data-bpm="220"></div>
                        <div className="tick"></div>
                        <div className="tick" data-bpm="180"></div>
                        <div className="tick"></div>
                        <div className="tick" data-bpm="140"></div>
                         <div className="tick"></div>
                        <div className="tick" data-bpm="100"></div>
                         <div className="tick"></div>
                        <div className="tick" data-bpm="60"></div>
                         <div className="tick"></div>
                    </div>
                    <div 
                        className="metronome-pendulum"
                        style={{
                            transform: `rotate(${isPlaying ? needleRotation : 0}deg)`,
                            transitionDuration: isPlaying ? `${60 / tempo}s` : '0.5s',
                        }}
                    >
                      <div className="pendulum-weight" style={{ top: `${pendulumWeightPosition}%` }}></div>
                    </div>
                </div>
            </div>
        </div>

        <div className="metronome-display">
            <div className="tempo-display">{tempo}</div>
            <div className="bpm-label">BPM</div>
        </div>
        
        <div className="w-full my-6">
             <div className="flex items-center justify-center gap-4">
                <Button onClick={() => adjustTempo(-1)} variant="outline" size="icon" className="rounded-full h-12 w-12 bg-white/20 border-0">
                    <Minus />
                </Button>
                <Slider
                    min={40}
                    max={220}
                    step={1}
                    value={[tempo]}
                    onValueChange={handleTempoChange}
                    className="flex-1"
                />
                <Button onClick={() => adjustTempo(1)} variant="outline" size="icon" className="rounded-full h-12 w-12 bg-white/20 border-0">
                    <Plus />
                </Button>
             </div>
        </div>

         <div className="flex space-x-3 mb-6">
            {Array.from({ length: beatsPerMeasure }).map((_, i) => (
                <div key={i} className={`beat-indicator ${isPlaying && currentBeat === i ? 'active' : ''}`}></div>
            ))}
        </div>

        <Button onClick={startStop} className="w-40 h-16 text-lg rounded-full bg-white text-black hover:bg-gray-200 shadow-lg flex items-center justify-center">
          {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
        </Button>
      </div>
    </div>
  );
}
