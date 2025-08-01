"use server";

import { z } from "zod";
import { extractSongData } from "@/ai/flows/extract-song-data-flow";
import { formatSongContent } from "@/ai/flows/format-song-content-flow";
import { simplifyChords } from "@/ai/flows/simplify-chords-flow";

const SongUrlSchema = z.string().url({ message: "Molimo unesite važeći URL." });

export async function handleExtractSongData(
  prevState: any,
  formData: FormData
): Promise<any> {
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
