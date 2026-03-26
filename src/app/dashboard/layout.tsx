

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
import { useToast } from "@/hooks/use-toast";


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, firebaseUser, error } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  const handleLogout = async () => {
    if(auth) {
      await signOut(auth);
    }
    router.push('/login');
  };

  useEffect(() => {
    if (loading) return;

    // Not authenticated at all
    if (!firebaseUser) {
      router.replace('/login');
      return;
    }

    // Authenticated, but user profile has issues
    if (!user) {
      // A specific error occurred fetching the profile (e.g., permissions)
      if (error) {
        console.error("Failed to load user profile, logging out:", error);
        toast({
          variant: "destructive",
          title: "Session Error",
          description: "Your session could not be verified. Please log in again.",
        });
        handleLogout();
      } else {
        // Auth is valid, but profile doc might not exist yet (e.g., during signup)
        // Force to onboarding to complete profile creation.
        if (pathname !== '/onboarding') {
          router.replace('/onboarding');
        }
      }
      return;
    }

    // User and profile are loaded successfully, handle onboarding status
    if (user.hasCompletedOnboarding === false && pathname !== '/onboarding') {
      router.replace('/onboarding');
    } else if (user.hasCompletedOnboarding === true && pathname === '/onboarding') {
      router.replace('/dashboard');
    }
  }, [loading, firebaseUser, user, error, pathname, router]);

  // While the initial user/profile load is happening, show a full-screen loader.
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-16 w-16 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // After the initial load, if we still don't have a user object,
  // it means a redirect is in progress. Show a loader to prevent
  // the page from rendering with incomplete data.
  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  // If the user is loaded but is on the wrong page regarding their onboarding status,
  // show a loader while the redirect from the useEffect happens.
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
