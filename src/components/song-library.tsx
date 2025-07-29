"use client";
import React, { useState, useEffect } from 'react';
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, collection, addDoc, query, onSnapshot, deleteDoc, doc, serverTimestamp, where, getDocs, Firestore, DocumentData } from 'firebase/firestore';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import SongScraper from './song-scraper';

const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }> = ({ isOpen, onClose, title, children }) => {
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
  const [db, setDb] = useState<Firestore | null>(null);
  const [auth, setAuth] = useState<any>(null); // Use 'any' for auth to avoid type conflicts
  const [userId, setUserId] = useState<string | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [songTitle, setSongTitle] = useState('');
  const [songArtist, setSongArtist] = useState('');
  const [lyricsAndChords, setLyricsAndChords] = useState('');
  const [songs, setSongs] = useState<DocumentData[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<DocumentData[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isScraping, setIsScraping] = useState(false);
  
  const firebaseConfig = {
    apiKey: "AIzaSyDxwAQf6RX8UHlbjPpnjMVX-0jS85K3bvw",
    authDomain: "website-5a18c.firebaseapp.com",
    projectId: "website-5a18c",
    storageBucket: "website-5a18c.appspot.com",
    messagingSenderId: "636702053767",
    appId: "1:636702053767:web:efb577d6c53d4d06bd6f22",
  };
  const initialAuthToken: string | null = null; // Assuming no initial token for this example

  useEffect(() => {
    try {
      const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
      const firestoreDb = getFirestore(app);
      const firebaseAuth = getAuth(app);
      setDb(firestoreDb);
      setAuth(firebaseAuth);
      const unsubscribe = onAuthStateChanged(firebaseAuth, async (user: User | null) => {
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
            setError("Autentifikacija nije uspjela.");
            setUserId(crypto.randomUUID());
          }
        }
        setIsAuthReady(true);
      });
      return () => unsubscribe();
    } catch (e) {
      console.error("Firebase init failed:", e);
      setError("Inicijalizacija aplikacije nije uspjela.");
    }
  }, [firebaseConfig, initialAuthToken]);

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
        setError("Nije uspjelo učitavanje vaših pjesama.");
      });
      return () => unsubscribe();
    }
  }, [db, userId, isAuthReady]);


  const callGemini = async (prompt: string) => {
      const apiKey = ""; // Handled by environment
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
      const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }] };
      const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error(`API zahtjev nije uspio: ${response.status}`);
      const result = await response.json();
      const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error("Nevažeći API odgovor.");
      return text;
  };

  const handleSimplifyChords = async (song: DocumentData) => {
      setIsAiLoading(true);
      setError('');
      try {
          const prompt = `Pojednostavi akorde za sljedeću pjesmu:

Naslov: ${song.title}
Izvođač: ${song.artist}

${song.lyricsAndChords}`;
          const simplifiedText = await callGemini(prompt);
          setModalTitle(`Pojednostavljeni akordi za "${song.title}"`);
          setModalContent(simplifiedText);
          setIsModalOpen(true);
      } catch (err: any) {
          console.error("Greška pri pojednostavljivanju akorda:", err);
          setError(`Nije moguće pojednostaviti akorde: ${err.message}`);
      } finally {
          setIsAiLoading(false);
      }
  };

  const handleSaveSong = async (title: string, artist: string, lyrics: string) => {
    if (!db || !userId) {
      setError("Baza podataka nije povezana.");
      return false;
    }
    if (title.length < 2) {
      setError("Naslov mora imati najmanje 2 karaktera.");
      return false;
    }
    if (lyrics.length < 10) {
      setError("Tekst i akordi moraju imati najmanje 10 karaktera.");
      return false;
    }
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const userSongsCollectionRef = collection(db, `users/${userId}/songs`);
      await addDoc(userSongsCollectionRef, {
        title: title,
        artist: artist,
        lyricsAndChords: lyrics,
        timestamp: serverTimestamp(),
      });
      setMessage("Pjesma je uspješno spremljena!");
      if (title === songTitle && artist === songArtist && lyrics === lyricsAndChords) {
        setSongTitle('');
        setSongArtist('');
        setLyricsAndChords('');
      }
      return true;
    } catch (err) {
      console.error("Greška pri spremanju pjesme:", err);
      setError("Nije uspjelo spremanje pjesme.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSong = async (songId: string) => {
    if (!db || !userId) { setError("Baza podataka nije povezana."); return; }
    setLoading(true);
    setError('');
    try {
      await deleteDoc(doc(db, `users/${userId}/songs`, songId));
      setMessage("Pjesma je obrisana.");
    } catch (err) {
      console.error("Greška pri brisanju pjesme:", err);
      setError("Nije uspjelo brisanje pjesme.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchPublicSongs = async () => {
    if (!db) {
      setError("Baza podataka nije povezana.");
      return;
    }
    if (searchQuery.length < 2) {
      setError("Upit za pretragu mora imati najmanje 2 karaktera.");
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

      const results: { [key: string]: DocumentData } = {};
      titleSnapshot.forEach(doc => results[doc.id] = { id: doc.id, ...doc.data() });
      artistSnapshot.forEach(doc => results[doc.id] = { id: doc.id, ...doc.data() });
      
      setSearchResults(Object.values(results));
    } catch (err) {
      console.error("Greška pri pretraživanju javnih pjesama:", err);
      setError("Nije uspjelo pretraživanje pjesama.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddSongFromPublicRepo = async (song: DocumentData) => {
    if (!db || !userId) { setError("Baza podataka nije povezana."); return; }
    setLoading(true);
    setError('');
    try {
        const userSongsCollectionRef = collection(db, `users/${userId}/songs`);
        const q = query(userSongsCollectionRef, where("title", "==", song.title), where("artist", "==", song.artist));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            setMessage("Ova pjesma se već nalazi u vašoj biblioteci.");
            setLoading(false);
            return;
        }

        await addDoc(userSongsCollectionRef, {
            ...song,
            timestamp: serverTimestamp(),
        });
        setMessage(`"${song.title}" dodano u vašu biblioteku!`);
    } catch (err) {
        console.error("Greška pri dodavanju pjesme iz javnog repozitorija:", err);
        setError("Nije uspjelo dodavanje pjesme u vašu biblioteku.");
    } finally {
        setLoading(false);
    }
  }
  
  const handleSongScraped = async (scrapedData: { title: string; artist: string; lyricsAndChords: string }) => {
    setIsScraping(true);
    setError('');
    setMessage('');
    const saveSuccess = await handleSaveSong(scrapedData.title, scrapedData.artist, scrapedData.lyricsAndChords);
    if (saveSuccess) {
        setMessage("Pjesma je uspješno dohvaćena i dodana u vašu biblioteku!");
    } else {
        setMessage("Dohvaćeni podaci o pjesmi nisu mogli biti spremljeni u vašu biblioteku.");
    }
    setIsScraping(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-8 flex flex-col items-center">
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalTitle}>
          <pre className="bg-muted p-4 rounded-lg text-muted-foreground text-sm font-mono whitespace-pre-wrap">{modalContent}</pre>
      </Modal>

      {(loading || isAiLoading || isSearching || isScraping) && (
          <div className="fixed top-4 right-4 bg-primary text-primary-foreground py-2 px-4 rounded-lg shadow-lg z-50 flex items-center">
              <Progress value={50} className="w-full" />
              {isScraping ? 'Dohvaćanje...' : (isSearching ? 'Pretraživanje...' : (isAiLoading ? 'AI razmišlja...' : 'Učitavanje...'))}
          </div>
      )}

      <div className="w-full max-w-4xl">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-center mb-8">Biblioteka Pjesama</h1>

        {error && <div className="bg-destructive text-destructive-foreground p-4 rounded-lg mb-4 text-center">{error}</div>}
        {message && <div className="bg-primary text-primary-foreground p-4 rounded-lg mb-4 text-center">{message}</div>}
        
        <div className="mb-8">
            <SongScraper onSongScraped={handleSongScraped} isScraping={isScraping} />
        </div>

        <Card className="mb-8">
            <CardHeader><CardTitle>Dodaj Novu Pjesmu Ručno</CardTitle></CardHeader>
            <CardContent>
                <div className="space-y-4">
                  <Textarea value={lyricsAndChords} onChange={(e) => setLyricsAndChords(e.target.value)} rows={8} className="w-full font-mono" placeholder="Zalijepite tekst i akorde ovdje..."></Textarea>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Input type="text" placeholder="Naslov Pjesme (Obavezno)" value={songTitle} onChange={(e) => setSongTitle(e.target.value)} className="flex-grow"/>
                    <Input type="text" placeholder="Izvođač (Opcionalno)" value={songArtist} onChange={(e) => setSongArtist(e.target.value)} className="flex-grow"/>
                  </div>
                  <div className="flex justify-end">
                      <Button onClick={() => handleSaveSong(songTitle, songArtist, lyricsAndChords)} disabled={loading || !songTitle || !lyricsAndChords}>Spremi u Biblioteku</Button>
                  </div>
                </div>
            </CardContent>
        </Card>
        
        <Card className="mb-8">
            <CardHeader><CardTitle>Pretraži Javni Repozitorij Pjesama</CardTitle></CardHeader>
            <CardContent>
                <div className="flex flex-col sm:flex-row gap-4">
                    <Input type="text" placeholder="Pretraži po naslovu pjesme ili izvođaču..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="flex-grow"/>
                    <Button onClick={handleSearchPublicSongs} disabled={isSearching || !searchQuery}>Pretraži</Button>
                </div>
                {searchResults.length > 0 && (
                    <div className="mt-6">
                        <h3 className="text-xl font-semibold mb-3">Rezultati Pretrage</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {searchResults.map((song) => (
                                <Card key={song.id}>
                                    <CardHeader><CardTitle>{song.title}</CardTitle><p className="text-muted-foreground">{song.artist}</p></CardHeader>
                                    <CardContent>
                                        <Button onClick={() => handleAddSongFromPublicRepo(song)} disabled={loading} className="w-full">Dodaj u Moju Biblioteku</Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>

        <Card>
            <CardHeader><CardTitle>Vaša Biblioteka</CardTitle></CardHeader>
            <CardContent>
                {!isAuthReady ? <p>Povezivanje...</p> : songs.length === 0 ? <p>Još uvijek nema pjesama. Dodajte jednu iznad ili pretražite javni repozitorij!</p> : (
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
                                    <p className="text-xs text-muted-foreground">Dodano: {song.timestamp ? new Date(song.timestamp.seconds * 1000).toLocaleDateString() : 'N/A'}</p>
                                    <Button onClick={() => handleSimplifyChords(song)} disabled={isAiLoading} size="sm" variant="outline">✨ Pojednostavi</Button>
                                </div>
                                <Button onClick={() => handleDeleteSong(song.id)} disabled={loading} variant="destructive" size="sm" className="absolute top-3 right-3">
                                    Obriši
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

    