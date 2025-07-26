"use server";

import { z } from "zod";
import { suggestKeyChange } from "@/ai/flows/suggest-key-change";
import type { KeyChangeSuggesterState } from "@/lib/types";

const AudioUrlSchema = z.string().url({ message: "Molimo unesite važeći URL." });

export async function handleSuggestKeyChange(
  prevState: KeyChangeSuggesterState,
  formData: FormData
): Promise<KeyChangeSuggesterState> {
  
  const validatedFields = AudioUrlSchema.safeParse(formData.get("audioUrl"));

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors.url?.[0] ?? "Dostavljen je nevažeći URL.",
    };
  }

  try {
    const result = await suggestKeyChange({ audioUrl: validatedFields.data });
    if (!result || result.suggestedKeyChanges.length === 0) {
        return { error: "Nije moguće generirati prijedloge za ovaj audio. Molimo pokušajte drugi." };
    }
    return { result, message: "Prijedlozi su uspješno generirani!" };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : "Došlo je do nepoznate greške.";
    return { error: `Došlo je do neočekivane greške: ${errorMessage}` };
  }
}
