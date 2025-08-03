
"use client";

import * as React from "react";
import Link from "next/link";
import { ThemeToggle } from "../components/theme-toggle";
import { Button } from "../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";

import { ProfileDialog } from "../components/profile-dialog";
import { Plus, LogOut, User, Palette, Shield, Github } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

import { usePathname, useRouter } from "next/navigation";
import { Architects_Daughter } from "next/font/google";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers } from "@fortawesome/free-solid-svg-icons";

const architectsDaughter = Architects_Daughter({
  subsets: ["latin"],
  weight: ["400"],
});

export function Header() {
    const router = useRouter();
  const {
    user,
    isSignedIn,
    isLoading,
    logout
   } = useAuth();


  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  const [showProfileDialog, setShowProfileDialog] = React.useState(false);

  const handleAddLore = () => {
    if (!isSignedIn) {
        router.push("/auth/login")
      
    }
  };

  const handleSignOut = async () => {
    await logout();
  };

  const getUserInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (isAdmin) {
    return null;
  }

  return (
    <>
      <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full backdrop-blur">
        <div className="mx-auto flex h-16 max-w-2xl items-center justify-between px-4">
       <Link
  href="/"
  className="flex items-center space-x-3 transition-opacity hover:opacity-80"
>
  <div
    className={`${architectsDaughter.className} text-muted-foreground flex w-full items-center justify-center gap-2 py-2 mb-5 text-lg font-bold`}
  >
    <FontAwesomeIcon icon={faUsers} className="h-5 w-5 text-primary" />
    Crowd-Solve
  </div>
</Link>


          {/* Right side actions */}
          <div className="flex items-center space-x-2">
            {/* GitHub link */}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8"
              asChild
            >
              <Link
                href="https://github.com/icantcodefyi/elafda"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-4 w-4" />
                <span className="sr-only">GitHub Repository</span>
              </Link>
            </Button>

            {isSignedIn ? (
              <>
                <Button size="sm" className="hidden sm:flex items-center" asChild>
                  <Link href="/create">
                    <Plus className="h-4 w-4" />
                    Ask Question
                  </Link>
                </Button>

                <Button className="h-8 w-8 flex items-center sm:hidden" asChild>
                  <Link href="/create">
                    <Plus className="h-4 w-4" />
                    <span className="sr-only">Ask Question</span>
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Button
                  size="sm"
                  className="hidden cursor-pointer items-center sm:flex"
                  onClick={handleAddLore}
                  disabled={isLoading}
                >
                  <Plus className="h-4 w-4" />
                Ask Question
                </Button>

                <Button
                  className="h-8 w-8 sm:hidden"
                  onClick={handleAddLore}
                  disabled={isLoading}
                >
                  <Plus className="h-4 w-4" />
                  <span className="sr-only">Add Lore</span>
                </Button>
              </>
            )}

            {/* User avatar with dropdown */}
            {isSignedIn && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={user.image ?? undefined}
                        alt={user.name ?? "User"}
                      />
                      <AvatarFallback className="text-xs">
                        {getUserInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm leading-none font-medium">
                        {user.name ?? "User"}
                      </p>
                      <p className="text-muted-foreground text-xs leading-none">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setShowProfileDialog(true)}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                    <DropdownMenuSeparator />
                
                 
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : null}

         
          
          </div>
        </div>
      </header>

 
    

      {/* Profile dialog */}
      <ProfileDialog
        open={showProfileDialog}
        onOpenChange={setShowProfileDialog}
      />
    </>
  );
}
