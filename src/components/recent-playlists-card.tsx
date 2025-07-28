import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ListMusic, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const placeholderPlaylists = [
    { name: "Akustične večeri", songCount: 12, genre: "Pop" },
    { name: "Rock klasici", songCount: 25, genre: "Rock" },
    { name: "Ljetni Hitovi", songCount: 18, genre: "Dance" },
];

export function RecentPlaylistsCard() {
  return (
    <Card className="glass-card h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center gap-3">
            <ListMusic className="h-6 w-6" />
            <CardTitle className="text-xl font-bold">Nedavne Playliste</CardTitle>
        </div>
        <CardDescription>Brzi pristup vašim posljednjim setlistama.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-4">
            {placeholderPlaylists.map((playlist, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                    <div>
                        <p className="font-semibold">{playlist.name}</p>
                        <p className="text-sm text-gray-400">{playlist.songCount} pjesama</p>
                    </div>
                    <Badge variant="secondary">{playlist.genre}</Badge>
                </div>
            ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full bg-transparent text-white border-white hover:bg-white hover:text-black">
            Vidi sve playliste <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
