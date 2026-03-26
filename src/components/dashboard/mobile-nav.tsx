"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MOBILE_NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";

export function MobileNav() {
  const pathname = usePathname();
  return (
    <div className="fixed bottom-0 z-10 w-full border-t bg-background/70 backdrop-blur-xl md:hidden">
        <div className="container flex h-16 items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-2">
                <Icons.logo className="h-6 w-6 text-primary"/>
                <span className="sr-only">Elderly Solutions</span>
            </Link>
            <nav className="flex items-center gap-1">
                {MOBILE_NAV_LINKS.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center rounded-md p-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
                                isActive && "text-primary"
                            )}
                        >
                            <item.icon className="h-5 w-5" />
                            <span className="text-xs">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    </div>
  );
}
