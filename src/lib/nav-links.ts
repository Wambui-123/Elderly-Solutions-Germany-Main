import { Home, HeartPulse, MessageSquare, BrainCircuit, User, CalendarDays, Users, BriefcaseMedical, LayoutDashboard } from 'lucide-react';

export const ELDERLY_NAV_LINKS = [
  { href: '/dashboard', label: 'Overview', icon: Home },
  { href: '/dashboard/health', label: 'Health', icon: HeartPulse },
  { href: '/dashboard/appointments', label: 'Appointments', icon: CalendarDays },
  { href: '/dashboard/community', label: 'Community', icon: MessageSquare },
  { href: '/dashboard/knowledge', label: 'Knowledge Hub', icon: BrainCircuit },
  { href: '/dashboard/profile', label: 'Profile', icon: User },
];

export const CAREGIVER_NAV_LINKS = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/health', label: 'Patient Health', icon: HeartPulse },
    { href: '/dashboard/appointments', label: 'Appointments', icon: CalendarDays },
    { href: '/dashboard/community', label: 'Care Circle', icon: Users },
    { href: '/dashboard/knowledge', label: 'Knowledge Hub', icon: BrainCircuit },
    { href: '/dashboard/profile', label: 'Profile', icon: User },
];

export const PROFESSIONAL_NAV_LINKS = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/health', label: 'Patient-Vitals', icon: HeartPulse },
    { href: '/dashboard/appointments', label: 'Appointments', icon: CalendarDays },
    { href: '/dashboard/community', label: 'Consultations', icon: MessageSquare },
    { href: '/dashboard/knowledge', label: 'AI Assistant', icon: BrainCircuit },
    { href: '/dashboard/profile', label: 'Profile', icon: User },
];

export const ADMIN_NAV_LINKS = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    // Future links can be added here e.g.
    // { href: '/dashboard/admin/users', label: 'User Management', icon: Users },
    // { href: '/dashboard/admin/settings', label: 'Platform Settings', icon: Settings },
];
