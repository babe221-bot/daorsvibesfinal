import AppLayout from "@/components/layout/app-layout";
import Header from "@/components/layout/header";
import { DashboardStats } from "@/components/dashboard-stats";
import { RecentPlaylistsCard } from "@/components/recent-playlists-card";

export default function StatsPage() {
  return (
    <AppLayout>
      <div className="relative min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/background.png')" }}>
        <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>
        <div className="relative z-10">
          <Header />
          <main className="flex-1 p-4 md:p-8 text-white fade-in-down">
            <h1 className="text-3xl font-bold mb-8">Statistika</h1>
            <DashboardStats />
            <div className="mt-8">
              <RecentPlaylistsCard />
            </div>
          </main>
        </div>
      </div>
    </AppLayout>
  );
}
