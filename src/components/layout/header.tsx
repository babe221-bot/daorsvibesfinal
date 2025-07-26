"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export default function Header({ title }: { title: string }) {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-8">
      <div className="hidden md:block">
        <SidebarTrigger />
      </div>
      <h1 className="flex-1 text-2xl font-semibold text-primary-foreground">
        {title}
      </h1>
      <div className="md:hidden">
        <SidebarTrigger />
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10">
              <AvatarImage src="https://placehold.co/40x40" alt="Korisnik" data-ai-hint="user avatar" />
              <AvatarFallback>DV</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Moj nalog</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Postavke</DropdownMenuItem>
          <DropdownMenuItem>Podrška</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Odjava</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
