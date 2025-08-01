"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase-client";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Registracija..." : "Registruj se"}
    </Button>
  );
}

export function RegisterForm() {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.length < 2) {
      toast({ variant: "destructive", title: "Greška", description: "Ime mora imati najmanje 2 karaktera." });
      return;
    }
    if (password.length < 6) {
      toast({ variant: "destructive", title: "Greška", description: "Lozinka mora imati najmanje 6 karaktera." });
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      toast({
        title: "Uspješna registracija",
        description: `Korisnik ${userCredential.user.email} je uspješno kreiran. Sada se možete prijaviti.`,
      });
    } catch (error: any) {
      let errorMessage = "Došlo je do neočekivane greške prilikom registracije. Molimo pokušajte ponovo.";
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = "Korisnik sa ovom email adresom već postoji.";
          break;
        case 'auth/invalid-email':
          errorMessage = "Format email adrese nije ispravan.";
          break;
        case 'auth/weak-password':
          errorMessage = "Lozinka je preslaba. Molimo koristite jaču lozinku.";
          break;
      }
      toast({
        variant: "destructive",
        title: "Greška",
        description: errorMessage,
      });
    }
  };

  return (
    <Card className="border-0 shadow-none">
      <CardContent className="p-0">
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Ime</Label>
            <Input id="name" name="name" placeholder="Unesite vaše ime" required value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="ime@primjer.com" required value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Lozinka</Label>
            <Input id="password" name="password" type="password" required value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <SubmitButton />
        </form>
      </CardContent>
    </Card>
  );
}
