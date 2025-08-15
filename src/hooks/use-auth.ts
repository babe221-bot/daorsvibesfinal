
import { useState, useEffect } from 'react';
import { onAuthStateChanged, signInAnonymously, User } from 'firebase/auth';
import { auth } from '@/lib/firebase-client';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
      } else {
        try {
          const userCredential = await signInAnonymously(auth);
          setUser(userCredential.user);
        } catch (e) {
          console.error('Anonymous sign-in failed:', e);
          setError('Authentication failed. Please try again.');
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, userId: user?.uid, loading, error };
}
