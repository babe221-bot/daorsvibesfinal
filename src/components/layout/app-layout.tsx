"use client";

import NextLink from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarFooter,
  SidebarSeparator,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { LayoutDashboard, ListMusic, Music, Sparkles, BarChart, Settings, LogOut, LifeBuoy, Calendar, Milestone, Guitar, Search, Library } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "../ui/button";
import { auth } from "@/lib/firebase-client";
import { useRouter } from "next/navigation";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      router.push("/login");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };
  
  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" className="glass-sidebar">
        <SidebarContent>
          <SidebarHeader>
            <div className="flex items-center gap-2 p-2">
            <Image
                src="https://storage.googleapis.com/DaorsVibes.appspot.com/DaorsVibes/generated-image%20(8)_180x180.png"
                alt="DaorsVibes Logo"
                width={180}
                height={180}
              />
            </div>
          </SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
               <NextLink href="/dashboard">
                  <SidebarMenuButton asChild isActive={pathname === '/dashboard'} tooltip="Kontrolna tabla">
                    <span>
                      <LayoutDashboard />
                      <span>Kontrolna tabla</span>
                    </span>
                  </SidebarMenuButton>
              </NextLink>
            </SidebarMenuItem>
            <SidebarMenuItem>
               <NextLink href="/dashboard/tuner">
                  <SidebarMenuButton asChild isActive={pathname === '/dashboard/tuner'} tooltip="Tuner">
                    <span>
                      <Guitar />
                      <span>Tuner</span>
                    </span>
                  </SidebarMenuButton>
              </NextLink>
            </SidebarMenuItem>
             <SidebarMenuItem>
               <NextLink href="/dashboard/pronadji-akorde">
                  <SidebarMenuButton asChild isActive={pathname === '/dashboard/pronadji-akorde'} tooltip="Pronađi Akorde">
                    <span>
                      <Search />
                      <span>Pronađi Akorde</span>
                    </span>
                  </SidebarMenuButton>
              </NextLink>
            </SidebarMenuItem>
             <SidebarMenuItem>
               <NextLink href="/dashboard/song-library">
                  <SidebarMenuButton asChild isActive={pathname === '/dashboard/song-library'} tooltip="Biblioteka Pjesama">
                    <span>
                      <Library />
                      <span>Biblioteka Pjesama</span>
                    </span>
                  </SidebarMenuButton>
              </NextLink>
            </SidebarMenuItem>
            <SidebarMenuItem>
               <NextLink href="/dashboard/chord-progression">
                  <SidebarMenuButton asChild isActive={pathname === '/dashboard/chord-progression'} tooltip="Chord Progression">
                    <span>
                      <Music />
                      <span>Chord Progression</span>
                    </span>
                  </SidebarMenuButton>
              </NextLink>
            </SidebarMenuItem>
            <SidebarMenuItem>
               <NextLink href="/dashboard/gigs">
                  <SidebarMenuButton asChild isActive={pathname === '/dashboard/gigs'} tooltip="Moji Događaji">
                    <span>
                      <Calendar />
                      <span>Moji Događaji</span>
                    </span>
                  </SidebarMenuButton>
              </NextLink>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <NextLink href="/dashboard/metronome">
                    <SidebarMenuButton asChild isActive={pathname === '/dashboard/metronome'} tooltip="Metronom">
                        <span>
                            <Milestone />
                            <span>Metronom</span>
                        </span>
                    </SidebarMenuButton>
                </NextLink>
            </SidebarMenuItem>
            <SidebarMenuItem>
               <NextLink href="/dashboard/playlists">
                  <SidebarMenuButton asChild isActive={pathname === '/dashboard/playlists'} tooltip="Playliste">
                    <span>
                      <ListMusic />
                      <span>Playliste</span>
                    </span>
                  </SidebarMenuButton>
              </NextLink>
            </SidebarMenuItem>
            <SidebarMenuItem>
               <NextLink href="/dashboard/songs">
                  <SidebarMenuButton asChild isActive={pathname === '/dashboard/songs'} tooltip="Pjesme">
                    <span>
                      <Music />
                      <span>Pjesme</span>
                    </span>
                  </SidebarMenuButton>
              </NextLink>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
         <SidebarFooter>
          <SidebarSeparator />
          <SidebarMenu>
            <SidebarMenuItem>
               <NextLink href="/dashboard/stats">
                  <SidebarMenuButton asChild isActive={pathname === '/dashboard/stats'} tooltip="Statistika">
                    <span>
                      <BarChart />
                      <span>Statistika</span>
                    </span>
                  </SidebarMenuButton>
              </NextLink>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <NextLink href="/dashboard/settings">
                    <SidebarMenuButton asChild isActive={pathname === '/dashboard/settings'} tooltip="Postavke">
                        <span>
                            <Settings />
                            <span>Postavke</span>
                        </span>
                    </SidebarMenuButton>
                </NextLink>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <NextLink href="/dashboard/support">
                    <SidebarMenuButton asChild tooltip="Podrška">
                        <span>
                            <LifeBuoy />
                            <span>Podrška</span>
                        </span>
                    </SidebarMenuButton>
                </NextLink>
            </SidebarMenuItem>
             <SidebarMenuItem>
                <SidebarMenuButton onClick={handleSignOut} tooltip="Odjava">
                    <LogOut />
                    <span>Odjava</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
