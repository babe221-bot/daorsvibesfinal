
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AppLayout } from "@/components/layout/app-layout";
import { Metronome } from "@/components/metronome";
import { Milestone } from "lucide-react";

export default function MetronomePage() {
  return (
    <AppLayout>
      <div className="flex h-full w-full">
        <div className="flex-1 overflow-auto p-4 md:p-6">
          <main className="flex-1">
            <Card className="bg-gray-900 text-white border-gray-800">
              <CardHeader>
                <div className="flex items-center">
                  <Milestone className="h-8 w-8 mr-2 text-gray-300" />
                  <div>
                    <CardTitle>Metronome</CardTitle>
                    <CardDescription>
                    Keep your rhythm perfect with our integrated metronome.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-6 text-gray-200">
                Set the tempo and keep your rhythm in check with our easy-to-use metronome. Perfect for practice sessions, recording, or live performances.
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
