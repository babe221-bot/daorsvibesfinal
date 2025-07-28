"use client";

import NextLink from "next/link";
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
} from "@/components/ui/sidebar";
import { LayoutDashboard, ListMusic, Music, Sparkles, BarChart, Settings, LogOut, Key, LifeBuoy, Calendar } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "../ui/button";
import { auth } from "@/lib/firebase";
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
      <Sidebar collapsible="desktop" className="glass-sidebar">
        <SidebarContent>
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
               <NextLink href="/dashboard/key-suggester">
                  <SidebarMenuButton asChild isActive={pathname === '/dashboard/key-suggester'} tooltip="Key Suggester">
                    <span>
                      <Key />
                      <span>Key Suggester</span>
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
               <NextLink href="#">
                  <SidebarMenuButton asChild isActive={pathname === '/playlists'} tooltip="Playliste">
                    <span>
                      <ListMusic />
                      <span>Playliste</span>
                    </span>
                  </SidebarMenuButton>
              </NextLink>
            </SidebarMenuItem>
            <SidebarMenuItem>
               <NextLink href="#">
                  <SidebarMenuButton asChild isActive={pathname === '/songs'} tooltip="Pjesme">
                    <span>
                      <Music />
                      <span>Pjesme</span>
                    </span>
                  </SidebarMenuButton>
              </NextLink>
            </SidebarMenuItem>
            <SidebarMenuItem>
               <NextLink href="#">
                  <SidebarMenuButton asChild isActive={pathname === '/ai-tools'} tooltip="AI Alati">
                    <span>
                      <Sparkles />
                      <span>AI Alati</span>
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
