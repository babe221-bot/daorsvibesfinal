"use client";
import React, { useState, useEffect } from 'react';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, collection, addDoc, query, onSnapshot, deleteDoc, doc, serverTimestamp, where, getDocs, Firestore, DocumentData, Timestamp } from 'firebase/firestore';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import PronadjiAkorde from './pronadji-akorde';
import { Library, Trash2, Wand2 } from 'lucide-react';
import app from '@/lib/firebase';
import { handleSimplifyChords } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';

interface Song extends DocumentData {
  id: string;
  title: string;
  artist?: string;
  lyricsAndChords: string;
  timestamp?: Timestamp;
}

const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="glass-card">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <pre className="bg-background/50 p-4 rounded-lg text-foreground/80 text-sm font-mono whitespace-pre-wrap max-h-[60vh] overflow-auto">{children}</pre>
            </DialogContent>
        </Dialog>
    );
};


function SongLibrary() {
  const { toast } = useToast();
  const [db, setDb] = useState<Firestore | null>(null);
  const [auth, setAuth] = useState<any>(null); // Use 'any' for auth to avoid type conflicts
  const [userId, setUserId] = useState<string | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [songTitle, setSongTitle] = useState('');
  const [songArtist, setSongArtist] = useState('');
  const [lyricsAndChords, setLyricsAndChords] = useState('');
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Song[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const initialAuthToken: string | null = null; // Assuming no initial token for this example

  useEffect(() => {
    try {
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
  }, []);

  useEffect(() => {
    if (db && userId && isAuthReady) {
      const userSongsCollectionRef = collection(db, `users/${userId}/songs`);
      const q = query(userSongsCollectionRef);
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedSongs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Song[];
        fetchedSongs.sort((a, b) => (b.timestamp?.toDate()?.getTime() || 0) - (a.timestamp?.toDate()?.getTime() || 0));
        setSongs(fetchedSongs);
      }, (err) => {
        console.error("Error fetching user songs:", err);
        setError("Nije uspjelo učitavanje vaših pjesama.");
      });
      return () => unsubscribe();
    }
  }, [db, userId, isAuthReady]);

  const onSimplifyChords = async (song: Song) => {
      setIsAiLoading(true);
      setError('');
      try {
          const result = await handleSimplifyChords({
              title: song.title,
              artist: song.artist,
              lyricsAndChords: song.lyricsAndChords
          });

          if (result.error) {
              throw new Error(result.error);
          }

          if (result.simplifiedContent) {
              setModalTitle(`Pojednostavljeni akordi za "${song.title}"`);
              setModalContent(result.simplifiedContent);
              setIsModalOpen(true);
          } else {
              throw new Error("Nije primljen pojednostavljeni sadržaj.");
          }
      } catch (err: any) {
          console.error("Greška pri pojednostavljivanju akorda:", err);
          setError(`Nije moguće pojednostaviti akorde: ${err.message}`);
          toast({ variant: 'destructive', title: 'Greška', description: `Nije moguće pojednostaviti akorde: ${err.message}` });
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
      
      setSearchResults(Object.values(results) as Song[]);
    } catch (err) {
      console.error("Greška pri pretraživanju javnih pjesama:", err);
      setError("Nije uspjelo pretraživanje pjesama.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddSongFromPublicRepo = async (song: Song) => {
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

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalTitle}>
          {modalContent}
      </Modal>

      {(loading || isAiLoading || isSearching) && (
          <div className="fixed top-20 right-4 bg-primary text-primary-foreground py-2 px-4 rounded-lg shadow-lg z-50 flex items-center gap-2">
              <Progress value={50} className="w-24" />
              <span>{(isSearching ? 'Pretraživanje...' : (isAiLoading ? 'AI razmišlja...' : 'Učitavanje...'))}</span>
          </div>
      )}

      {error && <div className="bg-destructive text-destructive-foreground p-4 rounded-lg mb-4 text-center">{error}</div>}
      {message && <div className="bg-primary/80 text-primary-foreground p-3 rounded-lg mb-4 text-center animate-pulse">{message}</div>}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <Card className="glass-card">
            <CardHeader>
                <CardTitle>Pronađi i Dodaj Akorde</CardTitle>
                <CardDescription>Uvezite pjesme s URL-a ili ih dodajte ručno.</CardDescription>
            </CardHeader>
            <CardContent>
              <PronadjiAkorde />
            </CardContent>
          </Card>

          <Card className="glass-card">
              <CardHeader><CardTitle>Dodaj Novu Pjesmu Ručno</CardTitle></CardHeader>
              <CardContent>
                  <div className="space-y-4">
                    <Textarea value={lyricsAndChords} onChange={(e) => setLyricsAndChords(e.target.value)} rows={8} className="w-full font-mono bg-white/10 border-white/30" placeholder="Zalijepite tekst i akorde ovdje..."></Textarea>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Input type="text" placeholder="Naslov Pjesme (Obavezno)" value={songTitle} onChange={(e) => setSongTitle(e.target.value)} className="flex-grow bg-white/10 border-white/30"/>
                      <Input type="text" placeholder="Izvođač (Opcionalno)" value={songArtist} onChange={(e) => setSongArtist(e.target.value)} className="flex-grow bg-white/10 border-white/30"/>
                    </div>
                    <div className="flex justify-end">
                        <Button onClick={() => handleSaveSong(songTitle, songArtist, lyricsAndChords)} disabled={loading || !songTitle || !lyricsAndChords}>Spremi u Biblioteku</Button>
                    </div>
                  </div>
              </CardContent>
          </Card>
        </div>
        
        <Card className="glass-card">
            <CardHeader><CardTitle>Pretraži Javni Repozitorij Pjesama</CardTitle></CardHeader>
            <CardContent>
                <div className="flex flex-col sm:flex-row gap-4">
                    <Input type="text" placeholder="Pretraži po naslovu pjesme ili izvođaču..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="flex-grow bg-white/10 border-white/30"/>
                    <Button onClick={handleSearchPublicSongs} disabled={isSearching || !searchQuery}>Pretraži</Button>
                </div>
                {searchResults.length > 0 && (
                    <div className="mt-6">
                        <h3 className="text-xl font-semibold mb-3">Rezultati Pretrage</h3>
                        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                            {searchResults.map((song) => (
                                <Card key={song.id} className="bg-white/10 border-white/20">
                                    <CardHeader className="p-4 flex flex-row justify-between items-start">
                                      <div>
                                        <CardTitle className="text-lg">{song.title}</CardTitle>
                                        <p className="text-muted-foreground text-sm">{song.artist}</p>
                                      </div>
                                       <Button onClick={() => handleAddSongFromPublicRepo(song)} disabled={loading} size="sm" className="shrink-0">Dodaj</Button>
                                    </CardHeader>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
      </div>

      <Card className="glass-card">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Library className="h-8 w-8 text-primary"/>
              <div>
                <CardTitle className="text-3xl">Vaša Biblioteka</CardTitle>
                <CardDescription>Sve vaše spremljene pjesme na jednom mjestu.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
              {!isAuthReady ? <p>Povezivanje...</p> : songs.length === 0 ? <p className="text-center text-muted-foreground py-8">Još uvijek nema pjesama. Dodajte jednu iznad ili pretražite javni repozitorij!</p> : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {songs.map((song) => (
                      <Card key={song.id} className="flex flex-col bg-white/5 border-white/20 hover:bg-white/10 transition-colors">
                          <CardHeader className="relative">
                              <CardTitle>{song.title}</CardTitle>
                              {song.artist && <p className="text-muted-foreground">{song.artist}</p>}
                               <Button onClick={() => handleDeleteSong(song.id)} disabled={loading} variant="ghost" size="icon" className="absolute top-3 right-3 text-muted-foreground hover:text-destructive hover:bg-destructive/20">
                                  <Trash2 className="h-4 w-4" />
                              </Button>
                          </CardHeader>
                          <CardContent className="flex-grow">
                              <pre className="max-h-48 overflow-y-auto bg-black/20 p-3 rounded-md text-sm font-mono whitespace-pre-wrap">
                                  {song.lyricsAndChords}
                              </pre>
                              <div className="mt-4 flex justify-between items-center">
                                  <p className="text-xs text-muted-foreground">Dodano: {song.timestamp ? new Date(song.timestamp.seconds * 1000).toLocaleDateString() : 'N/A'}</p>
                                  <Button onClick={() => onSimplifyChords(song)} disabled={isAiLoading} size="sm" variant="outline" className="bg-transparent border-primary/50 hover:bg-primary/20">
                                    <Wand2 className="mr-2 h-4 w-4 text-primary"/> 
                                    Pojednostavi
                                  </Button>
                              </div>
                          </CardContent>
                      </Card>
                  ))}
                  </div>
              )}
          </CardContent>
      </Card>
    </div>
  );
}

export default SongLibrary;
