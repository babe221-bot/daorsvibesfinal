import SongPlayerPage from './song-player-page';
import { getSong } from '@/lib/firebase-admin';
import { notFound } from 'next/navigation';

interface SongPageProps {
  params: {
    id: string;
  };
}

export default async function SongPage({ params }: SongPageProps) {
  const song = await getSong(params.id);

  if (!song) {
    notFound();
  }

  return <SongPlayerPage song={song} />;
}
