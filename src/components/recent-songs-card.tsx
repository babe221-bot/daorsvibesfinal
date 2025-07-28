import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Music, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const placeholderSongs = [
    { title: "Bohemian Rhapsody", artist: "Queen", key: "Bb Major" },
    { title: "Wonderwall", artist: "Oasis", key: "F# Minor" },
    { title: "Smells Like Teen Spirit", artist: "Nirvana", key: "F Minor" },
];

export function RecentSongsCard() {
  return (
    <Card className="glass-card h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center gap-3">
            <Music className="h-6 w-6" />
            <CardTitle className="text-xl font-bold">Nedavne Pjesme</CardTitle>
        </div>
        <CardDescription>Nastavite gdje ste stali.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-4">
            {placeholderSongs.map((song, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                    <div>
                        <p className="font-semibold">{song.title}</p>
                        <p className="text-sm text-gray-400">{song.artist}</p>
                    </div>
                    <p className="text-sm font-medium text-gray-300">{song.key}</p>
                </div>
            ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full bg-transparent text-white border-white hover:bg-white hover:text-black">
            Vidi sve pjesme <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
