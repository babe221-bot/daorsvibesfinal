"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { User } from "lucide-react";

export default function Header() {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      router.push("/");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-white/10 bg-background/50 backdrop-blur-sm px-4 md:px-8">
      <div className="hidden md:block">
        <SidebarTrigger />
      </div>
      <div className="flex-1" />
      <div className="md:hidden">
        <SidebarTrigger />
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-full">
            <User />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Moj nalog</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Postavke</DropdownMenuItem>
          <DropdownMenuItem>Podrška</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut}>Odjava</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
