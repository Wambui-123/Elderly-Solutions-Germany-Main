import { LayoutGrid, HeartPulse, MessageCircle, Sparkles, CircleUser, CalendarDays, Users, ClipboardList, Stethoscope, ShieldCheck } from 'lucide-react';

export const ELDERLY_NAV_LINKS = [
  { href: '/dashboard/elderly', label: 'Overview', icon: LayoutGrid },
  { href: '/dashboard/elderly/health', label: 'Health', icon: HeartPulse },
  { href: '/dashboard/elderly/appointments', label: 'Appointments', icon: CalendarDays },
  { href: '/dashboard/elderly/community', label: 'Community', icon: Users },
  { href: '/dashboard/knowledge', label: 'Knowledge Hub', icon: Sparkles },
  { href: '/dashboard/profile', label: 'Profile', icon: CircleUser },
];

export const CAREGIVER_NAV_LINKS = [
    { href: '/dashboard/caregiver', label: 'Dashboard', icon: LayoutGrid },
    { href: '/dashboard/caregiver/health', label: 'Patient Health', icon: ClipboardList },
    { href: '/dashboard/caregiver/appointments', label: 'Appointments', icon: CalendarDays },
    { href: '/dashboard/caregiver/community', label: 'Care Circle', icon: Users },
    { href: '/dashboard/knowledge', label: 'Knowledge Hub', icon: Sparkles },
    { href: '/dashboard/profile', label: 'Profile', icon: CircleUser },
];

export const PROFESSIONAL_NAV_LINKS = [
    { href: '/dashboard/professional', label: 'Dashboard', icon: LayoutGrid },
    { href: '/dashboard/professional/health', label: 'Patient Vitals', icon: Stethoscope },
    { href: '/dashboard/professional/appointments', label: 'Appointments', icon: CalendarDays },
    { href: '/dashboard/professional/community', label: 'Consultations', icon: MessageCircle },
    { href: '/dashboard/knowledge', label: 'AI Assistant', icon: Sparkles },
    { href: '/dashboard/profile', label: 'Profile', icon: CircleUser },
];

export const ADMIN_NAV_LINKS = [
    { href: '/dashboard/admin', label: 'Dashboard', icon: ShieldCheck },
];
