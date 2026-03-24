"use client";

import React, { useState } from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { createClient } from '@/lib/supabase/client';
import {
  handleScrapeChordSite,
  handleFormatSongContent,
  handleSimplifyChords,
  handleTransposeChords,
} from '@/app/actions';
import type { ExtractSongDataState } from '@/lib/types';
import {
  Sparkles,
  Copy,
  RotateCcw,
  PlusCircle,
  Save,
  Music,
  ArrowDownUp,
  Search,
  ClipboardPaste,
  Loader2,
} from 'lucide-react';

// ── Types ───────────────────────────────────────────────────────────────────

interface SongDetails {
  title: string;
  artist: string;
  lyricsAndChords: string;
  url: string;
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const match = url.match(p);
    if (match) return match[1];
  }
  return null;
}

const initialState: ExtractSongDataState = {};

// ── Sub-components ──────────────────────────────────────────────────────────

function SubmitButton({ label = 'Dohvati Sadržaj' }: { label?: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto gap-2">
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Dohvaćanje...
        </>
      ) : (
        <>
          <Search className="h-4 w-4" />
          {label}
        </>
      )}
    </Button>
  );
}

function LineCharCounter({ text }: { text: string }) {
  const lines = text ? text.split('\n').length : 0;
  const chars = text ? text.length : 0;
  return (
    <div className="flex gap-4 text-xs text-muted-foreground px-1">
      <span>Linije: {lines}</span>
      <span>Znakovi: {chars}</span>
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────

export default function PronadjiAkorde() {
  const { toast } = useToast();
  const { user } = useAuth();
  const supabase = createClient();

  // Form state (URL fetch via server action)
  const [state, formAction] = useActionState(handleScrapeChordSite, initialState);
  const [songUrl, setSongUrl] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');

  // Active input tab
  const [activeTab, setActiveTab] = useState<'url' | 'paste'>('url');

  // Paste tab state
  const [pasteContent, setPasteContent] = useState('');

  // Song editor state
  const [songDetails, setSongDetails] = useState<SongDetails | null>(null);
  const [previousContent, setPreviousContent] = useState<string | null>(null);

  // Loading states
  const [isSaving, setIsSaving] = useState(false);
  const [isFormatting, setIsFormatting] = useState(false);
  const [isSimplifying, setIsSimplifying] = useState(false);
  const [isTransposing, setIsTransposing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  // Transposition
  const [transpositionSemitones, setTranspositionSemitones] = useState<string>('0');

  // ── Effects ───────────────────────────────────────────────────────────────

  React.useEffect(() => {
    if (state.error) {
      toast({ variant: 'destructive', title: 'Greška', description: state.error });
    }
    if (state.result) {
      toast({ title: 'Uspjeh', description: state.message });
      setSongDetails({ ...state.result, url: songUrl });
      setPreviousContent(null);
    }
  }, [state, toast, songUrl]);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleImportPaste = async () => {
    if (!pasteContent.trim()) {
      toast({ variant: 'destructive', title: 'Greška', description: 'Zalijepite sadržaj pjesme.' });
      return;
    }
    setIsImporting(true);
    try {
      const formatted = await handleFormatSongContent(pasteContent);
      if (formatted.error) {
        toast({ variant: 'destructive', title: 'Greška', description: formatted.error });
        return;
      }
      setSongDetails({
        title: '',
        artist: '',
        lyricsAndChords: formatted.formattedContent || pasteContent,
        url: '',
      });
      setPreviousContent(null);
      toast({ title: 'Uspjeh', description: 'Sadržaj uspješno uvezen i formatiran!' });
    } catch (error) {
      console.error("Greška pri uvozu:", error);
      toast({ variant: 'destructive', title: 'Greška', description: 'Neočekivana greška pri uvozu.' });
    } finally {
      setIsImporting(false);
    }
  };

  const handleFormatClick = async () => {
    if (!songDetails?.lyricsAndChords) {
      toast({ variant: 'destructive', title: 'Greška', description: 'Nema sadržaja za formatiranje.' });
      return;
    }
    setIsFormatting(true);
    try {
      const formatted = await handleFormatSongContent(songDetails.lyricsAndChords);
      if (formatted.error) {
        toast({ variant: 'destructive', title: 'Greška', description: formatted.error });
        return;
      }
      setPreviousContent(songDetails.lyricsAndChords);
      setSongDetails(prev => prev ? { ...prev, lyricsAndChords: formatted.formattedContent! } : null);
      toast({ title: 'Uspjeh', description: 'Sadržaj uspješno formatiran pomoću AI.' });
    } catch (error) {
      console.error("Greška pri formatiranju:", error);
      toast({ variant: 'destructive', title: 'Greška', description: 'Dogodila se neočekivana greška pri formatiranju.' });
    } finally {
      setIsFormatting(false);
    }
  };

  const handleSimplifyClick = async () => {
    if (!songDetails?.lyricsAndChords) {
      toast({ variant: 'destructive', title: 'Greška', description: 'Nema sadržaja za pojednostavljivanje.' });
      return;
    }
    setIsSimplifying(true);
    try {
      const simplified = await handleSimplifyChords({
        title: songDetails.title,
        artist: songDetails.artist || undefined,
        lyricsAndChords: songDetails.lyricsAndChords,
      });
      if (simplified.error) {
        toast({ variant: 'destructive', title: 'Greška', description: simplified.error });
        return;
      }
      setPreviousContent(songDetails.lyricsAndChords);
      setSongDetails(prev => prev ? { ...prev, lyricsAndChords: simplified.simplifiedContent! } : null);
      toast({ title: 'Uspjeh', description: 'Akorde uspješno pojednostavljeni.' });
    } catch (error) {
      console.error("Greška pri pojednostavljivanju:", error);
      toast({ variant: 'destructive', title: 'Greška', description: 'Neočekivana greška pri pojednostavljivanju.' });
    } finally {
      setIsSimplifying(false);
    }
  };

  const handleTransposeClick = async () => {
    const semitones = parseInt(transpositionSemitones, 10);
    if (semitones === 0) {
      toast({ title: 'Info', description: 'Odaberite broj polutonova za transpoziciju.' });
      return;
    }
    if (!songDetails?.lyricsAndChords) {
      toast({ variant: 'destructive', title: 'Greška', description: 'Nema sadržaja za transpoziciju.' });
      return;
    }
    setIsTransposing(true);
    try {
      const result = await handleTransposeChords({
        lyricsAndChords: songDetails.lyricsAndChords,
        semitones,
      });
      if (result.error) {
        toast({ variant: 'destructive', title: 'Greška', description: result.error });
        return;
      }
      setPreviousContent(songDetails.lyricsAndChords);
      setSongDetails(prev => prev ? { ...prev, lyricsAndChords: result.transposedContent! } : null);
      toast({ title: 'Uspjeh', description: `Akorde transponirani za ${semitones > 0 ? '+' : ''}${semitones} polutonova.` });
    } catch (error) {
      console.error("Greška pri transpoziciji:", error);
      toast({ variant: 'destructive', title: 'Greška', description: 'Neočekivana greška pri transpoziciji.' });
    } finally {
      setIsTransposing(false);
    }
  };

  const handleCopyClick = async () => {
    if (!songDetails?.lyricsAndChords) return;
    try {
      await navigator.clipboard.writeText(songDetails.lyricsAndChords);
      toast({ title: 'Kopirano', description: 'Sadržaj kopiran u međuspremnik.' });
    } catch {
      toast({ variant: 'destructive', title: 'Greška', description: 'Nije moguće kopirati sadržaj.' });
    }
  };

  const handleUndoClick = () => {
    if (previousContent) {
      setSongDetails(prev => prev ? { ...prev, lyricsAndChords: previousContent } : null);
      setPreviousContent(null);
      toast({ title: 'Poništeno', description: 'Vraćen prethodni sadržaj.' });
    }
  };

  const handleResetClick = () => {
    setSongDetails(null);
    setSongUrl('');
    setYoutubeUrl('');
    setPasteContent('');
    setPreviousContent(null);
    setTranspositionSemitones('0');
    toast({ title: 'Resetirano', description: 'Obrazac je očišćen. Spremni za novu pjesmu.' });
  };

  const handleSaveSongClick = async () => {
    if (!user || !songDetails) {
      toast({ variant: 'destructive', title: 'Greška', description: 'Nema podataka za spremanje ili niste prijavljeni.' });
      return;
    }
    if (!songDetails.title.trim() || !songDetails.lyricsAndChords.trim()) {
      toast({ variant: 'destructive', title: 'Greška', description: 'Naslov i sadržaj su obavezni.' });
      return;
    }

    setIsSaving(true);
    try {
      const trimmedTitle = songDetails.title.trim();
      const trimmedArtist = songDetails.artist.trim();

      // Check if exists (normalize for comparison)
      const { data: existing, error: queryError } = await supabase
        .from('public_songs')
        .select('id')
        .ilike('title', trimmedTitle)
        .ilike('artist', trimmedArtist || '')
        .limit(1);

      if (queryError) throw queryError;

      if (existing && existing.length > 0) {
        toast({ variant: 'destructive', title: 'Greška', description: 'Ova pjesma već postoji u javnom repozitoriju.' });
        setIsSaving(false);
        return;
      }

      const { error: insertError } = await supabase.from('public_songs').insert({
        title: trimmedTitle,
        artist: trimmedArtist || "",
        lyricsAndChords: songDetails.lyricsAndChords,
        url: songDetails.url || "",
        added_by: user.id,
      });

      if (insertError) throw insertError;

      toast({ title: 'Uspjeh', description: "Pjesma je uspješno dodana u javni repozitorij!" });
      handleResetClick();
    } catch (err) {
      console.error("Greška pri spremanju pjesme:", err);
      const errorMessage = err instanceof Error ? err.message : "Nepoznata greška.";
      toast({ variant: 'destructive', title: 'Greška', description: `Nije uspjelo spremanje: ${errorMessage}` });
    } finally {
      setIsSaving(false);
    }
  };

  // ── YouTube video ID ──────────────────────────────────────────────────────

  const youtubeVideoId = youtubeUrl ? extractYouTubeId(youtubeUrl) : null;

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="text-foreground p-4 sm:p-6 flex flex-col items-center">
      <div className="w-full max-w-5xl">

        {/* ── Input Section ────────────────────────────────────────────────── */}
        {!songDetails && (
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'url' | 'paste')}>
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="url" className="gap-2">
                <Search className="h-4 w-4" />
                Dohvati iz URL-a
              </TabsTrigger>
              <TabsTrigger value="paste" className="gap-2">
                <ClipboardPaste className="h-4 w-4" />
                Zalijepi tekst
              </TabsTrigger>
            </TabsList>

            {/* URL Tab */}
            <TabsContent value="url">
              <form action={formAction} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="songUrl">URL Pjesme</Label>
                  <Input
                    id="songUrl"
                    name="songUrl"
                    placeholder="npr. https://tabs.ultimate-guitar.com/tab/..."
                    value={songUrl}
                    onChange={(e) => setSongUrl(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                  <p className="text-xs text-muted-foreground">
                    Podržane stranice: Ultimate Guitar, E-Chords, AZChords, ChordU, Songsterr i druge.
                  </p>
                  {state.error && <p className="text-sm text-destructive">{state.error}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="youtubeUrl">YouTube URL (opcionalno)</Label>
                  <Input
                    id="youtubeUrl"
                    name="youtubeUrl"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>
                <SubmitButton />
              </form>
            </TabsContent>

            {/* Paste Tab */}
            <TabsContent value="paste">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="pasteContent">Zalijepite tekst pjesme s akordima</Label>
                  <Textarea
                    id="pasteContent"
                    placeholder={"[Intro]\nC   Am   F   G\n\n[Verse 1]\nC              Am\nThis is a line of lyrics\nF              G\nAnd this is another one..."}
                    value={pasteContent}
                    onChange={(e) => setPasteContent(e.target.value)}
                    rows={10}
                    className="font-mono bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                  <LineCharCounter text={pasteContent} />
                </div>
                <Button onClick={handleImportPaste} disabled={isImporting || !pasteContent.trim()} className="gap-2">
                  {isImporting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Uvoz...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Uvezi i formatiraj sadržaj
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        )}

        {/* ── Editor Section ───────────────────────────────────────────────── */}
        {songDetails && (
          <div className="space-y-6">

            {/* Title + Artist inputs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 space-y-1">
                <Label htmlFor="songTitle">Naslov Pjesme *</Label>
                <Input
                  id="songTitle"
                  type="text"
                  placeholder="Naslov pjesme"
                  value={songDetails.title}
                  onChange={(e) => setSongDetails(prev => prev ? { ...prev, title: e.target.value } : null)}
                  className="bg-white/10 border-white/20"
                />
              </div>
              <div className="flex-1 space-y-1">
                <Label htmlFor="songArtist">Izvođač</Label>
                <Input
                  id="songArtist"
                  type="text"
                  placeholder="Ime izvođača"
                  value={songDetails.artist}
                  onChange={(e) => setSongDetails(prev => prev ? { ...prev, artist: e.target.value } : null)}
                  className="bg-white/10 border-white/20"
                />
              </div>
            </div>

            {/* YouTube embed + AI actions side by side on desktop */}
            <div className="flex flex-col lg:flex-row gap-6">

              {/* YouTube embed (if provided) */}
              {youtubeVideoId && (
                <div className="lg:w-[45%] space-y-2">
                  <Label className="text-sm text-muted-foreground flex items-center gap-1">
                    <Music className="h-3 w-3" /> YouTube pratnja
                  </Label>
                  <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                    <iframe
                      src={`https://www.youtube.com/embed/${youtubeVideoId}`}
                      title="YouTube video"
                      className="absolute top-0 left-0 w-full h-full rounded-lg border border-white/10"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}

              {/* AI action buttons */}
              <div className={`${youtubeVideoId ? 'lg:flex-1' : ''} space-y-4`}>
                <div className="space-y-3">
                  <Label className="text-sm text-muted-foreground">AI alati</Label>

                  {/* Row 1: Format + Simplify */}
                  <div className="flex flex-wrap gap-2">
                    <Button
                      onClick={handleFormatClick}
                      disabled={isFormatting}
                      variant="outline"
                      size="sm"
                      className="gap-2"
                    >
                      {isFormatting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                      {isFormatting ? 'Formatiranje...' : 'Formatiraj pomoću AI'}
                    </Button>
                    <Button
                      onClick={handleSimplifyClick}
                      disabled={isSimplifying}
                      variant="outline"
                      size="sm"
                      className="gap-2"
                    >
                      {isSimplifying ? <Loader2 className="h-4 w-4 animate-spin" /> : <Music className="h-4 w-4" />}
                      {isSimplifying ? 'Pojednostavljivanje...' : 'Pojednostavi akorde'}
                    </Button>
                  </div>

                  {/* Row 2: Transpose */}
                  <div className="flex items-end gap-2">
                    <div className="space-y-1 flex-1 max-w-[200px]">
                      <Label className="text-xs text-muted-foreground">Transpozicija</Label>
                      <Select value={transpositionSemitones} onValueChange={setTranspositionSemitones}>
                        <SelectTrigger className="bg-white/10 border-white/20">
                          <SelectValue placeholder="Polutoni" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 13 }, (_, i) => i - 6).map((n) => (
                            <SelectItem key={n} value={String(n)}>
                              {n === 0 ? 'Bez promjene' : `${n > 0 ? '+' : ''}${n} poluton${Math.abs(n) === 1 ? '' : 'ova'}`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      onClick={handleTransposeClick}
                      disabled={isTransposing || transpositionSemitones === '0'}
                      variant="outline"
                      size="sm"
                      className="gap-2"
                    >
                      {isTransposing ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowDownUp className="h-4 w-4" />}
                      {isTransposing ? 'Transponiranje...' : 'Transponiraj'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Lyrics + Chords textarea */}
            <div className="space-y-1">
              <Label htmlFor="lyricsChords">Tekst i Akordi</Label>
              <Textarea
                id="lyricsChords"
                value={songDetails.lyricsAndChords}
                onChange={(e) => setSongDetails(prev => prev ? { ...prev, lyricsAndChords: e.target.value } : null)}
                rows={16}
                className="w-full font-mono text-sm bg-white/5 border-white/20 leading-relaxed"
                spellCheck={false}
              />
              <LineCharCounter text={songDetails.lyricsAndChords} />
            </div>

            {/* Utility buttons */}
            <div className="flex flex-wrap justify-between items-center gap-2 pt-2">
              <div className="flex flex-wrap gap-2">
                <Button onClick={handleCopyClick} variant="ghost" size="sm" className="gap-2">
                  <Copy className="h-4 w-4" />
                  Kopiraj
                </Button>
                {previousContent && (
                  <Button onClick={handleUndoClick} variant="ghost" size="sm" className="gap-2">
                    <RotateCcw className="h-4 w-4" />
                    Poništi
                  </Button>
                )}
                <Button onClick={handleResetClick} variant="ghost" size="sm" className="gap-2">
                  <PlusCircle className="h-4 w-4" />
                  Nova pjesma
                </Button>
              </div>
              <Button
                onClick={handleSaveSongClick}
                disabled={isSaving || !songDetails.title.trim() || !songDetails.lyricsAndChords.trim()}
                className="gap-2"
              >
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {isSaving ? 'Spremanje...' : 'Dodaj u javni repozitorij'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
