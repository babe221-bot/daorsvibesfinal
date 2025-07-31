"use server";

import { z } from "zod";
import { getAdminAuth } from "@/lib/firebase-admin";

const RegisterSchema = z.object({
  name: z.string().min(2, { message: "Ime mora imati najmanje 2 karaktera." }),
  email: z.string().email({ message: "Molimo unesite važeću email adresu." }),
  password: z.string().min(6, { message: "Lozinka mora imati najmanje 6 karaktera." }),
});

const LoginSchema = z.object({
  email: z.string().email({ message: "Molimo unesite važeću email adresu." }),
  password: z.string().min(1, { message: "Molimo unesite lozinku." }),
});

export async function registerUser(prevState: any, formData: FormData) {
  const validatedFields = RegisterSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      error: "Nevažeći podaci.",
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, email, password } = validatedFields.data;

  try {
    const userRecord = await getAdminAuth().createUser({
      email,
      password,
      displayName: name,
    });
    return { success: true, message: `Korisnik ${userRecord.email} je uspješno kreiran.` };
  } catch (error: any) {
    if (error.code === 'auth/email-already-exists') {
      return { error: "Korisnik sa ovom email adresom već postoji." };
    }
    return { error: "Došlo je do greške prilikom registracije." };
  }
}

// Note: Server actions can't perform sign-in directly and redirect.
// We are validating credentials here, but the actual sign-in must happen on the client.
export async function loginUser(prevState: any, formData: FormData) {
  const validatedFields = LoginSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
     return {
      error: "Nevažeći podaci za prijavu.",
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  // This action only validates. The client will perform the actual sign-in.
  return { success: true, message: "Sada se možete prijaviti na klijentu." };
}
