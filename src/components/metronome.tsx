
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Play, Pause } from 'lucide-react';
import './metronome.css';

export function Metronome() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [tempo, setTempo] = useState(120);
  const [beat, setBeat] = useState(1);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleTempoChange = (value: number[]) => {
    setTempo(value[0]);
  };

  const startStop = () => {
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setBeat((prevBeat) => (prevBeat % 4) + 1);
      }, (60 / tempo) * 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      setBeat(1);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, tempo]);

  return (
    <div className="flex flex-col items-center p-6 rounded-lg bg-gray-800 text-white">
      <div className="w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <div className="text-lg">Tempo: {tempo} BPM</div>
          <div className="flex space-x-2">
            <div className={`beat-indicator ${beat === 1 ? 'active' : ''}`}></div>
            <div className={`beat-indicator ${beat === 2 ? 'active' : ''}`}></div>
            <div className={`beat-indicator ${beat === 3 ? 'active' : ''}`}></div>
            <div className={`beat-indicator ${beat === 4 ? 'active' : ''}`}></div>
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
        <Button onClick={startStop} className="w-full">
          {isPlaying ? <Pause className="mr-2" /> : <Play className="mr-2" />}
          {isPlaying ? 'Stop' : 'Start'}
        </Button>
      </div>
    </div>
  );
}
