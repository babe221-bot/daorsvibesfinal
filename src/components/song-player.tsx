"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, ZoomIn, ZoomOut, Plus, Minus } from 'lucide-react';

interface Song {
  id: string;
  title: string;
  artist?: string;
  lyricsAndChords: string;
}

interface SongPlayerProps {
  song: Song;
}

const SongPlayer: React.FC<SongPlayerProps> = ({ song }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(1);
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<number | null>(null);

  const startScrolling = useCallback(() => {
    if (contentRef.current) {
      const scroll = () => {
        if (contentRef.current) {
          contentRef.current.scrollTop += scrollSpeed / 10;
          scrollRef.current = requestAnimationFrame(scroll);
        }
      };
      scrollRef.current = requestAnimationFrame(scroll);
    }
  }, [scrollSpeed]);

  const stopScrolling = () => {
    if (scrollRef.current) {
      cancelAnimationFrame(scrollRef.current);
      scrollRef.current = null;
    }
  };

  useEffect(() => {
    if (isPlaying) {
      startScrolling();
    } else {
      stopScrolling();
    }
    return () => stopScrolling();
  }, [isPlaying, scrollSpeed, startScrolling]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.1, 0.5));
  };

  const handleSpeedChange = (value: number[]) => {
    setScrollSpeed(value[0]);
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{song.title}</h1>
          <p className="text-lg">{song.artist}</p>
        </div>
        <div className="flex items-center gap-4">
          <Button onClick={togglePlay} variant="ghost" size="icon">
            {isPlaying ? <Pause /> : <Play />}
          </Button>
          <div className="flex items-center gap-2">
            <Minus />
            <Slider
              min={0.1}
              max={5}
              step={0.1}
              value={[scrollSpeed]}
              onValueChange={handleSpeedChange}
              className="w-32"
            />
            <Plus />
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={handleZoomOut} variant="ghost" size="icon">
              <ZoomOut />
            </Button>
            <span>{Math.round(zoomLevel * 100)}%</span>
            <Button onClick={handleZoomIn} variant="ghost" size="icon">
              <ZoomIn />
            </Button>
          </div>
        </div>
      </div>
      <div
        ref={contentRef}
        className="flex-grow overflow-auto p-8"
        style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top' }}
      >
        <pre className="whitespace-pre-wrap font-mono text-lg">
          {song.lyricsAndChords}
        </pre>
      </div>
    </div>
  );
};

export default SongPlayer;
