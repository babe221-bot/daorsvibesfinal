import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Milestone, Users, Guitar, ArrowRight, Calendar } from "lucide-react";
import Link from "next/link";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import PronadjiAkorde from "./pronadji-akorde";


const tools = [
  {
    title: "Metronome",
    description: "Keep your rhythm perfect with our integrated metronome.",
    icon: <Milestone className="h-6 w-6 text-gray-300" />,
    href: "/dashboard/metronome",
    buttonText: "Set Tempo",
  },
];

export function ToolsCard() {
    return (
        <div className="space-y-8">
            <Card className="glass-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xl font-bold text-white">ProChordFinder</CardTitle>
                    <Search className="h-6 w-6 text-gray-300" />
                </CardHeader>
                <CardContent>
                    <p className="text-gray-300 mb-4">Search for any song and get accurate chords instantly.</p>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="w-full bg-transparent text-white border-white hover:bg-white hover:text-black">
                                Find Chords <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px] glass-card">
                            <PronadjiAkorde />
                        </DialogContent>
                    </Dialog>
                </CardContent>
            </Card>

            {tools.map((tool) => (
                <Card key={tool.title} className="glass-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xl font-bold text-white">{tool.title}</CardTitle>
                        {tool.icon}
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-300 mb-4">{tool.description}</p>
                        {tool.href ? (
                             tool.href.startsWith("http") ? (
                                <a href={tool.href} target="_blank" rel="noopener noreferrer" className="w-full">
                                    <Button variant="outline" className="w-full bg-transparent text-white border-white hover:bg-white hover:text-black">
                                        {tool.buttonText} <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </a>
                            ) : (
                                <Link href={tool.href} className="w-full">
                                    <Button variant="outline" className="w-full bg-transparent text-white border-white hover:bg-white hover:text-black">
                                        {tool.buttonText} <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                            )
                        ) : (
                            <Button variant="outline" className="w-full bg-transparent text-white border-white hover:bg-white hover:text-black">
                                {tool.buttonText} <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        )}
                    </CardContent>
                </Card>
            ))}
             <Card className="glass-card">
                 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xl font-bold text-white">Moji Događaji</CardTitle>
                    <div className="p-2 bg-white/20 rounded-full">
                        <Calendar className="h-6 w-6 text-white" />
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-300 mb-4">Povežite svoj Google Kalendar da pratite vrijeme i lokacije svojih svirki.</p>
                     <Link href="/dashboard/gigs">
                        <Button variant="outline" className="w-full bg-transparent text-white border-white hover:bg-white hover:text-black">
                            Moji Događaji <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </CardContent>
            </Card>
            <Card className="glass-card">
                 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xl font-bold text-white">AI Instrument Tuner</CardTitle>
                    <div className="p-2 bg-white/20 rounded-full">
                        <Guitar className="h-6 w-6 text-white" />
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-300 mb-4">Tune your drums or guitar with our AI-powered tuner.</p>
                     <Link href="/dashboard/tuner">
                        <Button variant="outline" className="w-full bg-transparent text-white border-white hover:bg-white hover:text-black">
                            Open Tuner <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        </div>
    );
}
