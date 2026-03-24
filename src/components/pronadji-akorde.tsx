"use client";

import React, { useState, useCallback } from 'react';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { createClient } from '@/lib/supabase/client';
import {
  handleScrapeChordSite,
  handleFormatSongContent,
  handleSimplifyChords,
  handleTransposeChords,
  handleSearchChords,
  fetchSongFromUrl,
} from '@/app/actions';
import type { ExtractSongDataState } from '@/lib/types';
import type { SearchResult } from '@/lib/chord-scraper';
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
  Link,
  Loader2,
  ExternalLink,
  Globe,
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

function SubmitButton({ label = 'Dohvati Sadržaj', icon }: { label?: string; icon?: React.ReactNode }) {
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
          {icon || <Search className="h-4 w-4" />}
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

function SearchResultItem({
  result,
  versionIndex,
  totalVersions,
  onLoad,
  onCopy,
  isLoading,
}: {
  result: SearchResult;
  versionIndex: number;
  totalVersions: number;
  onLoad: () => void;
  onCopy: () => void;
  isLoading: boolean;
}) {
   return (
     <div className="w-full p-3 rounded-lg bg-white/5 hover:bg-white/8 border border-white/10 hover:border-white/20 transition-all cursor-pointer group">
      <div className="flex items-start gap-3">
        {/* Version badge */}
        <div className="shrink-0 mt-0.5">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary/20 text-primary text-xs font-bold">
            v{versionIndex + 1}
          </span>
        </div>

         {/* Info */}
         <div className="min-w-0 flex-1" onClick={() => handleResultClick(result)}>
           <div className="flex items-center gap-2 flex-wrap">
             <p className="font-medium text-sm truncate">{result.title}</p>
             {totalVersions > 1 && (
               <span className="text-[10px] text-muted-foreground">
                 ({versionIndex + 1}/{totalVersions})
               </span>
             )}
           </div>
           {result.artist && (
             <p className="text-xs text-muted-foreground truncate">{result.artist}</p>
           )}
           <div className="flex items-center gap-1.5 mt-1">
             <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-muted-foreground border border-white/10">
               {result.siteName}
             </span>
             <span className="text-[10px] text-muted-foreground truncate max-w-[200px]">
               {result.url.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]}
             </span>
           </div>
         </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={onCopy}
            disabled={isLoading}
            className="h-7 px-2 text-xs gap-1 opacity-60 hover:opacity-100"
            title="Kopiraj sadržaj"
          >
            <Copy className="h-3 w-3" />
            <span className="hidden sm:inline">Kopiraj</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onLoad}
            disabled={isLoading}
            className="h-7 px-2 text-xs gap-1"
            title="Učitaj u editor"
          >
            {isLoading ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <>
                <ExternalLink className="h-3 w-3" />
                <span className="hidden sm:inline">Učitaj</span>
              </>
            )}
          </Button>
        </div>
      </div>
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
  const [activeTab, setActiveTab] = useState<'search' | 'url' | 'paste'>('search');

  // Search state
  const [searchSongName, setSearchSongName] = useState('');
  const [searchArtist, setSearchArtist] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [fetchingResultUrl, setFetchingResultUrl] = useState<string | null>(null);

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

  const handleSearch = async () => {
    if (!searchSongName.trim()) {
      toast({ variant: 'destructive', title: 'Greška', description: 'Unesite naziv pjesme.' });
      return;
    }
    setIsSearching(true);
    setSearchResults([]);
    try {
      const result = await handleSearchChords({
        songName: searchSongName.trim(),
        artist: searchArtist.trim() || undefined,
      });
      if (result.error) {
        toast({ variant: 'destructive', title: 'Greška', description: result.error });
        return;
      }
      setSearchResults(result.results || []);
      const count = result.results?.length || 0;
      const siteCount = new Set(result.results?.map((r: SearchResult) => r.siteName)).size;
      toast({
        title: 'Rezultati',
        description: `Pronađeno ${count} verzija na ${siteCount} stranica.`,
      });
    } catch (error) {
      console.error("Greška pri pretraživanju:", error);
      toast({ variant: 'destructive', title: 'Greška', description: 'Neočekivana greška pri pretraživanju.' });
    } finally {
      setIsSearching(false);
    }
  };

  const handleResultClick = useCallback(async (result: SearchResult) => {
    setFetchingResultUrl(result.url);
    try {
      const fetched = await fetchSongFromUrl(result.url);
      if (fetched.error) {
        toast({ variant: 'destructive', title: 'Greška', description: fetched.error });
        return;
      }
      if (fetched.result) {
        setSongDetails({
          title: fetched.result.title || result.title,
          artist: fetched.result.artist || result.artist,
          lyricsAndChords: fetched.result.lyricsAndChords,
          url: fetched.sourceUrl || result.url,
        });
        setPreviousContent(null);
        toast({ title: 'Uspjeh', description: `Akorde dohvaćeni sa ${result.siteName}!` });
      }
    } catch (error) {
      console.error("Greška pri dohvaćanju:", error);
      toast({ variant: 'destructive', title: 'Greška', description: 'Nije moguće dohvatiti akorde.' });
    } finally {
      setFetchingResultUrl(null);
    }
  }, [toast]);

  const handleCopyResult = useCallback(async (result: SearchResult) => {
    setFetchingResultUrl(result.url);
    try {
      const fetched = await fetchSongFromUrl(result.url);
      if (fetched.error) {
        toast({ variant: 'destructive', title: 'Greška', description: fetched.error });
        return;
      }
      if (fetched.result?.lyricsAndChords) {
        await navigator.clipboard.writeText(fetched.result.lyricsAndChords);
        toast({
          title: 'Kopirano!',
          description: `${result.title} — sadržaj kopiran u međuspremnik.`,
        });
      }
    } catch (error) {
      console.error("Greška pri kopiranju:", error);
      toast({ variant: 'destructive', title: 'Greška', description: 'Nije moguće kopirati sadržaj.' });
    } finally {
      setFetchingResultUrl(null);
    }
  }, [toast]);

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
        lyrics_and_chords: songDetails.lyricsAndChords,
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
        lyrics_and_chords: songDetails.lyricsAndChords,
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
    setSearchSongName('');
    setSearchArtist('');
    setSearchResults([]);
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
        lyrics_and_chords: songDetails.lyricsAndChords,
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
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'search' | 'url' | 'paste')}>
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="search" className="gap-1.5 text-xs sm:text-sm">
                <Search className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Pretraži</span>
                <span className="sm:hidden">Pretraži</span>
              </TabsTrigger>
              <TabsTrigger value="url" className="gap-1.5 text-xs sm:text-sm">
                <Link className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Dohvati iz URL-a</span>
                <span className="sm:hidden">URL</span>
              </TabsTrigger>
              <TabsTrigger value="paste" className="gap-1.5 text-xs sm:text-sm">
                <ClipboardPaste className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Zalijepi tekst</span>
                <span className="sm:hidden">Zalijepi</span>
              </TabsTrigger>
            </TabsList>

            {/* Search Tab */}
            <TabsContent value="search">
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 space-y-1">
                    <Label htmlFor="searchSongName">Naziv pjesme</Label>
                    <Input
                      id="searchSongName"
                      placeholder="npr. Kad sam bio mali"
                      value={searchSongName}
                      onChange={(e) => setSearchSongName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <Label htmlFor="searchArtist">Izvođač / Bend</Label>
                    <Input
                      id="searchArtist"
                      placeholder="npr. Crvena Jabuka"
                      value={searchArtist}
                      onChange={(e) => setSearchArtist(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    />
                  </div>
                </div>
                <Button
                  onClick={handleSearch}
                  disabled={isSearching || !searchSongName.trim()}
                  className="gap-2"
                >
                  {isSearching ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Pretraživanje 12 stranica...
                    </>
                  ) : (
                    <>
                      <Globe className="h-4 w-4" />
                      Pretraži sve stranice
                    </>
                  )}
                </Button>
                <p className="text-xs text-muted-foreground">
                  Pretražuje se 12 stranica: ex-YU (Akorde.me, Tabovi.com, AkordiTabovi, GitaraTabovi, Akordi.org) i internacionalne (Ultimate Guitar, E-Chords, AZChords, ChordU, Chordify, Songsterr, GuitareTab).
                </p>

                  {!isSearching && searchResults.length === 0 && searchSongName.trim() !== '' ? (
                    <p className="text-muted-foreground text-center py-8">
                      Nije pronađen ni jedan rezultat. Pokušajte s drugim ključnim riječima.
                    </p>
                  ) : (
                    <>
                      {isSearching && searchResults.length === 0 && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label className="text-sm text-muted-foreground">
                              Pronađeno verzija: {searchResults.length}
                            </Label>
                            <span className="text-[10px] text-muted-foreground">
                              v = verzija akorda
                            </span>
                          </div>
                          <ScrollArea className="h-[400px] rounded-lg border border-white/10 bg-white/[0.02]">
                            <div className="p-2 space-y-1.5">
                              {/* Placeholder skeletons while loading */}
                              {[...Array(5)].map((_, i) => (
                                <div key={i} className="w-full p-3 rounded-lg bg-white/5 hover:bg-white/8 border border-white/10 hover:border-white/20 transition-all group animate-pulse">
                                  <div className="flex items-start gap-3">
                                    <div className="shrink-0 mt-0.5">
                                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary/20 text-primary text-xs font-bold">
                                        v1
                                      </span>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <p className="font-medium text-sm truncate" style={{ lineHeight: '1.2' }}>
                                          Loading...
                                        </p>
                                        <span className="text-[10px] text-muted-foreground">
                                          (1/5)
                                        </span>
                                      </div>
                                      <p className="text-xs text-muted-foreground truncate">Loading Artist</p>
                                      <div className="flex items-center gap-1.5 mt-1">
                                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-muted-foreground border border-white/10">
                                          Loading Site
                                        </span>
                                        <span className="text-[10px] text-muted-foreground truncate max-w-[200px]">
                                          loading...
                                        </span>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-1.5 shrink-0">
                                      <Button variant="ghost" size="sm" disabled className="h-7 px-2 text-xs gap-1 opacity-60">
                                        <Copy className="h-3 w-3" />
                                        <span className="hidden sm:inline">Kopiraj</span>
                                      </Button>
                                      <Button variant="outline" size="sm" disabled className="h-7 px-2 text-xs gap-1">
                                        <Loader2 className="h-3 w-3 animate-spin" />
                                        <span className="hidden sm:inline">Učitaj</span>
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </ScrollArea>
                          <p className="text-[10px] text-muted-foreground text-center">
                            Svaka stavka je različita verzija akorda iz različitih izvora. Kliknite "Učitaj" da otvorite u editoru ili "Kopiraj" da kopirate sadržaj.
                          </p>
                        </div>
                      )}
                      {searchResults.length > 0 && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label className="text-sm text-muted-foreground">
                              Pronađeno verzija: {searchResults.length}
                            </Label>
                            <span className="text-[10px] text-muted-foreground">
                              v = verzija akorda
                            </span>
                          </div>
                          <ScrollArea className="h-[400px] rounded-lg border border-white/10 bg-white/[0.02]">
                            <div className="p-2 space-y-1.5">
                              {searchResults.map((result, index) => (
                                <SearchResultItem
                                  key={`${result.url}-${index}`}
                                  result={result}
                                  versionIndex={index}
                                  totalVersions={searchResults.length}
                                  onLoad={() => handleResultClick(result)}
                                  onCopy={() => handleCopyResult(result)}
                                  isLoading={fetchingResultUrl === result.url}
                                />
                              ))}
                            </div>
                          </ScrollArea>
                          <p className="text-[10px] text-muted-foreground text-center">
                            Svaka stavka je različita verzija akorda iz različitih izvora. Kliknite "Učitaj" da otvorite u editoru ili "Kopiraj" da kopirate sadržaj.
                          </p>
                        </div>
                      )}
                    </>
                  )}
              </div>
            </TabsContent>

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
                    Podržane stranice: Ultimate Guitar, E-Chords, AZChords, ChordU, Songsterr, Akorde.me, Tabovi.com i druge.
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
