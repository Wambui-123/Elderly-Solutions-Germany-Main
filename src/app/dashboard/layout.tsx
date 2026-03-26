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
import { useRouter } from "next/navigation";
import { useUser, useAuth } from "@/firebase";
import { signOut } from "firebase/auth";
import { MobileNav } from "@/components/dashboard/mobile-nav";


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, firebaseUser } = useUser();
  const auth = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    if(auth) {
      await signOut(auth);
    }
    router.push('/login');
  };

  // If loading, show a spinner.
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  // If not authenticated, redirect to login.
  if (!firebaseUser && !loading) {
    router.replace('/login');
    return null;
  }
  
  // If user data is still loading but firebase user exists
  if (!user && !loading) {
    return (
       <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-16 w-16 animate-spin text-primary" />
          <p className="text-muted-foreground">Setting up your profile...</p>
        </div>
      </div>
    )
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
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
        >
          <Icons.logo className="h-7 w-7" />
          <span className="sr-only">Open AI Chat</span>
        </Button>
      </Link>
    </div>
  );
}
