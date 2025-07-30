"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { registerUser } from "@/app/auth-actions";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

const initialState = { error: undefined, fieldErrors: undefined, success: false, message: "" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Registracija..." : "Registruj se"}
    </Button>
  );
}

export function RegisterForm() {
  const [state, formAction] = useActionState(registerUser, initialState);
  const { toast } = useToast();
  
  useEffect(() => {
    if (state.success) {
      toast({
        title: "Uspješna registracija",
        description: state.message,
      });
    } else if (state.error) {
       toast({
        variant: "destructive",
        title: "Greška",
        description: state.error,
      });
    }
  }, [state, toast]);


  return (
    <Card className="border-0 shadow-none">
      <CardContent className="p-0">
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Ime</Label>
            <Input id="name" name="name" placeholder="Unesite vaše ime" required />
            {state.fieldErrors?.name && <p className="text-destructive text-xs">{state.fieldErrors.name[0]}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="ime@primjer.com" required />
            {state.fieldErrors?.email && <p className="text-destructive text-xs">{state.fieldErrors.email[0]}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Lozinka</Label>
            <Input id="password" name="password" type="password" required />
            {state.fieldErrors?.password && <p className="text-destructive text-xs">{state.fieldErrors.password[0]}</p>}
          </div>
          <SubmitButton />
        </form>
      </CardContent>
    </Card>
  );
}
