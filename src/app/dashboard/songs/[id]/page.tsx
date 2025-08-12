"use client";
import React, { useEffect } from 'react';
import SongPlayer from '@/components/song-player';
import { notFound } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { useSong } from '@/hooks/use-song';

interface SongPageProps {
  params: {
    id: string;
  };
}

export default function SongPage({ params }: SongPageProps) {
  const { userId, loading: authLoading, error: authError } = useAuth();
  const { song, loading: songLoading, error: songError } = useSong(userId, params.id);

  useEffect(() => {
    if (!songLoading && !song) {
      notFound();
    }
  }, [songLoading, song]);

  if (authLoading || songLoading) {
    return <div>Loading...</div>;
  }

  const error = authError || songError;
  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!song) {
    return notFound();
  }

  return (
    <div className="h-screen">
      <SongPlayer song={song} />
    </div>
  );
}
