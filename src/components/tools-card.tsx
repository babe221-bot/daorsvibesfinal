import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Milestone, Users, Guitar, ArrowRight } from "lucide-react";

const tools = [
  {
    title: "ProChordFinder",
    description: "Search for any song and get accurate chords instantly.",
    icon: <Search className="h-6 w-6 text-gray-300" />,
    href: "https://prochordfinder.com",
    buttonText: "Find Chords",
  },
  {
    title: "Metronome",
    description: "Keep your rhythm perfect with our integrated metronome.",
    icon: <Milestone className="h-6 w-6 text-gray-300" />,
    buttonText: "Set Tempo",
  },
  {
    title: "Svirke",
    description: "Find gigs and connect with other musicians in your area.",
    icon: <Users className="h-6 w-6 text-gray-300" />,
    buttonText: "Find Gigs",
  },
];

export function ToolsCard() {
    return (
        <div className="space-y-8">
            {tools.map((tool) => (
                <Card key={tool.title} className="glass-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xl font-bold text-white">{tool.title}</CardTitle>
                        {tool.icon}
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-300 mb-4">{tool.description}</p>
                        {tool.href ? (
                            <a href={tool.href} target="_blank" rel="noopener noreferrer">
                                <Button variant="outline" className="w-full bg-transparent text-white border-white hover:bg-white hover:text-black">
                                    {tool.buttonText} <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </a>
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
                    <CardTitle className="text-xl font-bold text-white">AI Instrument Tuner</CardTitle>
                    <div className="p-2 bg-white/20 rounded-full">
                        <Guitar className="h-6 w-6 text-white" />
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-300 mb-4">Tune your drums or guitar with our AI-powered tuner.</p>
                     <a href="/tuner.html" target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" className="w-full bg-transparent text-white border-white hover:bg-white hover:text-black">
                            Open Tuner <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </a>
                </CardContent>
            </Card>
        </div>
    );
}
