import ChordProgressionGenerator from "@/components/chord-progression-generator";
import { ErrorBoundary } from "@/components/error-boundary";
import AppLayout from "@/components/layout/app-layout";
import Header from "@/components/layout/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Music2 } from "lucide-react";

export default function ChordProgressionPage() {
  return (
    <AppLayout>
    <div className="relative min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/background.png')" }}>
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>
      <div className="relative z-10">
        <Header />
        <main className="flex-1 p-4 md:p-8 text-white fade-in-down">
           <Card className="glass-card">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white/20 rounded-full">
                  <Music2 className="h-8 w-8 text-white" />
                </div>
                <div>
                  <CardTitle className="text-3xl font-bold text-white">Chord Progression Generator</CardTitle>
                  <CardDescription className="text-gray-300 text-lg">
                    Discover new chord progressions for your next hit.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
               <ErrorBoundary>
                <ChordProgressionGenerator />
              </ErrorBoundary>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  </AppLayout>
  );
}
