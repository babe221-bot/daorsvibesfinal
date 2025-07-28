import AppLayout from "@/components/layout/app-layout";
import Header from "@/components/layout/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Music, Search, Milestone, Users, Guitar, Key, GitBranch, LayoutTemplate, Palette, Code, ArrowRight, ListMusic, Activity, Clock, Server, BookOpen, Lightbulb } from "lucide-react";
import KeyChangeSuggester from "@/components/key-change-suggester";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import GuitarTuner from "@/components/guitar-tuner";


export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="relative min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/background.png')" }}>
        <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>
        <div className="relative z-10">
          <Header />
          <main className="flex-1 p-4 md:p-8 text-white">
            <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4 mb-8">
              <Card className="bg-white/10 border-0 shadow-lg backdrop-blur-xl text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Songs
                  </CardTitle>
                  <Music className="h-4 w-4 text-gray-300" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,257</div>
                  <p className="text-xs text-gray-400">
                    +20.1% from last month
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-white/10 border-0 shadow-lg backdrop-blur-xl text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Playlists
                  </CardTitle>
                  <ListMusic className="h-4 w-4 text-gray-300" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">23</div>
                  <p className="text-xs text-gray-400">
                    +180.1% from last month
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-white/10 border-0 shadow-lg backdrop-blur-xl text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Activity</CardTitle>
                  <Activity className="h-4 w-4 text-gray-300" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+573</div>
                  <p className="text-xs text-gray-400">
                    +201 since last week
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-white/10 border-0 shadow-lg backdrop-blur-xl text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Recently Played
                  </CardTitle>
                  <Clock className="h-4 w-4 text-gray-300" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">573</div>
                  <p className="text-xs text-gray-400">
                    +201 since last hour
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid gap-8 md:grid-cols-3 lg:grid-cols-4">
              
              {/* Left Column */}
              <div className="md:col-span-2 lg:col-span-3 space-y-8">
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
                  </CardContent>
                </Card>

                 <Card className="bg-white/10 border-0 shadow-lg backdrop-blur-xl">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-white flex items-center gap-3"><BookOpen /> UI/UX Design Resources</CardTitle>
                        <CardDescription className="text-gray-300">A curated list of free resources to accelerate your app design and development.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h3 className="font-bold text-lg text-primary flex items-center gap-2"><Server /> FirebaseUI (Official)</h3>
                            <p className="text-gray-300">Open-source JavaScript library that provides simple, customizable UI bindings on top of Firebase SDKs. Especially powerful for authentication flows.</p>
                             <a href="https://github.com/firebase/firebaseui-web" target="_blank" rel="noopener noreferrer">
                                <Button variant="outline" className="w-full bg-transparent text-white border-white hover:bg-white hover:text-black">
                                    View on GitHub <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </a>
                        </div>
                         <div className="space-y-4">
                            <h3 className="font-bold text-lg text-primary flex items-center gap-2"><LayoutTemplate /> Boilerplates & Starter Kits</h3>
                            <p className="text-gray-300">Starter kits for building dashboards and apps with Firebase using various frameworks like React, Angular, and Vue, often including UI components.</p>
                             <a href="https://github.com/search?q=firebase+template" target="_blank" rel="noopener noreferrer">
                                <Button variant="outline" className="w-full bg-transparent text-white border-white hover:bg-white hover:text-black">
                                    Find Templates <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </a>
                        </div>
                         <div className="space-y-4">
                            <h3 className="font-bold text-lg text-primary flex items-center gap-2"><Palette /> General Purpose UI Kits</h3>
                            <p className="text-gray-300">Adaptable design systems like Material Design (MUI), Tailwind CSS, and Bootstrap to build your UI on top of a Firebase backend.</p>
                            <Accordion type="single" collapsible className="w-full">
                              <AccordionItem value="item-1" className="border-white/20">
                                <AccordionTrigger className="hover:no-underline">Learn More</AccordionTrigger>
                                <AccordionContent>
                                  <ul className="list-disc list-inside text-gray-300 space-y-2 pl-2">
                                      <li><b>Material-UI (MUI) for React:</b> Implements Google's Material Design.</li>
                                      <li><b>Angular Material:</b> Official Material Design library for Angular.</li>
                                      <li><b>Tailwind CSS:</b> A utility-first CSS framework for rapid UI development.</li>
                                      <li><b>Bootstrap:</b> A classic and widely-used CSS framework.</li>
                                  </ul>
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>
                        </div>
                        <div className="space-y-4">
                            <h3 className="font-bold text-lg text-primary flex items-center gap-2"><Lightbulb /> Design Resources for Developers</h3>
                            <p className="text-gray-300">Curated lists of design assets including illustrations (UnDraw.co), icons (Feather, Tabler), and more to enhance your app's look and feel.</p>
                             <a href="https://github.com/bradtraversy/design-resources-for-developers" target="_blank" rel="noopener noreferrer">
                                <Button variant="outline" className="w-full bg-transparent text-white border-white hover:bg-white hover:text-black">
                                    Explore Resources <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </a>
                        </div>
                    </CardContent>
                </Card>
              </div>

              {/* Right Column */}
              <div className="md:col-span-1 lg:col-span-1 space-y-8">
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
                    <Milestone className="h-6 w-6 text-gray-300" />
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
          
                 <Card className="bg-white/10 border-0 shadow-lg backdrop-blur-xl text-white">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                       <div className="p-2 bg-white/20 rounded-full">
                        <Guitar className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-2xl font-bold">Guitar Tuner</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                   <GuitarTuner />
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
