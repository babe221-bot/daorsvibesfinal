import { useState, useEffect } from 'react';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { auth } from '@/lib/firebase-client';
import { Song } from './use-user-songs'; // Reuse the Song interface

const db = getFirestore(auth.app);

export function useSong(userId: string | null | undefined, songId: string) {
  const [song, setSong] = useState<Song | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId || !songId) {
      setLoading(false);
      return;
    }

    const fetchSong = async () => {
      setLoading(true);
      try {
        const songDocRef = doc(db, `users/${userId}/songs`, songId);
        const songDoc = await getDoc(songDocRef);

        if (songDoc.exists()) {
          setSong({ id: songDoc.id, ...songDoc.data() } as Song);
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
