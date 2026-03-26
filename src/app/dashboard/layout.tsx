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
    if (loading) return; // Wait until the auth state is determined

    if (!firebaseUser) {
      // If not logged in, redirect to the login page.
      router.replace('/login');
    } else if (user) {
      // If we have the full user profile from Firestore
      if (user.hasCompletedOnboarding === false && pathname !== '/onboarding') {
        // and they haven't onboarded, redirect them to onboarding.
        router.replace('/onboarding');
      } else if (user.hasCompletedOnboarding === true && pathname === '/onboarding') {
        // and they have onboarded but are on the onboarding page, send to dashboard.
        router.replace('/dashboard');
      }
    }
    // If firebaseUser exists but `user` doesn't, it's a transient state while the
    // Firestore document is being read for the first time. The loading screen below will be shown.
  }, [loading, firebaseUser, user, pathname, router]);

  // Show a loader while we are still checking auth state OR if the user profile hasn't been fetched yet.
  // This prevents content flashing and ensures we have the user's role and onboarding status.
  if (loading || !user) {
     // This condition covers the initial auth check and the subsequent Firestore user profile fetch.
     // It prevents rendering the dashboard until we have the complete user object.
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
       <Link href="/dashboard/knowledge">
        <Button
          variant="default"
          size="icon"
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50 flex"
          aria-label="Open AI Chat"
        >
          <Icons.logo className="h-7 w-7" />
        </Button>
      </Link>
    </div>
  );
}
