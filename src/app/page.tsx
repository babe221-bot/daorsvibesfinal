import AppLayout from "@/components/layout/app-layout";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { KeyChangeSuggester } from "@/components/key-change-suggester";
import { ListMusic, Star, Music, Mic } from "lucide-react";
import Image from "next/image";

export default function Home() {
  const favoriteSongs = [
    { title: "Wonderwall", artist: "Oasis" },
    { title: "Stairway to Heaven", artist: "Led Zeppelin" },
    { title: "Bohemian Rhapsody", artist: "Queen" },
    { title: "Hallelujah", artist: "Leonard Cohen" },
  ];

  const recentSetlists = [
    { name: "Acoustic Gig - July", count: 5, icon: Music },
    { name: "Band Practice", count: 8, icon: ListMusic },
    { name: "Open Mic Night", count: 3, icon: Mic },
  ];
  
  return (
    <AppLayout>
      <Header title="Dashboard" />
      <main className="flex-1 p-4 md:p-8 space-y-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <Card className="lg:col-span-2 glass-card">
            <CardHeader>
              <CardTitle className="text-2xl">AI Key Change Suggester</CardTitle>
              <CardDescription>
                Paste an audio URL to get optimal key change suggestions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <KeyChangeSuggester />
            </CardContent>
          </Card>
          
          <Card className="glass-card hidden lg:flex flex-col items-center justify-center p-6">
            <Image 
              src="https://placehold.co/300x200.png" 
              alt="Music illustration" 
              width={300} 
              height={200}
              className="rounded-lg object-cover"
              data-ai-hint="music illustration" 
            />
            <p className="text-center mt-4 text-muted-foreground">Discover your next favorite tune.</p>
          </Card>

          <Card className="glass-card lg:col-span-3">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-medium">Favorite Songs</CardTitle>
              <Star className="h-6 w-6 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {favoriteSongs.map(song => (
                  <div key={song.title} className="p-4 rounded-lg bg-muted/50 flex items-center gap-4 hover:bg-muted transition-colors">
                     <Image 
                        src="https://placehold.co/64x64.png"
                        alt="Album art"
                        width={64}
                        height={64}
                        className="rounded-md"
                        data-ai-hint="album art"
                      />
                    <div className="space-y-1">
                      <p className="font-semibold text-primary-foreground">{song.title}</p>
                      <p className="text-sm text-muted-foreground">{song.artist}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-medium">Recent Setlists</CardTitle>
              <ListMusic className="h-6 w-6 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentSetlists.map(setlist => (
                  <div key={setlist.name} className="flex items-center gap-4 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <setlist.icon className="h-6 w-6 text-accent" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{setlist.name}</p>
                      <p className="text-sm text-muted-foreground">{setlist.count} songs</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

        </div>
      </main>
    </AppLayout>
  );
}
