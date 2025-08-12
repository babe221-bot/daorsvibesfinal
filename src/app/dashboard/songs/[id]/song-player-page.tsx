"use client";
import React from 'react';
import SongPlayer from '@/components/song-player';
import { Song } from '@/lib/types';

interface SongPlayerPageProps {
  song: Song;
}

export default function SongPlayerPage({ song }: SongPlayerPageProps) {
  return (
    <div className="h-screen">
      <SongPlayer song={song} />
    </div>
  );
}
