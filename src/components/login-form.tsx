"use client";

import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { auth as clientAuth } from "@/lib/firebase-client";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Prijavljivanje..." : "Prijavi se"}
    </Button>
  );
}

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(clientAuth, email, password);
      router.push("/dashboard");
    } catch (error: any) {
      if (error.code === 'auth/invalid-credential') {
        toast({
          variant: "destructive",
          title: "Greška prilikom prijave",
          description: "Email ili lozinka nisu ispravni.",
        });
      } else {
         toast({
          variant: "destructive",
          title: "Greška",
          description: "Došlo je do neočekivane greške.",
        });
      }
    }
  };

  return (
    <Card className="border-0 shadow-none">
      <CardContent className="p-0">
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="ime@primjer.com" required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Lozinka</Label>
            <Input id="password" name="password" type="password" required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <SubmitButton />
        </form>
      </CardContent>
    </Card>
  );
}
