
import AppLayout from "@/components/layout/app-layout";
import Header from "@/components/layout/header";
import { KeyChangeSuggester } from "@/components/key-change-suggester";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <AppLayout>
      <Header />
      <main className="flex-1 p-4 md:p-8">
        <div className="grid gap-8">
            <Card className="glass-card">
                <CardHeader>
                    <CardTitle>AI Prijedlog za promjenu tonaliteta</CardTitle>
                </CardHeader>
                <CardContent>
                    <KeyChangeSuggester />
                </CardContent>
            </Card>
        </div>
      </main>
    </AppLayout>
  );
}
