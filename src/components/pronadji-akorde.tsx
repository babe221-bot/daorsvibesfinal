"use client";
import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

function PronadjiAkorde() {
  // --- State Management ---
  const [db, setDb] = useState(null);
  const [auth, setAuth] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [songUrl, setSongUrl] = useState('');
  const [songTitle, setSongTitle] = useState('');
  const [songArtist, setSongArtist] = useState('');
  const [extractedContent, setExtractedContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

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


  // --- Gemini API Call Helper ---
  const callGemini = async (prompt, jsonSchema = null) => {
      const apiKey = ""; // Handled by environment
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

  const handleSaveSongToPublicRepo = async () => {
    if (!db || !userId) { setError("Database not connected."); return; }
    if (!songTitle || !extractedContent) { setError("Title and content are required."); return; }
    setLoading(true);
    setError('');
    setMessage('');
    try {
      // Check if the song already exists in the public repository
      const songsCollectionRef = collection(db, 'songs');
      const q = query(songsCollectionRef, where("title", "==", songTitle), where("artist", "==", songArtist));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setError("This song already exists in the public repository.");
        setLoading(false);
        return;
      }

      await addDoc(songsCollectionRef, {
        title: songTitle,
        artist: songArtist,
        lyricsAndChords: extractedContent,
        url: songUrl,
        timestamp: serverTimestamp(),
        addedBy: userId
      });
      setMessage("Song added to the public repository successfully!");
      setSongUrl('');
      setSongTitle('');
      setSongArtist('');
      setExtractedContent('');
    } catch (err) {
      console.error("Error saving song:", err);
      setError("Failed to save song to public repository.");
    } finally {
      setLoading(false);
    }
  };

  // --- JSX Rendering ---
  return (
    <div className="text-foreground p-1 flex flex-col items-center">
      {(loading || isAiLoading) && (
          <div className="fixed top-4 right-4 bg-primary text-primary-foreground py-2 px-4 rounded-lg shadow-lg z-50 flex items-center">
              <Progress value={isAiLoading ? 25 : 75} className="w-full" />
              {isAiLoading ? 'AI is thinking...' : 'Loading...'}
          </div>
      )}

      <div className="w-full max-w-4xl">
        <h1 className="text-2xl font-bold text-center mb-4">Find &amp; Add Chords</h1>

        {error && <div className="bg-destructive text-destructive-foreground p-4 rounded-lg mb-4 text-center">{error}</div>}
        {message && <div className="bg-primary text-primary-foreground p-4 rounded-lg mb-4 text-center">{message}</div>}

        <Card className="mb-8 bg-transparent border-0 shadow-none">
            <CardContent className="p-0">
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
                      <Button onClick={handleSaveSongToPublicRepo} disabled={loading || !songTitle || !extractedContent}>Add to Public Repository</Button>
                  </div>
                </div>
              )}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default PronadjiAkorde;
