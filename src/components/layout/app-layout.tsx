"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
} from "@/components/ui/sidebar";
import { LayoutDashboard, ListMusic, Music, Sparkles, BarChart, Settings, LogOut, Key } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  return (
    <SidebarProvider>
      <Sidebar collapsible="desktop" className="glass-sidebar">
        <SidebarHeader>
          <div className="flex items-center gap-2 p-2">
            <Avatar>
              <AvatarFallback>DV</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
                <span className="text-lg font-headline text-primary-foreground group-data-[collapsible=icon]:hidden">DaorsVibes</span>
            </div>
          </div>
        </SidebarHeader>
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
      </Sidebar>
      <SidebarInset>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
