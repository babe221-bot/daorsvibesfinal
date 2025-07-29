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
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { auth } from "@/lib/firebase-client";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import { Skeleton } from "@/components/ui/skeleton";

export default function Header() {
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      router.push("/login");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const getAvatarFallback = () => {
    if (!user) return "DV";
    if (user.isAnonymous) return "G";
    return user.displayName?.substring(0, 2).toUpperCase() || "DV";
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-white/10 bg-background/50 backdrop-blur-sm px-4 md:px-8">
      <div className="hidden md:block">
        <SidebarTrigger />
      </div>
       <div className="flex w-full flex-1 gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <form className="ml-auto flex-1 sm:flex-initial">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Pretražite pjesme, playliste..."
                className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px] bg-background/50"
              />
            </div>
          </form>
        </div>
      <div className="md:hidden">
        <SidebarTrigger />
      </div>
      {loading ? (
        <Skeleton className="h-10 w-10 rounded-full" />
      ) : (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
           <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-full">
             <Avatar>
              <AvatarImage src={user?.photoURL ?? `https://api.dicebear.com/7.x/adventurer/svg?seed=${user?.uid ?? 'default'}`} alt="@daors" />
              <AvatarFallback>{getAvatarFallback()}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{user?.isAnonymous ? "Guest" : "Moj nalog"}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/dashboard/settings">Postavke</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/dashboard/support">Podrška</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut}>Odjava</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      )}
    </header>
  );
}
