import AppLayout from "@/components/layout/app-layout";
import Header from "@/components/layout/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LifeBuoy } from "lucide-react";

export default function SupportPage() {
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
                    <LifeBuoy className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-3xl font-bold text-white">Podrška</CardTitle>
                    <CardDescription className="text-gray-300 text-lg">
                      Dobrodošli u naš centar za podršku.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-6 text-gray-200">
                  Ovdje možete pronaći odgovore na često postavljana pitanja i kontaktirati naš tim za podršku.
                </p>
                <Card className="bg-white/10 border-0 shadow-lg backdrop-blur-xl">
                    <CardHeader>
                        <CardTitle>Kontaktirajte nas</CardTitle>
                    </CardHeader>
                     <CardContent>
                        <p className="text-gray-300">Ako ne možete pronaći odgovor na svoje pitanje, slobodno nas kontaktirajte putem e-pošte.</p>
                        <p className="mt-4">
                            <span className="font-semibold text-white">E-pošta za podršku:</span>
                            <a href="mailto:support@daorsforgeaisystem.com" className="ml-2 text-primary hover:underline">
                                support@daorsforgeaisystem.com
                            </a>
                        </p>
                    </CardContent>
                </Card>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </AppLayout>
  );
}
