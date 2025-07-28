
import AppLayout from "@/components/layout/app-layout";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Music, GitBranch, LayoutTemplate, Palette, Code, Search, Metronome, Users, Guitar } from "lucide-react";

export default function DashboardPage() {
  return (
    <AppLayout>
      <Header />
      <main className="flex-1 p-4 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4 mb-8">
        <Card className="ui-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Guitar Tuner</CardTitle>
              <Guitar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Coming Soon</div>
              <p className="text-xs text-muted-foreground">
                A tuner is on its way
              </p>
            </CardContent>
          </Card>
          <Card className="ui-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ProChordFinder</CardTitle>
              <Search className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <a href="https://prochordfinder.com" target="_blank" rel="noopener noreferrer" className="text-2xl font-bold hover:underline">
                Find Chords
              </a>
              <p className="text-xs text-muted-foreground">
                Search for any song
              </p>
            </CardContent>
          </Card>
          <Card className="ui-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Metronome</CardTitle>
              <Metronome className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Set Tempo</div>
              <p className="text-xs text-muted-foreground">
                Keep the rhythm
              </p>
            </CardContent>
          </Card>
          <Card className="ui-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Svirke</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Find Gigs</div>
              <p className="text-xs text-muted-foreground">
                Connect with musicians
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-8">
          <Card className="ui-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Music className="mr-2" />
                DaorsVibes UI/UX Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <GitBranch className="mr-2" />
                      FirebaseUI (Official and Highly Recommended)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>FirebaseUI is an open-source JavaScript library that provides simple, customizable UI bindings on top of Firebase SDKs. It's a huge win for consistent and secure auth UI.</p>
                    <a href="https://github.com/firebase/firebaseui-web" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline mt-2 inline-block">
                      View on GitHub
                    </a>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <LayoutTemplate className="mr-2" />
                      Boilerplates and Starter Kits with Firebase Integration
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li><a href="https://github.com/hallucinogen/firebase-react-dashboard-template" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">firebase-react-dashboard-template</a>: A starter kit for building dashboards with Firebase and React, using Ant Design and Tailwind CSS.</li>
                      <li><a href="https://github.com/FullStacksDev/angular-and-firebase-template" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">angular-and-firebase-template</a>: A robust base template for Angular and Firebase applications.</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Palette className="mr-2" />
                      General Purpose UI Kits and Design Systems
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible>
                      <AccordionItem value="item-1">
                        <AccordionTrigger>Material Design</AccordionTrigger>
                        <AccordionContent>
                          <ul className="list-disc pl-5">
                            <li>Material-UI (MUI) for React</li>
                            <li>Angular Material</li>
                            <li>Vue Material</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-2">
                        <AccordionTrigger>Tailwind CSS</AccordionTrigger>
                        <AccordionContent>
                          A utility-first CSS framework that allows for rapid UI development and highly customizable designs.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-3">
                        <AccordionTrigger>Bootstrap</AccordionTrigger>
                        <AccordionContent>
                          A classic and widely used CSS framework.
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Code className="mr-2" />
                      Design Resources for Developers
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li><a href="https://github.com/bradtraversy/design-resources-for-developers" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">design-resources-for-developers</a>: A curated list of design and UI resources.</li>
                      <li><a href="https://undraw.co/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">UnDraw.co</a>: Open-source illustrations.</li>
                      <li><a href="https://feathericons.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Feather Icons</a>, <a href="https://tabler-icons.io/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Tabler Icons</a>, <a href="https://iconoir.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Iconoir</a>: Free, open-source SVG icon sets.</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </AppLayout>
  );
}
