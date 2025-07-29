"use client";

import React, { useEffect, useState } from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { auth } from '@/lib/firebase-client';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useToast } from '@/hooks/use-toast';
import { handleExtractSongData, handleFormatSongContent, handleSaveSong } from '@/app/actions';
import type { SongDataExtractorState } from '@/lib/types';
import { Label } from '@/components/ui/label';
import { Sparkles } from 'lucide-react';

const initialState: SongDataExtractorState = {};


function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? 'Dohvaćanje...' : 'Dohvati Sadržaj'}
    </Button>
  );
}

export default function PronadjiAkorde() {
  const { toast } = useToast();
  const [user] = useAuthState(auth);
  const [state, formAction] = useActionState(handleExtractSongData, initialState);
  const [songUrl, setSongUrl] = useState('');

  const [songDetails, setSongDetails] = useState<{ title: string; artist: string; lyricsAndChords: string; url: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isFormatting, setIsFormatting] = useState(false);

  useEffect(() => {
    if (state.error) {
      toast({ variant: 'destructive', title: 'Greška', description: state.error });
    }
    if (state.result) {
      toast({ title: 'Uspjeh', description: state.message });
      setSongDetails({ ...state.result, url: songUrl });
    }
  }, [state, toast, songUrl]);
  
  const handleFormatClick = async () => {
    if (!songDetails?.lyricsAndChords) {
      toast({ variant: 'destructive', title: 'Greška', description: 'Nema sadržaja za formatiranje.' });
      return;
    }
    setIsFormatting(true);
    try {
      const result = await handleFormatSongContent(songDetails.lyricsAndChords);
      if (result.error) {
        toast({ variant: 'destructive', title: 'Greška formatiranja', description: result.error });
      } else if (result.formattedContent) {
        setSongDetails(prev => prev ? { ...prev, lyricsAndChords: result.formattedContent! } : null);
        toast({ title: 'Uspjeh', description: 'Sadržaj je uspješno formatiran.' });
      }
    } catch (err) {
       toast({ variant: 'destructive', title: 'Greška', description: 'Dogodila se neočekivana greška.' });
    } finally {
        setIsFormatting(false);
    }
  };

  const handleSaveSongClick = async () => {
    if (!user || !songDetails) {
      toast({ variant: 'destructive', title: 'Greška', description: 'Nema podataka za spremanje ili niste prijavljeni.' });
      return;
    }
     if (!songDetails.title || !songDetails.lyricsAndChords) {
      toast({ variant: 'destructive', title: 'Greška', description: 'Naslov i sadržaj su obavezni.' });
      return;
    }

    setIsSaving(true);
    const result = await handleSaveSong({
      ...songDetails,
      userId: user.uid,
    });
    setIsSaving(false);

    if (result.error) {
      toast({ variant: 'destructive', title: 'Greška', description: result.error });
    } else {
      toast({ title: 'Uspjeh', description: result.message });
      setSongDetails(null);
      setSongUrl('');
    }
  };


  return (
    <div className="text-foreground p-1 flex flex-col items-center">
      <div className="w-full max-w-4xl">
        <form action={formAction} className="space-y-4">
            <div className="space-y-2">
                <Label>URL Pjesme</Label>
                <div className="flex flex-col sm:flex-row gap-2">
                <Input 
                    name="songUrl"
                    placeholder="URL .txt, .pro ili web stranice"
                    value={songUrl}
                    onChange={(e) => setSongUrl(e.target.value)}
                    className="flex-grow bg-white/20 border-white/30 text-white placeholder:text-gray-300"
                />
                <SubmitButton />
                </div>
                {state.error && <p className="text-sm text-destructive mt-1">{state.error}</p>}
            </div>
        </form>

        {state.result && songDetails && (
          <div className="mt-6 space-y-4">
            <h3 className="text-xl font-semibold">Uredi i Spremi</h3>
             <div className="flex flex-col sm:flex-row gap-4">
              <Input
                type="text"
                placeholder="Naslov Pjesme (Obavezno)"
                value={songDetails.title}
                onChange={(e) => setSongDetails(prev => prev ? { ...prev, title: e.target.value } : null)}
                className="flex-grow bg-white/20 border-white/30"
              />
              <Input
                type="text"
                placeholder="Izvođač (Opcionalno)"
                value={songDetails.artist}
                onChange={(e) => setSongDetails(prev => prev ? { ...prev, artist: e.target.value } : null)}
                className="flex-grow bg-white/20 border-white/30"
              />
            </div>
            <Textarea
              value={songDetails.lyricsAndChords}
              onChange={(e) => setSongDetails(prev => prev ? { ...prev, lyricsAndChords: e.target.value } : null)}
              rows={12}
              className="w-full font-mono bg-white/10 border-white/30"
            />
            <div className="mt-4 flex justify-between">
              <Button onClick={handleFormatClick} disabled={isFormatting} variant="outline">
                <Sparkles className="mr-2 h-4 w-4" />
                {isFormatting ? 'Formatiranje...' : 'Formatiraj pomoću AI'}
              </Button>
              <Button onClick={handleSaveSongClick} disabled={isSaving || !songDetails.title || !songDetails.lyricsAndChords}>
                {isSaving ? 'Spremanje...' : 'Dodaj u javni repozitorij'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
