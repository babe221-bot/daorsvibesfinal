import SongPlayerPage from './song-player-page';
import { getSong } from '@/lib/firebase-admin';
import { notFound } from 'next/navigation';

export default async function SongPage({ params }: any) {
  const song = await getSong(params.id);

  if (!song) {
    notFound();
  }

  return <SongPlayerPage song={song} />;
}
