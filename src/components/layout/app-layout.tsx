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
    <SidebarProvider defaultOpen={false}>
      <Sidebar collapsible="icon" className="bg-card/20 backdrop-blur-lg border-r border-white/10">
        <SidebarHeader>
          <div className="flex items-center gap-2 p-2">
            <GitBranch className="w-8 h-8 text-primary" />
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
              <AvatarImage src="https://placehold.co/40x40" alt="Korisnik" data-ai-hint="user avatar" />
              <AvatarFallback>DV</AvatarFallback>
            </Avatar>
            <div className="flex flex-col group-data-[collapsible=icon]:hidden">
              <span className="text-sm font-semibold text-sidebar-foreground">Daors Korisnik</span>
              <span className="text-xs text-muted-foreground">korisnik@daorsvibes.com</span>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="bg-transparent">
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
