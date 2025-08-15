
import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, DocumentData, Timestamp } from 'firebase/firestore';
import { firestore } from '@/lib/firebase-client';

export interface Song extends DocumentData {
  id: string;
  title: string;
  artist?: string;
  lyricsAndChords: string;
  timestamp?: Timestamp;
}

export function useUserSongs(userId: string | null | undefined) {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const userSongsCollectionRef = collection(firestore, `users/${userId}/songs`);
    const q = query(userSongsCollectionRef);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedSongs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Song[];
      fetchedSongs.sort((a, b) => (b.timestamp?.toDate()?.getTime() || 0) - (a.timestamp?.toDate()?.getTime() || 0));
      setSongs(fetchedSongs);
      setLoading(false);
    }, (err) => {
      console.error('Error fetching user songs:', err);
      setError('Failed to load your songs.');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  return { songs, loading, error };
}
