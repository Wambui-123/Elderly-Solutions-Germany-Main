

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
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AIChatClient } from "@/components/dashboard/ai-chat-client";
import { MobileNav } from "@/components/dashboard/mobile-nav";


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
      <div className="min-h-screen w-full bg-background">
        <Header />
        <div className="flex h-[calc(100vh-4rem)]">
          <Sidebar collapsible="icon">
            <SidebarHeader />
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
              className="fixed bottom-20 right-6 h-14 w-14 rounded-full shadow-lg z-50 flex md:bottom-6"
              aria-label="Open AI Chat"
            >
              <Bot className="h-7 w-7" />
            </Button>
          </DialogTrigger>
          <DialogContent className="p-0 border-0 max-w-md w-full h-[90vh] md:h-[70vh] md:max-h-[700px]">
            <DialogTitle className="sr-only">AI Assistant</DialogTitle>
            <AIChatClient role={user.role} userAvatar={user.avatarUrl} isPopup={true} />
          </DialogContent>
        </Dialog>
        <MobileNav />
      </div>
    </SidebarProvider>
  );
}
