import DashboardPageLayout from "@/components/layout/dashboard-page-layout";
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
    <DashboardPageLayout>
      <Card className="bg-transparent border-0 shadow-none">
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
          <p className="mb-6 text-gray-200 text-center">
            Podesite tempo i održavajte ritam pod kontrolom pomoću našeg vizualnog metronoma. Savršeno za vježbanje, snimanje ili nastupe uživo.
          </p>
          <Metronome />
        </CardContent>
      </Card>
    </DashboardPageLayout>
  );
}
