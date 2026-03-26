import { Icons } from "@/components/icons";
import { Header } from "@/components/dashboard/header";
import { MainNav } from "@/components/dashboard/main-nav";
import { MobileNav } from "@/components/dashboard/mobile-nav";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Settings, LogOut } from "lucide-react";
import Link from "next/link";
import { UserNav } from "@/components/dashboard/user-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="min-h-screen">
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
             <SidebarHeader className="md:hidden">
              <UserNav />
            </SidebarHeader>
            <Button asChild variant="ghost" className="w-full justify-start group-data-[collapsible=icon]:justify-center">
              <Link href="/dashboard/profile">
                <Settings />
                <span className="group-data-[collapsible=icon]:hidden">Settings</span>
              </Link>
            </Button>
             <Button asChild variant="ghost" className="w-full justify-start group-data-[collapsible=icon]:justify-center">
              <Link href="/">
                <LogOut />
                <span className="group-data-[collapsible=icon]:hidden">Logout</span>
              </Link>
            </Button>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
          </div>
        </SidebarInset>
        <MobileNav />
      </div>
    </SidebarProvider>
  );
}
