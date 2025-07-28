import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Hand } from "lucide-react";

export function WelcomeCard() {
  return (
    <Card className="glass-card">
      <CardHeader>
        <div className="flex items-center gap-4">
            <Hand className="h-10 w-10 text-yellow-300" />
            <div>
                <CardTitle className="text-3xl font-bold">Dobrodošli u DaorsVibes!</CardTitle>
                <CardDescription className="text-gray-300 text-lg">
                    Sve što vam je potrebno za vašu muziku, na jednom mjestu.
                </CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-200">
            Istražite svoje nedavne pjesme i playliste, otkrijte nove alate koji će vam pomoći da usavršite svoj zvuk i upravljajte svim svojim muzičkim projektima s lakoćom. Započnimo!
        </p>
      </CardContent>
    </Card>
  );
}
