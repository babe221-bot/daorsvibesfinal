"use client";
import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, addDoc, query, onSnapshot, deleteDoc, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

// --- Helper: Simple Helmet component for adding fonts ---
const Helmet = ({ children }) => {
  useEffect(() => {
    const head = document.head;
    const links = [];
    React.Children.forEach(children, child => {
      if (child.type === 'link' && !document.querySelector(`link[href="${child.props.href}"]`)) {
        const link = document.createElement('link');
        Object.keys(child.props).forEach(key => {
          link.setAttribute(key, child.props[key]);
        });
        head.appendChild(link);
        links.push(link);
      }
    });
    return () => {
      links.forEach(link => head.removeChild(link));
    };
  }, []);
  return null;
};

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
  const [songUrl, setSongUrl] = useState('');
  const [songTitle, setSongTitle] = useState('');
  const [songArtist, setSongArtist] = useState('');
  const [extractedContent, setExtractedContent] = useState('');
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [modalTitle, setModalTitle] = useState('');


  // --- Global variables from Canvas environment ---
  const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
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
      const songsCollectionRef = collection(db, `artifacts/${appId}/users/${userId}/songs`);
      const q = query(songsCollectionRef);
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedSongs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        fetchedSongs.sort((a, b) => (b.timestamp?.toDate() || 0) - (a.timestamp?.toDate() || 0));
        setSongs(fetchedSongs);
      }, (err) => {
        console.error("Error fetching songs:", err);
        setError("Failed to load songs.");
      });
      return () => unsubscribe();
    }
  }, [db, userId, isAuthReady, appId]);


  // --- Gemini API Call Helper ---
  const callGemini = async (prompt, jsonSchema = null) => {
      const apiKey = ""; // Handled by environment
      // FIX: Reverted model to gemini-2.0-flash to resolve 403 Forbidden error.
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
      
      const payload = {
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          ...(jsonSchema && {
              generationConfig: {
                  responseMimeType: "application/json",
                  responseSchema: jsonSchema,
              }
          })
      };

      const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
      });

      if (!response.ok) {
          throw new Error(`API request failed with status: ${response.status}`);
      }
      const result = await response.json();
      const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) {
          throw new Error("Invalid API response format.");
      }
      return text;
  };

  // --- Core App Logic & Handlers ---

  const handleDownloadAndExtract = async () => {
    if (!songUrl) { setError("Please enter a song URL."); return; }
    setLoading(true);
    setError('');
    setMessage('');
    setExtractedContent('');
    try {
        const prompt = `Please fetch the raw text content from the following URL and return only the text content. Do not add any commentary or formatting. URL: ${songUrl}`;
        const text = await callGemini(prompt);
        setExtractedContent(text);
        setMessage("Content extracted. You can now save it or use AI to detect the title and artist.");
    } catch (err) {
      console.error("Error fetching content:", err);
      setError(`Failed to fetch content. The URL might be invalid or inaccessible. Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDetectTitleAndArtist = async () => {
      if (!extractedContent) { setError("No content to analyze."); return; }
      setIsAiLoading(true);
      setError('');
      setMessage('');
      try {
          const prompt = `Analyze the following song lyrics and chords to identify the song title and artist. 

${extractedContent}`;
          const schema = {
              type: "OBJECT",
              properties: {
                  title: { type: "STRING" },
                  artist: { type: "STRING" }
              },
              required: ["title", "artist"]
          };
          const resultText = await callGemini(prompt, schema);
          const resultJson = JSON.parse(resultText);
          setSongTitle(resultJson.title || '');
          setSongArtist(resultJson.artist || '');
          setMessage("✨ Title and artist detected!");
      } catch (err) {
          console.error("Error detecting info:", err);
          setError("Could not auto-detect song info. Please enter it manually.");
      } finally {
          setIsAiLoading(false);
      }
  };

  const handleSimplifyChords = async (song) => {
      setIsAiLoading(true);
      setError('');
      try {
          const prompt = `You are a helpful music assistant. Simplify the chords for the following song to make it easier for a beginner musician. Keep the original lyrics and structure. 

Title: ${song.title}
Artist: ${song.artist}

${song.lyricsAndChords}`;
          const simplifiedText = await callGemini(prompt);
          setModalTitle(`Simplified Chords for "${song.title}"`);
          setModalContent(simplifiedText);
          setIsModalOpen(true);
      } catch (err) {
          console.error("Error simplifying chords:", err);
          setError("Could not simplify chords at this time.");
      } finally {
          setIsAiLoading(false);
      }
  };

  const handleSaveSong = async () => {
    if (!db || !userId) { setError("Database not connected."); return; }
    if (!songTitle || !extractedContent) { setError("Title and content are required."); return; }
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const songsCollectionRef = collection(db, `artifacts/${appId}/users/${userId}/songs`);
      await addDoc(songsCollectionRef, {
        title: songTitle,
        artist: songArtist,
        lyricsAndChords: extractedContent,
        url: songUrl,
        timestamp: serverTimestamp(),
      });
      setMessage("Song saved successfully!");
      setSongUrl('');
      setSongTitle('');
      setSongArtist('');
      setExtractedContent('');
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
    setMessage('');
    try {
      await deleteDoc(doc(db, `artifacts/${appId}/users/${userId}/songs`, songId));
      setMessage("Song deleted.");
    } catch (err) {
      console.error("Error deleting song:", err);
      setError("Failed to delete song.");
    } finally {
      setLoading(false);
    }
  };

  // --- JSX Rendering ---
  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-8 flex flex-col items-center">
      <Helmet>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
      </Helmet>
      
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalTitle}>
          <pre className="bg-muted p-4 rounded-lg text-muted-foreground text-sm font-mono whitespace-pre-wrap">{modalContent}</pre>
      </Modal>

      {(loading || isAiLoading) && (
          <div className="fixed top-4 right-4 bg-primary text-primary-foreground py-2 px-4 rounded-lg shadow-lg z-50 flex items-center">
              <Progress value={isAiLoading ? 25 : 75} className="w-full" />
              {isAiLoading ? 'AI is thinking...' : 'Loading...'}
          </div>
      )}

      <div className="w-full max-w-4xl">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-center mb-8">Song Library</h1>

        {error && <div className="bg-destructive text-destructive-foreground p-4 rounded-lg mb-4 text-center">{error}</div>}
        {message && <div className="bg-primary text-primary-foreground p-4 rounded-lg mb-4 text-center">{message}</div>}

        {userId && <p className="text-center text-xs mb-6 text-muted-foreground">User ID: <span className="font-mono break-all">{userId}</span></p>}

        <Card className="mb-8">
            <CardHeader>
                <CardTitle>Add New Song</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                    <Input type="text" placeholder="Song URL (e.g., raw .txt or .pro file)" value={songUrl} onChange={(e) => setSongUrl(e.target.value)} className="flex-grow"/>
                    <Button onClick={handleDownloadAndExtract} disabled={loading || !songUrl}>Fetch Content</Button>
                </div>

                {extractedContent && (
                <div className="mt-6">
                  <h3 className="text-xl font-semibold mb-3">Edit & Save</h3>
                  <Textarea value={extractedContent} onChange={(e) => setExtractedContent(e.target.value)} rows="10" className="w-full font-mono"></Textarea>
                  <div className="mt-4 flex flex-col sm:flex-row gap-4">
                    <Input type="text" placeholder="Song Title (Required)" value={songTitle} onChange={(e) => setSongTitle(e.target.value)} className="flex-grow"/>
                    <Input type="text" placeholder="Artist (Optional)" value={songArtist} onChange={(e) => setSongArtist(e.target.value)} className="flex-grow"/>
                  </div>
                  <div className="mt-4 flex flex-col sm:flex-row gap-4 justify-end">
                      <Button onClick={handleDetectTitleAndArtist} disabled={isAiLoading || !extractedContent} variant="outline">✨ Auto-detect Info</Button>
                      <Button onClick={handleSaveSong} disabled={loading || !songTitle || !extractedContent}>Save to Library</Button>
                  </div>
                </div>
              )}
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Your Library</CardTitle>
            </CardHeader>
            <CardContent>
                {!isAuthReady ? <p>Connecting...</p> : songs.length === 0 ? <p>No songs yet. Add one above!</p> : (
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
                                    <Button onClick={() => handleSimplifyChords(song)} disabled={isAiLoading} size="sm" variant="outline">✨ Simplify Chords</Button>
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
