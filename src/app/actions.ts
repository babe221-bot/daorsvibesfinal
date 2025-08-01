"use server";

import { z } from "zod";
import { extractSongData } from "@/ai/flows/extract-song-data-flow";
import { formatSongContent } from "@/ai/flows/format-song-content-flow";
import type { SongDataExtractorState, SaveSongResult } from "@/lib/types";
import { getAdminDb } from "@/lib/firebase-admin";

const SongUrlSchema = z.string().url({ message: "Molimo unesite važeći URL." });

export async function handleExtractSongData(
  prevState: SongDataExtractorState,
  formData: FormData
): Promise<SongDataExtractorState> {
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

const SaveSongSchema = z.object({
  title: z.string().min(2, "Naslov je obavezan."),
  artist: z.string().optional(),
  lyricsAndChords: z.string().min(10, "Sadržaj je obavezan."),
  url: z.string().url().optional(),
  userId: z.string(),
});

export async function handleSaveSong(
  data: z.infer<typeof SaveSongSchema>
): Promise<SaveSongResult> {
  const validatedFields = SaveSongSchema.safeParse(data);
  if (!validatedFields.success) {
    return { error: "Nevažeći podaci za pjesmu." };
  }
  
  const adminDb = getAdminDb();
  if (!adminDb) {
      return { error: "Firebase Admin SDK nije ispravno inicijaliziran. Spremanje nije moguće." };
  }

  const { title, artist, lyricsAndChords, url, userId } = validatedFields.data;

  try {
    const songsCollectionRef = adminDb.collection("songs");
    const q = songsCollectionRef
        .where("title", "==", title)
        .where("artist", "==", artist || "");

    const querySnapshot = await q.get();

    if (!querySnapshot.empty) {
      return { error: "Ova pjesma već postoji u javnom repozitoriju." };
    }

    await songsCollectionRef.add({
      title,
      artist: artist || "",
      lyricsAndChords,
      url: url || "",
      timestamp: new Date(),
      addedBy: userId,
    });

    return { success: true, message: "Pjesma je uspješno dodana u javni repozitorij!" };
  } catch (err: any) {
    console.error("Greška pri spremanju pjesme:", err);
    return { error: `Nije uspjelo spremanje pjesme: ${err.message}` };
  }
}