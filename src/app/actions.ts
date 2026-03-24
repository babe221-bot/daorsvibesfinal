"use server";

import { z } from "zod";
import { extractSongData } from "@/ai/flows/extract-song-data-flow";
import { formatSongContent } from "@/ai/flows/format-song-content-flow";
import { simplifyChords } from "@/ai/flows/simplify-chords-flow";
import { transposeChords } from "@/ai/flows/transpose-chords-flow";
import { suggestKeyChange } from "@/ai/flows/suggest-key-change";
import { scrapeChordSite } from "@/lib/chord-scraper";
import type { KeyChangeSuggesterState, SongData } from "@/lib/types";

const SongUrlSchema = z.string().url({ message: "Molimo unesite važeći URL." });

export interface ExtractSongDataState {
    result?: SongData;
    message?: string;
    error?: string;
}

export async function handleExtractSongData(
  prevState: ExtractSongDataState,
  formData: FormData
): Promise<ExtractSongDataState> {
    const validatedFields = SongUrlSchema.safeParse(formData.get("songUrl"));
    
    if (!validatedFields.success) {
        return {
            error: validatedFields.error.flatten().formErrors[0] ?? "Dostavljen je nevažeći URL.",
        };
    }

    try {
        const result = await extractSongData({ songUrl: validatedFields.data });
        if (!result) {
            return { error: "Nije moguće dohvatiti podatke za ovaj URL. Molimo pokušajte drugi." };
        }
        return { result, message: "Podaci o pjesmi su uspješno dohvaćeni!" };
    } catch (e) {
        console.error(e);
        const errorMessage = e instanceof Error ? e.message : "Došlo je do nepoznate greške.";
        return { error: `Došlo je do neočekivane greške: ${errorMessage}` };
    }
}

const SongContentSchema = z.string().min(1, { message: "Sadržaj ne može biti prazan." });

export async function handleFormatSongContent(
  content: string
): Promise<{ formattedContent?: string; error?: string }> {
  const validatedFields = SongContentSchema.safeParse(content);

  if (!validatedFields.success) {
    return {
      error: "Sadržaj za formatiranje je nevažeći.",
    };
  }

  try {
    const result = await formatSongContent({ content: validatedFields.data });
    if (!result || !result.formattedContent) {
      return { error: "Nije uspjelo formatiranje sadržaja. Molimo pokušajte ponovo." };
    }
    return { formattedContent: result.formattedContent };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : "Došlo je do nepoznate greške.";
    return { error: `Došlo je do neočekivane greške prilikom formatiranja: ${errorMessage}` };
  }
}

const SimplifyChordsSchema = z.object({
  title: z.string(),
  artist: z.string().optional(),
  lyricsAndChords: z.string(),
});

export async function handleSimplifyChords(
  data: z.infer<typeof SimplifyChordsSchema>
): Promise<{ simplifiedContent?: string; error?: string }> {
    const validatedFields = SimplifyChordsSchema.safeParse(data);
    if (!validatedFields.success) {
        return { error: "Nevažeći podaci za pjesmu." };
    }

    try {
        const result = await simplifyChords(validatedFields.data);
        if (!result || !result.simplifiedContent) {
            return { error: "Nije uspjelo pojednostavljivanje akorda." };
        }
        return { simplifiedContent: result.simplifiedContent };
    } catch (e) {
        console.error(e);
        const errorMessage = e instanceof Error ? e.message : "Došlo je do nepoznate greške.";
        return { error: `Došlo je do greške prilikom pojednostavljivanja: ${errorMessage}` };
    }
}

const AudioUrlSchema = z.string().url({ message: "Please enter a valid URL." });

export async function handleSuggestKeyChange(
  prevState: KeyChangeSuggesterState,
  formData: FormData
): Promise<KeyChangeSuggesterState> {
  const validatedFields = AudioUrlSchema.safeParse(formData.get("audioUrl"));

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().formErrors[0] || "Invalid URL provided.",
    };
  }

  try {
    const result = await suggestKeyChange({ audioUrl: validatedFields.data });
    if (!result) {
      return { error: "Failed to get suggestions for this URL. Please try another." };
    }
    return { result };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
    return { error: `An unexpected error occurred: ${errorMessage}` };
  }
}

// ── Chord Scraper ───────────────────────────────────────────────────────────

export async function handleScrapeChordSite(
  prevState: ExtractSongDataState,
  formData: FormData
): Promise<ExtractSongDataState> {
  const validatedFields = SongUrlSchema.safeParse(formData.get("songUrl"));

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().formErrors[0] ?? "Dostavljen je nevažeći URL.",
    };
  }

  const url = validatedFields.data;

  try {
    // Try site-specific scraper first
    const scraped = await scrapeChordSite(url);
    if (scraped && scraped.lyricsAndChords.length > 10) {
      return {
        result: {
          title: scraped.title,
          artist: scraped.artist,
          lyricsAndChords: scraped.lyricsAndChords,
        },
        message: "Sadržaj uspješno dohvaćen sa stranice!",
      };
    }

    // Fallback to AI extraction
    const result = await extractSongData({ songUrl: url });
    if (!result) {
      return { error: "Nije moguće dohvatiti podatke za ovaj URL. Molimo pokušajte drugi." };
    }
    return { result, message: "Podaci o pjesmi su uspješno dohvaćeni pomoću AI!" };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : "Došlo je do nepoznate greške.";
    return { error: `Došlo je do neočekivane greške: ${errorMessage}` };
  }
}

// ── Chord Transposition ─────────────────────────────────────────────────────

const TransposeChordsSchema = z.object({
  lyricsAndChords: z.string().min(1, { message: "Sadržaj ne može biti prazan." }),
  semitones: z.number().int().min(-11).max(11),
});

export async function handleTransposeChords(
  data: z.infer<typeof TransposeChordsSchema>
): Promise<{ transposedContent?: string; error?: string }> {
  const validatedFields = TransposeChordsSchema.safeParse(data);

  if (!validatedFields.success) {
    return { error: "Nevažeći podaci za transpoziciju." };
  }

  try {
    const result = await transposeChords(validatedFields.data);
    if (!result || !result.transposedContent) {
      return { error: "Nije uspjela transpozicija akorda." };
    }
    return { transposedContent: result.transposedContent };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : "Došlo je do nepoznate greške.";
    return { error: `Došlo je do greške prilikom transpozicije: ${errorMessage}` };
  }
}
