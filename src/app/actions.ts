"use server";

import { z } from "zod";
import { suggestKeyChange } from "@/ai/flows/suggest-key-change";
import type { KeyChangeSuggesterState } from "@/lib/types";

const AudioUrlSchema = z.string().url({ message: "Please enter a valid URL." });

export async function handleSuggestKeyChange(
  prevState: KeyChangeSuggesterState,
  formData: FormData
): Promise<KeyChangeSuggesterState> {
  
  const validatedFields = AudioUrlSchema.safeParse(formData.get("audioUrl"));

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors.url?.[0] ?? "Invalid URL provided.",
    };
  }

  try {
    const result = await suggestKeyChange({ audioUrl: validatedFields.data });
    if (!result || result.suggestedKeyChanges.length === 0) {
        return { error: "Could not generate suggestions for this audio. Please try another." };
    }
    return { result, message: "Suggestions generated successfully!" };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
    return { error: `An unexpected error occurred: ${errorMessage}` };
  }
}
