
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, HeartPulse, Users, LayoutGrid, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "@/firebase";

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

  const role = user.role;

  const navItems = [
    { label: 'Home', path: `/dashboard/${role}`, icon: Home },
    { label: 'Health', path: `/dashboard/${role}/health`, icon: HeartPulse },
    { label: 'Community', path: `/dashboard/${role}/community`, icon: Users },
    { label: 'Profile', path: '/dashboard/profile', icon: LayoutGrid },
];
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background/95 backdrop-blur-sm md:hidden">
      <nav className="mx-auto flex max-w-lg items-center justify-around gap-1 p-2">
        {navItems.map((item) => {
          // Check if the current path is the exact item path or a sub-route
          const isActive = pathname === item.path || (item.path !== `/dashboard/${role}` && pathname.startsWith(item.path));
          
          return (
            <Link
              key={item.path}
              href={item.path}
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
