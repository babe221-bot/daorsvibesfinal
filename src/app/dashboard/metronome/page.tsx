import AppLayout from "@/components/layout/app-layout";
import Header from "@/components/layout/header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Metronome } from "@/components/metronome";
import { Milestone } from "lucide-react";

export default function MetronomePage() {
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
                        <Milestone className="h-8 w-8 text-white" />
                    </div>
                    <div>
                        <CardTitle className="text-3xl font-bold text-white">Metronom</CardTitle>
                        <CardDescription className="text-gray-300 text-lg">
                            Održavajte savršen ritam uz naš grafički metronom.
                        </CardDescription>
                    </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-6 text-gray-200">
                  Podesite tempo i održavajte ritam pod kontrolom pomoću našeg vizualnog metronoma. Savršeno za vježbanje, snimanje ili nastupe uživo.
                </p>
                <Metronome />
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </AppLayout>
  );
}
