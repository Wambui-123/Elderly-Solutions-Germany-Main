
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "@/firebase";
import { ADMIN_NAV_LINKS, CAREGIVER_NAV_LINKS, ELDERLY_NAV_LINKS, PROFESSIONAL_NAV_LINKS, type NavLink } from "@/lib/nav-links";

export function MobileNav() {
  const pathname = usePathname();
  const { user, loading } = useUser();

  if (loading || !user) {
    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 h-16 bg-background/95 backdrop-blur-sm border-t md:hidden flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
        </div>
    );
  }

  const { role } = user;

  let allNavLinks: NavLink[] = [];
    switch (role) {
      case 'elderly':
        allNavLinks = ELDERLY_NAV_LINKS;
        break;
      case 'caregiver':
        allNavLinks = CAREGIVER_NAV_LINKS;
        break;
      case 'professional':
        allNavLinks = PROFESSIONAL_NAV_LINKS;
        break;
      case 'admin':
        allNavLinks = ADMIN_NAV_LINKS;
        break;
      default:
        allNavLinks = ELDERLY_NAV_LINKS;
    }

    const homeLink = allNavLinks.find(l => l.href === `/dashboard/${role}`);
    const healthLink = allNavLinks.find(l => l.href === `/dashboard/${role}/health`);
    const communityLink = allNavLinks.find(l => l.href === `/dashboard/${role}/community`);
    const profileLink = allNavLinks.find(l => l.href === '/dashboard/profile');

    const navItems = [homeLink, healthLink, communityLink, profileLink].filter(Boolean) as NavLink[];

  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background/95 backdrop-blur-sm md:hidden">
      <nav className="mx-auto flex max-w-lg items-center justify-around gap-1 p-2">
        {navItems.map((item) => {
          // Check if the current path is the exact item path or a sub-route
          const isActive = pathname === item.href || (item.href !== `/dashboard/${role}` && pathname.startsWith(item.href) && item.href !== '/dashboard/profile');
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 rounded-xl px-3 py-1.5 text-sm transition-all active:scale-95",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-primary"
              )}
            >
              <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-bold">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
