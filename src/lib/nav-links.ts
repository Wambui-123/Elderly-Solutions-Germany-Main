import {
  LayoutDashboard,
  HeartPulse,
  MessageSquareQuote,
  WandSparkles,
  CircleUserRound,
  CalendarClock,
  UsersRound,
  ClipboardPenLine,
  Stethoscope,
  ShieldCheck
} from 'lucide-react';

export const ELDERLY_NAV_LINKS = [
  { href: '/dashboard/elderly', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/elderly/health', label: 'Health', icon: HeartPulse },
  { href: '/dashboard/elderly/appointments', label: 'Appointments', icon: CalendarClock },
  { href: '/dashboard/elderly/community', label: 'Community', icon: UsersRound },
  { href: '/dashboard/knowledge', label: 'Knowledge Hub', icon: WandSparkles },
  { href: '/dashboard/profile', label: 'Profile', icon: CircleUserRound },
];

export const CAREGIVER_NAV_LINKS = [
    { href: '/dashboard/caregiver', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/caregiver/health', label: 'Patient Health', icon: ClipboardPenLine },
    { href: '/dashboard/caregiver/appointments', label: 'Appointments', icon: CalendarClock },
    { href: '/dashboard/caregiver/community', label: 'Care Circle', icon: UsersRound },
    { href: '/dashboard/knowledge', label: 'Knowledge Hub', icon: WandSparkles },
    { href: '/dashboard/profile', label: 'Profile', icon: CircleUserRound },
];

export const PROFESSIONAL_NAV_LINKS = [
    { href: '/dashboard/professional', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/professional/health', label: 'Patient Vitals', icon: Stethoscope },
    { href: '/dashboard/professional/appointments', label: 'Appointments', icon: CalendarClock },
    { href: '/dashboard/professional/community', label: 'Consultations', icon: MessageSquareQuote },
    { href: '/dashboard/knowledge', label: 'AI Assistant', icon: WandSparkles },
    { href: '/dashboard/profile', label: 'Profile', icon: CircleUserRound },
];

export const ADMIN_NAV_LINKS = [
    { href: '/dashboard/admin', label: 'Dashboard', icon: ShieldCheck },
];
