"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, HeartPulse, Users, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

const bottomNavItems = [
    { label: 'Home', path: '/dashboard', icon: Home },
    { label: 'Health', path: '/dashboard/health', icon: HeartPulse },
    { label: 'Community', path: '/dashboard/community', icon: Users },
    { label: 'Menu', path: '/dashboard/profile', icon: LayoutGrid },
];

export function MobileNav() {
  const pathname = usePathname();
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-stone-200 px-4 py-2 lg:hidden">
      <div className="max-w-lg mx-auto flex items-center justify-between gap-1">
        {bottomNavItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={cn(
              "flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all active:scale-90",
              pathname === item.path 
                ? "text-primary bg-stone-100" 
                : "text-stone-400 hover:text-primary"
            )}
          >
            <item.icon size={20} strokeWidth={pathname === item.path ? 2.5 : 2} />
            <span className="text-[9px] font-bold uppercase tracking-wider">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
