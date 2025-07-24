import AppLayout from "@/components/layout/app-layout";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { KeyChangeSuggester } from "@/components/key-change-suggester";
import { ListMusic, Star } from "lucide-react";

export default function Home() {
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
          
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-medium">Recent Setlists</CardTitle>
              <ListMusic className="h-6 w-6 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">Acoustic Gig - July</p>
                    <p className="text-sm text-muted-foreground">5 songs</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">Band Practice</p>
                    <p className="text-sm text-muted-foreground">8 songs</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">Open Mic Night</p>
                    <p className="text-sm text-muted-foreground">3 songs</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card lg:col-span-3">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-medium">Favorite Songs</CardTitle>
              <Star className="h-6 w-6 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {["Wonderwall", "Stairway to Heaven", "Bohemian Rhapsody", "Hallelujah"].map(song => (
                  <div key={song} className="p-4 rounded-lg bg-muted/50">
                    <p className="font-semibold text-primary-foreground">{song}</p>
                    <p className="text-sm text-muted-foreground">Oasis</p>
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
