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
import { LayoutDashboard, ListMusic, Music, Sparkles, GitBranch, Brush } from "lucide-react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 p-2">
            <GitBranch className="w-8 h-8 text-primary" />
            <h1 className="text-xl font-headline text-primary-foreground">DaorsVibes</h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
               <NextLink href="/" legacyBehavior passHref>
                  <SidebarMenuButton asChild isActive={pathname === '/'}>
                    <a><LayoutDashboard />Dashboard</a>
                  </SidebarMenuButton>
              </NextLink>
            </SidebarMenuItem>
            <SidebarMenuItem>
               <NextLink href="#" legacyBehavior passHref>
                  <SidebarMenuButton asChild isActive={pathname === '/setlists'}>
                    <a><ListMusic />Setlists</a>
                  </SidebarMenuButton>
              </NextLink>
            </SidebarMenuItem>
            <SidebarMenuItem>
               <NextLink href="#" legacyBehavior passHref>
                  <SidebarMenuButton asChild isActive={pathname === '/songs'}>
                    <a><Music />Songs</a>
                  </SidebarMenuButton>
              </NextLink>
            </SidebarMenuItem>
            <SidebarMenuItem>
               <NextLink href="#" legacyBehavior passHref>
                  <SidebarMenuButton asChild isActive={pathname === '/ai-tools'}>
                    <a><Sparkles />AI Tools</a>
                  </SidebarMenuButton>
              </NextLink>
            </SidebarMenuItem>
            <SidebarMenuItem>
               <NextLink href="/ui-kit" legacyBehavior passHref>
                  <SidebarMenuButton asChild isActive={pathname === '/ui-kit'}>
                    <a><Brush />UI Kit</a>
                  </SidebarMenuButton>
              </NextLink>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <div className="flex items-center gap-3 p-3">
            <Avatar>
              <AvatarImage src="https://placehold.co/40x40" alt="User" data-ai-hint="user avatar" />
              <AvatarFallback>DV</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-sidebar-foreground">Daors User</span>
              <span className="text-xs text-muted-foreground">user@daorsvibes.com</span>
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
