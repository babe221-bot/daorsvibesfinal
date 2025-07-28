import AppLayout from "@/components/layout/app-layout";
import Header from "@/components/layout/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Key } from "lucide-react";
import KeyChangeSuggester from "@/components/key-change-suggester";
import { DesignResourcesCard } from "@/components/design-resources-card";
import { ToolsCard } from "@/components/tools-card";

export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="relative min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/background.png')" }}>
        <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>
        <div className="relative z-10">
          <Header />
          <main className="flex-1 p-4 md:p-8 text-white fade-in-down">
            
            <div className="grid gap-8 md:grid-cols-3 lg:grid-cols-4">
              
              {/* Left Column */}
              <div className="md:col-span-2 lg:col-span-3 space-y-8">
                 <Card className="glass-card">
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
                <DesignResourcesCard />
              </div>

              {/* Right Column */}
              <div className="md:col-span-1 lg:col-span-1 space-y-8">
                <ToolsCard />
              </div>

            </div>
          </main>
        </div>
      </div>
    </AppLayout>
  );
}
