import SongPlayerPage from './song-player-page';
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';

export default async function SongPage({ params }: any) {
  const supabase = await createClient();
  const { id } = await params;
  
  const { data: song, error } = await supabase
    .from('public_songs')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !song) {
    notFound();
  }

  return <SongPlayerPage song={song} />;
}
