"use client";

import React, { useState, useEffect } from 'react';
import { getFirestore, doc, getDoc, Firestore, DocumentData } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import app from '@/lib/firebase';
import SongPlayer from '@/components/song-player';
import { notFound } from 'next/navigation';

interface Song extends DocumentData {
  id: string;
  title: string;
  artist?: string;
  lyricsAndChords: string;
}

export default function SongPage({ params }: { params: { id: string } }) {
  const [song, setSong] = useState<Song | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [db, setDb] = useState<Firestore | null>(null);
  const [auth, setAuth] = useState<any>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const firestoreDb = getFirestore(app);
      const firebaseAuth = getAuth(app);
      setDb(firestoreDb);
      setAuth(firebaseAuth);
      const unsubscribe = onAuthStateChanged(firebaseAuth, async (user: User | null) => {
        if (user) {
          setUserId(user.uid);
        }
      });
      return () => unsubscribe();
    } catch (e) {
      console.error("Firebase init failed:", e);
      setError("Inicijalizacija aplikacije nije uspjela.");
    }
  }, []);

  useEffect(() => {
    if (db && userId) {
      const fetchSong = async () => {
        setLoading(true);
        try {
          const songDocRef = doc(db, `users/${userId}/songs`, params.id);
          const songDoc = await getDoc(songDocRef);

          if (songDoc.exists()) {
            setSong({ id: songDoc.id, ...songDoc.data() } as Song);
          } else {
            setError("Song not found.");
            notFound();
          }
        } catch (err) {
          console.error("Error fetching song:", err);
          setError("Failed to fetch song.");
        } finally {
          setLoading(false);
        }
      };

      fetchSong();
    }
  }, [db, userId, params.id]);

  if (loading) {
    return <div>Loading...</div>;
  }

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
