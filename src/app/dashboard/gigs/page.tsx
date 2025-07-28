import AppLayout from "@/components/layout/app-layout";
import Header from "@/components/layout/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock, Plus, ListMusic } from "lucide-react";

const placeholderGigs = [
    { title: "Svirka u Pub-u", location: "Mostar, BiH", date: "2024-08-15", time: "21:00" },
    { title: "Akustična noć", location: "Sarajevo, BiH", date: "2024-08-22", time: "20:00" },
    { title: "Ljetni Festival", location: "Banja Luka, BiH", date: "2024-09-01", time: "18:00" },
];

export default function GigsPage() {
  return (
    <AppLayout>
      <div className="relative min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/background.png')" }}>
        <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>
        <div className="relative z-10">
          <Header />
          <main className="flex-1 p-4 md:p-8 text-white fade-in-down">
             <Card className="glass-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-white/20 rounded-full">
                            <Calendar className="h-8 w-8 text-white" />
                        </div>
                        <div>
                            <CardTitle className="text-3xl font-bold text-white">Moji Događaji</CardTitle>
                            <CardDescription className="text-gray-300 text-lg">
                                Pratite svoje nadolazeće svirke i događaje.
                            </CardDescription>
                        </div>
                    </div>
                    <div className="flex gap-2">
                         <Button variant="outline" className="bg-transparent text-white border-white hover:bg-white hover:text-black">
                            <Plus className="mr-2 h-4 w-4" />
                            Dodaj Događaj
                        </Button>
                        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                            Poveži Kalendare
                        </Button>
                    </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                    {placeholderGigs.map((gig, index) => (
                        <Card key={index} className="bg-white/10 border-0 shadow-lg backdrop-blur-xl">
                            <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div className="flex-grow">
                                    <h3 className="text-xl font-bold text-white">{gig.title}</h3>
                                    <div className="flex items-center text-gray-300 mt-2">
                                        <MapPin className="h-4 w-4 mr-2" />
                                        <span>{gig.location}</span>
                                    </div>
                                    <div className="flex items-center text-gray-300 mt-1">
                                        <Clock className="h-4 w-4 mr-2" />
                                        <span>{gig.date} u {gig.time}</span>
                                    </div>
                                </div>
                                <div className="w-full sm:w-auto">
                                    <Button variant="outline" className="w-full bg-transparent text-white border-white hover:bg-white hover:text-black">
                                       <ListMusic className="mr-2 h-4 w-4" />
                                       Kreiraj Playlistu
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </AppLayout>
  );
}
