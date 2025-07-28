
import AppLayout from "@/components/layout/app-layout";
import Header from "@/components/layout/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Music, Search, Metronome, Users, Guitar, Key, GitBranch, LayoutTemplate, Palette, Code, ArrowRight } from "lucide-react";
import KeyChangeSuggester from "@/components/key-change-suggester";

export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="relative min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/background.png')" }}>
        <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>
        <div className="relative z-10">
          <Header />
          <main className="flex-1 p-4 md:p-8 text-white">
            <div className="grid gap-8 md:grid-cols-3">
              
              {/* Left Column */}
              <div className="md:col-span-2">
                <Card className="bg-white/10 border-0 shadow-lg backdrop-blur-xl">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-white/20 rounded-full">
                        <Key className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-3xl font-bold text-white">Key Change Suggester</CardTitle>
                        <CardDescription className="text-gray-300 text-lg">
                          Find the perfect key for any song.
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-6 text-gray-200">
                      Our AI-powered tool analyzes song structures to suggest optimal key changes, making your music more dynamic and engaging. Whether you're a producer, a DJ, or a musician, get instant recommendations to elevate your sound.
                    </p>
                    <KeyChangeSuggester />
                    <Button size="lg" className="mt-6 bg-white text-black hover:bg-gray-200 w-full md:w-auto">
                      Get Started <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column */}
              <div className="space-y-8">
                <Card className="bg-white/10 border-0 shadow-lg backdrop-blur-xl">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xl font-bold text-white">ProChordFinder</CardTitle>
                    <Search className="h-6 w-6 text-gray-300" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 mb-4">Search for any song and get accurate chords instantly.</p>
                    <a href="https://prochordfinder.com" target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className="w-full bg-transparent text-white border-white hover:bg-white hover:text-black">
                        Find Chords <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </a>
                  </CardContent>
                </Card>
                <Card className="bg-white/10 border-0 shadow-lg backdrop-blur-xl">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xl font-bold text-white">Metronome</CardTitle>
                    <Metronome className="h-6 w-6 text-gray-300" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 mb-4">Keep your rhythm perfect with our integrated metronome.</p>
                    <Button variant="outline" className="w-full bg-transparent text-white border-white hover:bg-white hover:text-black">
                      Set Tempo <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
                 <Card className="bg-white/10 border-0 shadow-lg backdrop-blur-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-bold text-white">Svirke</CardTitle>
              <Users className="h-6 w-6 text-gray-300" />
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">Find gigs and connect with other musicians in your area.</p>
              <Button variant="outline" className="w-full bg-transparent text-white border-white hover:bg-white hover:text-black">
                Find Gigs <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 border-0 shadow-lg backdrop-blur-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-bold text-white">Guitar Tuner</CardTitle>
              <Guitar className="h-6 w-6 text-gray-300" />
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">A tuner is on its way. Stay tuned!</p>
            </CardContent>
          </Card>
              </div>

            </div>
          </main>
        </div>
      </div>
    </AppLayout>
  );
}
