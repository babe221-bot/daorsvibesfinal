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
import { LayoutDashboard, ListMusic, Music, Sparkles, Settings, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  return (
    <SidebarProvider>
      <Sidebar collapsible="desktop" className="glass-sidebar">
        <SidebarHeader>
          <div className="flex items-center gap-2 p-2">
            <Avatar>
              <AvatarImage src="https://github.com/daors.png" alt="@daors" />
              <AvatarFallback>DV</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
                <span className="text-lg font-headline text-primary-foreground group-data-[collapsible=icon]:hidden">DaorsVibes</span>
                <span className="text-sm text-primary-foreground/80 group-data-[collapsible=icon]:hidden">daors@vibes.com</span>
            </div>
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
            <SidebarMenu>
                <SidebarMenuItem>
                    <NextLink href="#">
                        <SidebarMenuButton asChild isActive={pathname === '/settings'} tooltip="Postavke">
                            <span>
                            <Settings />
                            <span>Postavke</span>
                            </span>
                        </SidebarMenuButton>
                    </NextLink>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <NextLink href="/login">
                        <SidebarMenuButton asChild tooltip="Odjava">
                            <span>
                            <LogOut />
                            <span>Odjava</span>
                            </span>
                        </SidebarMenuButton>
                    </NextLink>
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
