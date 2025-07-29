"use client";
import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, addDoc, query, onSnapshot, deleteDoc, doc, serverTimestamp, where, getDocs } from 'firebase/firestore';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

// --- Modal Component for displaying AI-generated content ---
const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                {children}
            </DialogContent>
        </Dialog>
    );
};


function SongLibrary() {
  // --- State Management ---
  const [db, setDb] = useState(null);
  const [auth, setAuth] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [songTitle, setSongTitle] = useState('');
  const [songArtist, setSongArtist] = useState('');
  const [lyricsAndChords, setLyricsAndChords] = useState('');
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);


  // --- Global variables from Canvas environment ---
  const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
  const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;


  // --- Firebase Initialization and Auth ---
  useEffect(() => {
    try {
      const app = initializeApp(firebaseConfig);
      const firestoreDb = getFirestore(app);
      const firebaseAuth = getAuth(app);
      setDb(firestoreDb);
      setAuth(firebaseAuth);
      const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
        if (user) {
          setUserId(user.uid);
        } else {
          try {
            if (initialAuthToken) {
              await signInWithCustomToken(firebaseAuth, initialAuthToken);
            } else {
              await signInAnonymously(firebaseAuth);
            }
          } catch (e) {
            console.error("Firebase auth failed:", e);
            setError("Authentication failed.");
            setUserId(crypto.randomUUID());
          }
        }
        setIsAuthReady(true);
      });
      return () => unsubscribe();
    } catch (e) {
      console.error("Firebase init failed:", e);
      setError("Failed to initialize the application.");
    }
  }, [firebaseConfig, initialAuthToken]);

  // --- Firestore Song Fetching ---
  useEffect(() => {
    if (db && userId && isAuthReady) {
      const userSongsCollectionRef = collection(db, `users/${userId}/songs`);
      const q = query(userSongsCollectionRef);
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedSongs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        fetchedSongs.sort((a, b) => (b.timestamp?.toDate() || 0) - (a.timestamp?.toDate() || 0));
        setSongs(fetchedSongs);
      }, (err) => {
        console.error("Error fetching user songs:", err);
        setError("Failed to load your songs.");
      });
      return () => unsubscribe();
    }
  }, [db, userId, isAuthReady]);


  // --- Gemini API Call Helper ---
  const callGemini = async (prompt) => {
      const apiKey = ""; // Handled by environment
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
      const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }] };
      const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error(`API request failed: ${response.status}`);
      const result = await response.json();
      const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error("Invalid API response.");
      return text;
  };

  const handleSimplifyChords = async (song) => {
      setIsAiLoading(true);
      setError('');
      try {
          const prompt = `Simplify the chords for the following song:

Title: ${song.title}
Artist: ${song.artist}

${song.lyricsAndChords}`;
          const simplifiedText = await callGemini(prompt);
          setModalTitle(`Simplified Chords for "${song.title}"`);
          setModalContent(simplifiedText);
          setIsModalOpen(true);
      } catch (err) {
          console.error("Error simplifying chords:", err);
          setError("Could not simplify chords.");
      } finally {
          setIsAiLoading(false);
      }
  };

  const handleSaveSong = async () => {
    if (!db || !userId) {
      setError("Database not connected.");
      return;
    }
    if (songTitle.length < 2) {
      setError("Title must be at least 2 characters long.");
      return;
    }
    if (lyricsAndChords.length < 10) {
      setError("Lyrics and chords must be at least 10 characters long.");
      return;
    }
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const userSongsCollectionRef = collection(db, `users/${userId}/songs`);
      await addDoc(userSongsCollectionRef, {
        title: songTitle,
        artist: songArtist,
        lyricsAndChords: lyricsAndChords,
        timestamp: serverTimestamp(),
      });
      setMessage("Song saved successfully!");
      setSongTitle('');
      setSongArtist('');
      setLyricsAndChords('');
    } catch (err) {
      console.error("Error saving song:", err);
      setError("Failed to save song.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSong = async (songId) => {
    if (!db || !userId) { setError("Database not connected."); return; }
    setLoading(true);
    setError('');
    try {
      await deleteDoc(doc(db, `users/${userId}/songs`, songId));
      setMessage("Song deleted.");
    } catch (err) {
      console.error("Error deleting song:", err);
      setError("Failed to delete song.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchPublicSongs = async () => {
    if (!db) {
      setError("Database not connected.");
      return;
    }
    if (searchQuery.length < 2) {
      setError("Search query must be at least 2 characters long.");
      return;
    }
    setIsSearching(true);
    setError('');
    setSearchResults([]);
    try {
      const publicSongsRef = collection(db, 'songs');
      const titleQuery = query(publicSongsRef, where("title", ">=", searchQuery), where("title", "<=", searchQuery + '\uf8ff'));
      const artistQuery = query(publicSongsRef, where("artist", ">=", searchQuery), where("artist", "<=", searchQuery + '\uf8ff'));
      
      const [titleSnapshot, artistSnapshot] = await Promise.all([getDocs(titleQuery), getDocs(artistQuery)]);

      const results = {};
      titleSnapshot.forEach(doc => results[doc.id] = { id: doc.id, ...doc.data() });
      artistSnapshot.forEach(doc => results[doc.id] = { id: doc.id, ...doc.data() });
      
      setSearchResults(Object.values(results));
    } catch (err) {
      console.error("Error searching public songs:", err);
      setError("Failed to search for songs.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddSongFromPublicRepo = async (song) => {
    if (!db || !userId) { setError("Database not connected."); return; }
    setLoading(true);
    setError('');
    try {
        const userSongsCollectionRef = collection(db, `users/${userId}/songs`);
        // Check if the user already has this song
        const q = query(userSongsCollectionRef, where("title", "==", song.title), where("artist", "==", song.artist));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            setMessage("This song is already in your library.");
            setLoading(false);
            return;
        }

        await addDoc(userSongsCollectionRef, {
            ...song,
            timestamp: serverTimestamp(), // Add a new timestamp
        });
        setMessage(`"${song.title}" added to your library!`);
    } catch (err) {
        console.error("Error adding song from public repo:", err);
        setError("Failed to add song to your library.");
    } finally {
        setLoading(false);
    }
  }

  // --- JSX Rendering ---
  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-8 flex flex-col items-center">
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalTitle}>
          <pre className="bg-muted p-4 rounded-lg text-muted-foreground text-sm font-mono whitespace-pre-wrap">{modalContent}</pre>
      </Modal>

      {(loading || isAiLoading || isSearching) && (
          <div className="fixed top-4 right-4 bg-primary text-primary-foreground py-2 px-4 rounded-lg shadow-lg z-50 flex items-center">
              <Progress value={50} className="w-full" />
              {isSearching ? 'Searching...' : (isAiLoading ? 'AI is thinking...' : 'Loading...')}
          </div>
      )}

      <div className="w-full max-w-4xl">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-center mb-8">Song Library</h1>

        {error && <div className="bg-destructive text-destructive-foreground p-4 rounded-lg mb-4 text-center">{error}</div>}
        {message && <div className="bg-primary text-primary-foreground p-4 rounded-lg mb-4 text-center">{message}</div>}
        
        <Card className="mb-8">
            <CardHeader><CardTitle>Search Public Song Repository</CardTitle></CardHeader>
            <CardContent>
                <div className="flex flex-col sm:flex-row gap-4">
                    <Input type="text" placeholder="Search by song title or artist..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="flex-grow"/>
                    <Button onClick={handleSearchPublicSongs} disabled={isSearching || !searchQuery}>Search</Button>
                </div>
                {searchResults.length > 0 && (
                    <div className="mt-6">
                        <h3 className="text-xl font-semibold mb-3">Search Results</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {searchResults.map((song) => (
                                <Card key={song.id}>
                                    <CardHeader><CardTitle>{song.title}</CardTitle><p className="text-muted-foreground">{song.artist}</p></CardHeader>
                                    <CardContent>
                                        <Button onClick={() => handleAddSongFromPublicRepo(song)} disabled={loading} className="w-full">Add to my Library</Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>

        <Card className="mb-8">
            <CardHeader><CardTitle>Add New Song Manually</CardTitle></CardHeader>
            <CardContent>
                <div className="space-y-4">
                  <Textarea value={lyricsAndChords} onChange={(e) => setLyricsAndChords(e.target.value)} rows="8" className="w-full font-mono" placeholder="Paste lyrics and chords here..."></Textarea>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Input type="text" placeholder="Song Title (Required)" value={songTitle} onChange={(e) => setSongTitle(e.target.value)} className="flex-grow"/>
                    <Input type="text" placeholder="Artist (Optional)" value={songArtist} onChange={(e) => setSongArtist(e.target.value)} className="flex-grow"/>
                  </div>
                  <div className="flex justify-end">
                      <Button onClick={handleSaveSong} disabled={loading || !songTitle || !lyricsAndChords}>Save to Library</Button>
                  </div>
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader><CardTitle>Your Library</CardTitle></CardHeader>
            <CardContent>
                {!isAuthReady ? <p>Connecting...</p> : songs.length === 0 ? <p>No songs yet. Add one above or search the public repository!</p> : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {songs.map((song) => (
                        <Card key={song.id} className="flex flex-col">
                            <CardHeader>
                                <CardTitle>{song.title}</CardTitle>
                                {song.artist && <p className="text-muted-foreground">{song.artist}</p>}
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <pre className="max-h-48 overflow-y-auto bg-muted p-3 rounded-md text-sm font-mono whitespace-pre-wrap">
                                    {song.lyricsAndChords}
                                </pre>
                                <div className="mt-4 flex justify-between items-center">
                                    <p className="text-xs text-muted-foreground">Added: {song.timestamp ? new Date(song.timestamp.seconds * 1000).toLocaleDateString() : 'N/A'}</p>
                                    <Button onClick={() => handleSimplifyChords(song)} disabled={isAiLoading} size="sm" variant="outline">✨ Simplify</Button>
                                </div>
                                <Button onClick={() => handleDeleteSong(song.id)} disabled={loading} variant="destructive" size="sm" className="absolute top-3 right-3">
                                    Delete
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                    </div>
                )}
            </CardContent>
        </Card>

      </div>
    </div>
  );
}

export default SongLibrary;
