"use client";

import React, { useEffect, useState } from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { handleExtractSongData } from '@/app/actions';
import type { ExtractSongDataState } from '@/lib/types';
import { Label } from '@/components/ui/label';
import { Sparkles } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { formatSongContent } from '@/ai/flows/format-song-content-flow';

const initialState: ExtractSongDataState = {};

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
  const { user } = useAuth();
  const [state, formAction] = useActionState(handleExtractSongData, initialState);
  const [songUrl, setSongUrl] = useState('');
  const supabase = createClient();

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
        const formatted = await formatSongContent({ content: songDetails.lyricsAndChords });
        setSongDetails(prev => prev ? { ...prev, lyricsAndChords: formatted.formattedContent } : null);
        toast({ title: 'Uspjeh', description: 'Sadržaj uspješno formatiran pomoću AI.' });

    } catch (error) {
       console.error("Greška pri formatiranju pomoću AI:", error);
       toast({ variant: 'destructive', title: 'Greška', description: 'Dogodila se neočekivana greška pri formatiranju.' });
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
    try {
        // Check if exists in public_songs
        const { data: existing, error: queryError } = await supabase
          .from('public_songs')
          .select('id')
          .eq('title', songDetails.title)
          .eq('artist', songDetails.artist || '')
          .limit(1);
          
        if (queryError) throw queryError;

        if (existing && existing.length > 0) {
            toast({ variant: 'destructive', title: 'Greška', description: 'Ova pjesma već postoji u javnom repozitoriju.' });
            setIsSaving(false);
            return;
        }

        const { error: insertError } = await supabase.from('public_songs').insert({
            title: songDetails.title,
            artist: songDetails.artist || "",
            lyricsAndChords: songDetails.lyricsAndChords,
            url: songDetails.url || "",
            added_by: user.id,
        });

        if (insertError) throw insertError;

        toast({ title: 'Uspjeh', description: "Pjesma je uspješno dodana u javni repozitorij!" });
        setSongDetails(null);
        setSongUrl('');
    } catch (err) {
        console.error("Greška pri spremanju pjesme:", err);
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
        toast({ variant: 'destructive', title: 'Greška', description: `Nije uspjelo spremanje pjesme: ${errorMessage}` });
    } finally {
        setIsSaving(false);
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
