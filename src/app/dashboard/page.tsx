import AppLayout from "@/components/layout/app-layout";
import Header from "@/components/layout/header";
import { ToolsCard } from "@/components/tools-card";
import { WelcomeCard } from "@/components/welcome-card";
import { RecentSongsCard } from "@/components/recent-songs-card";

export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="relative min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/background.png')" }}>
        <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>
        <div className="relative z-10">
          <Header />
          <main className="flex-1 p-4 md:p-8 text-white fade-in-down">
            
            <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-3">
              
              {/* Left & Center Columns */}
              <div className="lg:col-span-2 space-y-8">
                 <WelcomeCard />
                 <div className="grid gap-8 md:grid-cols-1">
                    <RecentSongsCard />
                 </div>
              </div>

              {/* Right Column */}
              <div className="lg:col-span-1 space-y-8">
                <ToolsCard />
              </div>

            </div>
          </main>
        </div>
      </div>
    </AppLayout>
  );
}
