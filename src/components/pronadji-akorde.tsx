"use client";
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { db } from '@/lib/firebase-client';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase-client';
import { useToast } from '@/hooks/use-toast';

function PronadjiAkorde() {
  const { toast } = useToast();
  const [user] = useAuthState(auth);
  const [songUrl, setSongUrl] = React.useState('');
  const [songTitle, setSongTitle] = React.useState('');
  const [songArtist, setSongArtist] = React.useState('');
  const [extractedContent, setExtractedContent] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [isAiLoading, setIsAiLoading] = React.useState(false);

  const handleDownloadAndExtract = async () => {
    if (!songUrl) { 
      toast({ variant: 'destructive', title: 'Greška', description: 'Molimo unesite URL pjesme.' });
      return; 
    }
    setLoading(true);
    setExtractedContent('');
    try {
        const response = await fetch(`https://cors-anywhere.herokuapp.com/${songUrl}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();
        setExtractedContent(text);
        toast({ title: 'Uspjeh', description: 'Sadržaj dohvaćen. Sada ga možete spremiti ili koristiti AI za otkrivanje naslova i izvođača.' });
    } catch (err) {
      console.error("Greška pri dohvaćanju sadržaja:", err);
      toast({ variant: 'destructive', title: 'Greška', description: `Nije uspjelo dohvaćanje sadržaja. URL možda nije važeći ili dostupan.` });
    } finally {
      setLoading(false);
    }
  };
  
  const handleDetectTitleAndArtist = async () => {
      if (!extractedContent) { 
        toast({ variant: 'destructive', title: 'Greška', description: 'Nema sadržaja za analizu.' });
        return; 
      }
      setIsAiLoading(true);
      try {
          // Placeholder for Gemini call
          // In a real scenario, you would have a server action calling Gemini
          const detectedTitle = "Wonderwall"; // Dummy data
          const detectedArtist = "Oasis"; // Dummy data
          setSongTitle(detectedTitle);
          setSongArtist(detectedArtist);
          toast({ title: 'Uspjeh', description: '✨ Naslov i izvođač otkriveni!' });
      } catch (err) {
          console.error("Greška pri otkrivanju informacija:", err);
          toast({ variant: 'destructive', title: 'Greška', description: 'Nije moguće automatski otkriti informacije o pjesmi. Molimo unesite ih ručno.' });
      } finally {
          setIsAiLoading(false);
      }
  };

  const handleSaveSongToPublicRepo = async () => {
    if (!db || !user) { 
      toast({ variant: 'destructive', title: 'Greška', description: 'Baza podataka nije povezana ili korisnik nije prijavljen.' });
      return; 
    }
    if (!songTitle || !extractedContent) { 
      toast({ variant: 'destructive', title: 'Greška', description: 'Naslov i sadržaj su obavezni.' });
      return; 
    }
    setLoading(true);
    try {
      const songsCollectionRef = collection(db, 'songs');
      const q = query(songsCollectionRef, where("title", "==", songTitle), where("artist", "==", songArtist));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        toast({ variant: 'destructive', title: 'Greška', description: 'Ova pjesma već postoji u javnom repozitoriju.' });
        setLoading(false);
        return;
      }

      await addDoc(songsCollectionRef, {
        title: songTitle,
        artist: songArtist,
        lyricsAndChords: extractedContent,
        url: songUrl,
        timestamp: serverTimestamp(),
        addedBy: user.uid
      });
      toast({ title: 'Uspjeh', description: 'Pjesma je uspješno dodana u javni repozitorij!' });
      setSongUrl('');
      setSongTitle('');
      setSongArtist('');
      setExtractedContent('');
    } catch (err) {
      console.error("Greška pri spremanju pjesme:", err);
      toast({ variant: 'destructive', title: 'Greška', description: 'Nije uspjelo spremanje pjesme u javni repozitorij.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-foreground p-1 flex flex-col items-center">
      {(loading || isAiLoading) && (
          <div className="fixed top-4 right-4 bg-primary text-primary-foreground py-2 px-4 rounded-lg shadow-lg z-50 flex items-center">
              <Progress value={isAiLoading ? 25 : 75} className="w-full" />
              {isAiLoading ? 'AI razmišlja...' : 'Učitavanje...'}
          </div>
      )}

      <div className="w-full max-w-4xl">
        <h1 className="text-2xl font-bold text-center mb-4">Pronađi i dodaj akorde</h1>

        <Card className="mb-8 bg-transparent border-0 shadow-none">
            <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                    <Input type="text" placeholder="URL pjesme (npr. sirovi .txt ili .pro fajl)" value={songUrl} onChange={(e) => setSongUrl(e.target.value)} className="flex-grow"/>
                    <Button onClick={handleDownloadAndExtract} disabled={loading || !songUrl}>Dohvati Sadržaj</Button>
                </div>

                {extractedContent && (
                <div className="mt-6">
                  <h3 className="text-xl font-semibold mb-3">Uredi i spremi</h3>
                  <Textarea value={extractedContent} onChange={(e) => setExtractedContent(e.target.value)} rows="10" className="w-full font-mono"></Textarea>
                  <div className="mt-4 flex flex-col sm:flex-row gap-4">
                    <Input type="text" placeholder="Naslov Pjesme (Obavezno)" value={songTitle} onChange={(e) => setSongTitle(e.target.value)} className="flex-grow"/>
                    <Input type="text" placeholder="Izvođač (Opcionalno)" value={songArtist} onChange={(e) => setSongArtist(e.target.value)} className="flex-grow"/>
                  </div>
                  <div className="mt-4 flex flex-col sm:flex-row gap-4 justify-end">
                      <Button onClick={handleDetectTitleAndArtist} disabled={isAiLoading || !extractedContent} variant="outline">✨ Auto-otkrivanje</Button>
                      <Button onClick={handleSaveSongToPublicRepo} disabled={loading || !songTitle || !extractedContent}>Dodaj u javni repozitorij</Button>
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
