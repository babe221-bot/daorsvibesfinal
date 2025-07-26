import AppLayout from "@/components/layout/app-layout";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { KeyChangeSuggester } from "@/components/key-change-suggester";
import { ListMusic, Star, Music, Mic } from "lucide-react";
import Image from "next/image";

export default function Home() {
  const favoriteSongs = [
    { title: "Wonderwall", artist: "Oasis", imageUrl: "https://images.unsplash.com/photo-1711054824441-064a99073a0b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxhbGJ1bSUyMGFydHxlbnwwfHx8fDE3NTM1Njk0NzV8MA&ixlib=rb-4.1.0&q=80&w=1080" },
    { title: "Stairway to Heaven", artist: "Led Zeppelin", imageUrl: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw4fHxhbGJ1bSUyMGFydHxlbnwwfHx8fDE3NTM1Njk0NzV8MA&ixlib=rb-4.1.0&q=80&w=1080" },
    { title: "Bohemian Rhapsody", artist: "Queen", imageUrl: "https://images.unsplash.com/photo-1500099817043-86d46000d58f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxhbGJ1bSUyMGFydHxlbnwwfHx8fDE3NTM1Njk0NzV8MA&ixlib=rb-4.1.0&q=80&w=1080" },
    { title: "Hallelujah", artist: "Leonard Cohen", imageUrl: "https://images.unsplash.com/photo-1711054824441-064a99073a0b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxhbGJ1bSUyMGFydHxlbnwwfHx8fDE3NTM1Njk0NzV8MA&ixlib=rb-4.1.0&q=80&w=1080" },
  ];

  const recentPlaylists = [
    { name: "Akustična svirka - Juli", count: 5, icon: Music },
    { name: "Proba benda", count: 8, icon: ListMusic },
    { name: "Večer otvorenog mikrofona", count: 3, icon: Mic },
  ];
  
  return (
    <AppLayout>
      <Header title="Kontrolna tabla" />
      <main className="flex-1 p-4 md:p-8 space-y-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <Card className="lg:col-span-2 glass-card">
            <CardHeader>
              <CardTitle className="text-2xl">AI Sugeriranje promjene tonaliteta</CardTitle>
              <CardDescription>
                Zalijepite audio URL da dobijete optimalne prijedloge za promjenu tonaliteta.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <KeyChangeSuggester />
            </CardContent>
          </Card>
          
          <Card className="glass-card hidden lg:flex flex-col items-center justify-center p-6">
            <Image 
              src="https://placehold.co/300x200.png" 
              alt="Muzička ilustracija" 
              width={300} 
              height={200}
              className="rounded-lg object-cover"
              data-ai-hint="music illustration" 
            />
            <p className="text-center mt-4 text-muted-foreground">Otkrijte svoju sljedeću omiljenu pjesmu.</p>
          </Card>

          <Card className="glass-card lg:col-span-3">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-medium">Omiljene pjesme</CardTitle>
              <Star className="h-6 w-6 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {favoriteSongs.map(song => (
                  <div key={song.title} className="p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <div className="space-y-1">
                      <p className="font-semibold text-base text-foreground tracking-normal">{song.title}</p>
                      <p className="text-sm text-muted-foreground tracking-normal">{song.artist}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-medium">Nedavne playliste</CardTitle>
              <ListMusic className="h-6 w-6 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentPlaylists.map(playlist => (
                  <div key={playlist.name} className="flex items-center gap-4 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <playlist.icon className="h-6 w-6 text-accent" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{playlist.name}</p>
                      <p className="text-sm text-muted-foreground">{playlist.count} pjesama</p>
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
