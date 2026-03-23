import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Song } from './use-user-songs';

export function useSong(userId: string | null | undefined, songId: string) {
  const [song, setSong] = useState<Song | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    if (!userId || !songId) {
      setLoading(false);
      return;
    }

    const fetchSong = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('user_songs')
          .select('*')
          .eq('user_id', userId)
          .eq('id', songId)
          .single();

        if (error) throw error;

        if (data) {
          setSong(data as Song);
        } else {
          setError("Song not found.");
        }
      } catch (err) {
        console.error("Error fetching song:", err);
        setError("Failed to fetch song.");
      } finally {
        setLoading(false);
      }
    };

    fetchSong();
  }, [userId, songId]);

  return { song, loading, error };
}
