import { Home, HeartPulse, MessageSquare, BrainCircuit, User, CalendarDays, Users, BriefcaseMedical, LayoutDashboard } from 'lucide-react';

export const ELDERLY_NAV_LINKS = [
  { href: '/dashboard/elderly', label: 'Overview', icon: Home },
  { href: '/dashboard/elderly/health', label: 'Health', icon: HeartPulse },
  { href: '/dashboard/elderly/appointments', label: 'Appointments', icon: CalendarDays },
  { href: '/dashboard/elderly/community', label: 'Community', icon: MessageSquare },
  { href: '/dashboard/knowledge', label: 'Knowledge Hub', icon: BrainCircuit },
  { href: '/dashboard/profile', label: 'Profile', icon: User },
];

export const CAREGIVER_NAV_LINKS = [
    { href: '/dashboard/caregiver', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/caregiver/health', label: 'Patient Health', icon: HeartPulse },
    { href: '/dashboard/caregiver/appointments', label: 'Appointments', icon: CalendarDays },
    { href: '/dashboard/caregiver/community', label: 'Care Circle', icon: Users },
    { href: '/dashboard/knowledge', label: 'Knowledge Hub', icon: BrainCircuit },
    { href: '/dashboard/profile', label: 'Profile', icon: User },
];

export const PROFESSIONAL_NAV_LINKS = [
    { href: '/dashboard/professional', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/professional/health', label: 'Patient Vitals', icon: HeartPulse },
    { href: '/dashboard/professional/appointments', label: 'Appointments', icon: CalendarDays },
    { href: '/dashboard/professional/community', label: 'Consultations', icon: MessageSquare },
    { href: '/dashboard/knowledge', label: 'AI Assistant', icon: BrainCircuit },
    { href: '/dashboard/profile', label: 'Profile', icon: User },
];

export const ADMIN_NAV_LINKS = [
    { href: '/dashboard/admin', label: 'Dashboard', icon: LayoutDashboard },
    // Future links can be added here e.g.
    // { href: '/dashboard/admin/users', label: 'User Management', icon: Users },
    // { href: '/dashboard/admin/settings', label: 'Platform Settings', icon: Settings },
];
