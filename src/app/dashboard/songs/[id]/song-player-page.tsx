"use client";
import React from 'react';
import SongPlayer from '@/components/song-player';
import { Song } from '@/lib/types';
import { ErrorBoundary } from '@/components/error-boundary';

interface SongPlayerPageProps {
  song: Song;
}

export default function SongPlayerPage({ song }: SongPlayerPageProps) {
  return (
    <div className="h-screen">
      <ErrorBoundary>
        <SongPlayer song={song} />
      </ErrorBoundary>
    </div>
  );
}
