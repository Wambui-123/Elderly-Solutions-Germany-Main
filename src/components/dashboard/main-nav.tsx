"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { useUser } from "@/firebase";
import { ELDERLY_NAV_LINKS, CAREGIVER_NAV_LINKS, PROFESSIONAL_NAV_LINKS, ADMIN_NAV_LINKS } from "@/lib/nav-links";

export function MainNav() {
  const pathname = usePathname();
  const { user } = useUser();

  let navLinks = ELDERLY_NAV_LINKS; // Default to elderly

  if (user) {
    switch (user.role) {
      case 'caregiver':
        navLinks = CAREGIVER_NAV_LINKS;
        break;
      case 'professional':
        navLinks = PROFESSIONAL_NAV_LINKS;
        break;
      case 'admin':
        navLinks = ADMIN_NAV_LINKS;
        break;
      case 'elderly':
      default:
        navLinks = ELDERLY_NAV_LINKS;
        break;
    }
  }


  return (
    <SidebarMenu>
      {navLinks.map((item) => (
        <SidebarMenuItem key={item.href}>
          <SidebarMenuButton
            asChild
            isActive={pathname === item.href}
            tooltip={{
              children: item.label,
              className: "bg-primary text-primary-foreground",
            }}
          >
            <Link href={item.href}>
              <item.icon />
              <span>{item.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
