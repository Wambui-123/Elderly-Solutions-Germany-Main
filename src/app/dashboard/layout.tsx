"use client";

import { Icons } from "@/components/icons";
import { Header } from "@/components/dashboard/header";
import { MainNav } from "@/components/dashboard/main-nav";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { LogOut, Loader2 } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useUser, useAuth } from "@/firebase";
import { signOut } from "firebase/auth";
import { MobileNav } from "@/components/dashboard/mobile-nav";
import { useEffect } from "react";


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, firebaseUser } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    if(auth) {
      await signOut(auth);
    }
    router.push('/login');
  };

  useEffect(() => {
    if (!loading) {
      if (!firebaseUser) {
        // User is not logged in, redirect to login page.
        router.replace('/login');
      } else if (user && user.hasCompletedOnboarding === false && pathname !== '/onboarding') {
        // User is logged in but hasn't completed onboarding.
        router.replace('/onboarding');
      }
    }
  }, [loading, firebaseUser, user, pathname, router]);

  // Show a loader while we are still checking auth state OR if the user profile hasn't been fetched yet.
  // This prevents content flashing and ensures we have the user's role and onboarding status.
  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-16 w-16 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // If user has not completed onboarding, and we're not on the onboarding page, show loader
  // while the useEffect redirects them. This prevents showing the main dashboard layout.
  if (user.hasCompletedOnboarding === false && pathname !== '/onboarding') {
      return (
          <div className="flex h-screen items-center justify-center">
              <Loader2 className="h-16 w-16 animate-spin text-primary" />
          </div>
      );
  }


  return (
    <div className="flex min-h-screen w-full">
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <div className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
            <Icons.logo className="h-7 w-7 text-primary" />
            <span className="font-headline text-lg font-bold group-data-[collapsible=icon]:hidden">
              Elderly Solutions
            </span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <MainNav />
        </SidebarContent>
        <SidebarFooter>
           <Button onClick={handleLogout} variant="ghost" className="w-full justify-start group-data-[collapsible=icon]:justify-center">
              <LogOut />
              <span className="group-data-[collapsible=icon]:hidden">Logout</span>
          </Button>
        </SidebarFooter>
      </Sidebar>
      <div className="flex flex-col w-full">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="container px-0">
            {children}
          </div>
        </main>
      </div>
      <MobileNav />
       <Link href="/dashboard/knowledge">
        <Button
          variant="default"
          size="icon"
          className="fixed bottom-24 right-6 h-14 w-14 rounded-full shadow-lg z-50 lg:hidden"
        >
          <Icons.logo className="h-7 w-7" />
          <span className="sr-only">Open AI Chat</span>
        </Button>
      </Link>
    </div>
  );
}
