"use client";

import { Header } from "@/components/dashboard/header";
import { MainNav } from "@/components/dashboard/main-nav";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { LogOut, Loader2, Bot } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@/firebase";
import { signOut } from "firebase/auth";
import { useEffect } from "react";
import { useAuth } from "@/firebase";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { AIChatClient } from "@/components/dashboard/ai-chat-client";


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
    if (loading) return;

    if (!firebaseUser) {
      router.replace('/login');
    } else if (user) {
      if (user.hasCompletedOnboarding === false && pathname !== '/onboarding') {
        router.replace('/onboarding');
      } else if (user.hasCompletedOnboarding === true && pathname === '/onboarding') {
        router.replace('/dashboard');
      }
    }
  }, [loading, firebaseUser, user, pathname, router]);

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

  if (user.hasCompletedOnboarding === false && pathname !== '/onboarding') {
      return (
          <div className="flex h-screen items-center justify-center">
              <Loader2 className="h-16 w-16 animate-spin text-primary" />
          </div>
      );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar collapsible="icon">
          <SidebarHeader>
            <div className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
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
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="default"
              size="icon"
              className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50 flex"
              aria-label="Open AI Chat"
            >
              <Bot className="h-7 w-7" />
            </Button>
          </DialogTrigger>
          <DialogContent className="p-0 border-0 max-w-lg">
            <AIChatClient role={user.role} userAvatar={user.avatarUrl} />
          </DialogContent>
        </Dialog>
      </div>
    </SidebarProvider>
  );
}
