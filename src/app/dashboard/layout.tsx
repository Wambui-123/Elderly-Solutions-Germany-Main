import { Icons } from "@/components/icons";
import { Header } from "@/components/dashboard/header";
import { MainNav } from "@/components/dashboard/main-nav";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Settings, LogOut, Bot } from "lucide-react";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
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
           <Button asChild variant="ghost" className="w-full justify-start group-data-[collapsible=icon]:justify-center">
            <Link href="/">
              <LogOut />
              <span className="group-data-[collapsible=icon]:hidden">Logout</span>
            </Link>
          </Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
          <Header />
          <main className="flex-1 overflow-y-auto py-6">
            <div className="container">
              {children}
            </div>
          </main>
          <Button asChild size="icon" className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg z-30">
              <Link href="/dashboard/knowledge">
                  <Bot className="h-8 w-8" />
                  <span className="sr-only">AI Knowledge Hub</span>
              </Link>
          </Button>
      </SidebarInset>
    </SidebarProvider>
  );
}
