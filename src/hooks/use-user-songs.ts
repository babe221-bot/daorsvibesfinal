import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export interface Song {
  id: string;
  user_id?: string;
  title: string;
  artist?: string;
  lyricsAndChords: string;
  created_at?: string;
  url?: string;
}

export function useUserSongs(userId: string | null | undefined) {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);

    const fetchSongs = async () => {
      try {
        const { data, error } = await supabase
          .from('user_songs')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setSongs(data || []);
      } catch (err) {
        console.error('Error fetching user songs:', err);
        setError('Failed to load your songs.');
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();

    // Set up realtime subscription
    const subscription = supabase
      .channel(`user_songs_${userId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'user_songs', filter: `user_id=eq.${userId}` }, () => {
        fetchSongs(); // Re-fetch on any change
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [userId]);

  return { songs, loading, error };
}
