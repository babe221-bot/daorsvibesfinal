import AppLayout from "@/components/layout/app-layout";
import Header from "@/components/layout/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Guitar } from "lucide-react";
import InstrumentTuner from "@/components/instrument-tuner";

export default function TunerPage() {
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
                    <Guitar className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-3xl font-bold text-white">AI Instrument Tuner</CardTitle>
                    <CardDescription className="text-gray-300 text-lg">
                      Tune your instrument with precision.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <InstrumentTuner />
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </AppLayout>
  );
}
