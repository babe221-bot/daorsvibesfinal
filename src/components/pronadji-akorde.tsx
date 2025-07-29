"use client";

import React, { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { db, auth } from '@/lib/firebase-client';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useToast } from '@/hooks/use-toast';
import { handleExtractSongData } from '@/app/actions';
import type { SongDataExtractorState } from '@/lib/types';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const initialState: SongDataExtractorState = {};

const SongUrlSchema = z.object({
  songUrl: z.string().url({ message: 'Molimo unesite važeći URL.' }),
});

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Dohvaćanje...' : 'Dohvati Sadržaj'}
    </Button>
  );
}

export default function PronadjiAkorde() {
  const { toast } = useToast();
  const [user] = useAuthState(auth);
  const [state, formAction] = useActionState(handleExtractSongData, initialState);

  const [songDetails, setSongDetails] = useState<{ title: string; artist: string; lyricsAndChords: string; url: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<z.infer<typeof SongUrlSchema>>({
    resolver: zodResolver(SongUrlSchema),
    defaultValues: { songUrl: '' },
  });

  useEffect(() => {
    if (state.error) {
      toast({ variant: 'destructive', title: 'Greška', description: state.error });
    }
    if (state.result) {
      toast({ title: 'Uspjeh', description: state.message });
      setSongDetails({ ...state.result, url: form.getValues('songUrl') });
    }
  }, [state, toast, form]);

  const handleSaveSongToPublicRepo = async () => {
    if (!db || !user || !songDetails) {
      toast({ variant: 'destructive', title: 'Greška', description: 'Nije moguće spremiti. Provjerite jeste li prijavljeni.' });
      return;
    }
    if (!songDetails.title || !songDetails.lyricsAndChords) {
      toast({ variant: 'destructive', title: 'Greška', description: 'Naslov i sadržaj su obavezni.' });
      return;
    }
    setIsSaving(true);
    try {
      const songsCollectionRef = collection(db, 'songs');
      const q = query(songsCollectionRef, where("title", "==", songDetails.title), where("artist", "==", songDetails.artist));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        toast({ variant: 'destructive', title: 'Greška', description: 'Ova pjesma već postoji u javnom repozitoriju.' });
        setIsSaving(false);
        return;
      }

      await addDoc(songsCollectionRef, {
        title: songDetails.title,
        artist: songDetails.artist,
        lyricsAndChords: songDetails.lyricsAndChords,
        url: songDetails.url,
        timestamp: serverTimestamp(),
        addedBy: user.uid
      });
      toast({ title: 'Uspjeh', description: 'Pjesma je uspješno dodana u javni repozitorij!' });
      setSongDetails(null);
      form.reset();
    } catch (err) {
      console.error("Greška pri spremanju pjesme:", err);
      toast({ variant: 'destructive', title: 'Greška', description: 'Nije uspjelo spremanje pjesme.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="text-foreground p-1 flex flex-col items-center">
      <div className="w-full max-w-4xl">
        <h1 className="text-2xl font-bold text-center mb-4">Pronađi i Dodaj Akorde</h1>
        
        <FormProvider {...form}>
            <form action={formAction} className="space-y-4">
                 <FormField
                    control={form.control}
                    name="songUrl"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>URL Pjesme</FormLabel>
                            <FormControl>
                                <div className="flex flex-col sm:flex-row gap-4">
                                <Input placeholder="URL .txt ili .pro datoteke" {...field} />
                                <SubmitButton />
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                    />
            </form>
        </FormProvider>

        {state.result && songDetails && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-3">Uredi i Spremi</h3>
            <Textarea
              value={songDetails.lyricsAndChords}
              onChange={(e) => setSongDetails(prev => prev ? { ...prev, lyricsAndChords: e.target.value } : null)}
              rows="10"
              className="w-full font-mono"
            />
            <div className="mt-4 flex flex-col sm:flex-row gap-4">
              <Input
                type="text"
                placeholder="Naslov Pjesme (Obavezno)"
                value={songDetails.title}
                onChange={(e) => setSongDetails(prev => prev ? { ...prev, title: e.target.value } : null)}
                className="flex-grow"
              />
              <Input
                type="text"
                placeholder="Izvođač (Opcionalno)"
                value={songDetails.artist}
                onChange={(e) => setSongDetails(prev => prev ? { ...prev, artist: e.target.value } : null)}
                className="flex-grow"
              />
            </div>
            <div className="mt-4 flex justify-end">
              <Button onClick={handleSaveSongToPublicRepo} disabled={isSaving || !songDetails.title || !songDetails.lyricsAndChords}>
                {isSaving ? 'Spremanje...' : 'Dodaj u javni repozitorij'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
