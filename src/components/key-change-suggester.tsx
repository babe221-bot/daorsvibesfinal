"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { handleSuggestKeyChange } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import type { KeyChangeSuggesterState } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

const initialState: KeyChangeSuggesterState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto gradient-btn">
      {pending ? "Analiziram..." : "Predloži tonalitet"}
    </Button>
  );
}

export function KeyChangeSuggester() {
  const [state, formAction] = useActionState(handleSuggestKeyChange, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.error) {
      toast({
        variant: "destructive",
        title: "Greška",
        description: state.error,
      });
    }
  }, [state.error, toast]);

  return (
    <div className="space-y-6">
      <form
        action={formAction}
        className="flex flex-col sm:flex-row gap-2"
        suppressHydrationWarning
      >
        <Input
          name="audioUrl"
          placeholder="https://primjer.com/moja-pjesma.mp3"
          required
          className="flex-grow"
        />
        <SubmitButton />
      </form>

      {state.result && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-primary-foreground flex items-center gap-2">
            <Sparkles className="text-accent"/>
            Prijedlozi
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {state.result.suggestedKeyChanges.map((suggestion, index) => (
              <Card key={index} className="bg-muted/50">
                <CardContent className="p-4">
                  <div className="flex justify-between items-baseline mb-2">
                    <p className="font-bold text-lg text-primary-foreground">{suggestion.key}</p>
                    <p className="text-sm text-muted-foreground">
                      {(suggestion.confidence * 100).toFixed(0)}% pouzdanost
                    </p>
                  </div>
                  <Progress value={suggestion.confidence * 100} className="h-2 [&>div]:bg-gradient-to-r [&>div]:from-accent [&>div]:to-primary" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
