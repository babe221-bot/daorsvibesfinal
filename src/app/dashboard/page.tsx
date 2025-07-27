
import AppLayout from "@/components/layout/app-layout";
import Header from "@/components/layout/header";

export default function DashboardPage() {
  return (
    <AppLayout>
      <Header />
      <main className="flex-1 p-4 md:p-8">
        <h1 className="text-2xl font-bold">Kontrolna ploča</h1>
        {/* Add your dashboard content here */}
      </main>
    </AppLayout>
  );
}
