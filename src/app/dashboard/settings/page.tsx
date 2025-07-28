import AppLayout from "@/components/layout/app-layout";
import Header from "@/components/layout/header";
import { SettingsForm } from "@/components/settings-form";

export default function SettingsPage() {
  return (
    <AppLayout>
      <div className="relative min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/background.png')" }}>
        <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>
        <div className="relative z-10">
          <Header />
          <main className="flex-1 p-4 md:p-8 text-white fade-in-down">
            <div className="mx-auto max-w-4xl space-y-8">
                <h1 className="text-3xl font-bold">Postavke</h1>
                <SettingsForm />
            </div>
          </main>
        </div>
      </div>
    </AppLayout>
  );
}
