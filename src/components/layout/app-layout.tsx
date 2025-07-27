"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LayoutDashboard, ListMusic, Music, Sparkles, GitBranch } from "lucide-react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" className="glass-sidebar">
        <SidebarHeader>
          <div className="flex items-center gap-2 p-2">
            <video
              src="/logo-transformation-video.mp4"
              width="48"
              height="48"
              autoPlay
              loop
              muted
              className="mix-blend-screen opacity-90"
              style={{ filter: 'drop-shadow(0 0 12px hsl(var(--primary) / 0.8))' }}
            />
            <span className="text-xl font-headline text-primary-foreground group-data-[collapsible=icon]:hidden">DaorsVibes</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
               <NextLink href="/">
                  <SidebarMenuButton asChild isActive={pathname === '/'} tooltip="Kontrolna tabla">
                    <span>
                      <LayoutDashboard />
                      <span>Kontrolna tabla</span>
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
          <div className="flex items-center gap-3 p-3">
            <Avatar>
              <AvatarImage src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxtdXNpY3xlbnwwfHx8fDE3NTM1ODE3OTZ8MA&ixlib=rb-4.1.0&q=80&w=1080" alt="Korisnik" data-ai-hint="user avatar" />
              <AvatarFallback>DV</AvatarFallback>
            </Avatar>
            <div className="flex flex-col group-data-[collapsible=icon]:hidden">
              <span className="text-sm font-semibold text-sidebar-foreground">Daors Korisnik</span>
              <span className="text-xs text-muted-foreground">daors.korisnik@email.com</span>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
