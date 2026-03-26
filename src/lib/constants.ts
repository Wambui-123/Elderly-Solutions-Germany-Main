import { Home, HeartPulse, MessageSquare, BrainCircuit, User, CalendarDays } from 'lucide-react';

export const NAV_LINKS = [
  { href: '/dashboard', label: 'Overview', icon: Home },
  { href: '/dashboard/health', label: 'Health', icon: HeartPulse },
  { href: '/dashboard/appointments', label: 'Appointments', icon: CalendarDays },
  { href: '/dashboard/community', label: 'Community', icon: MessageSquare },
  { href: '/dashboard/knowledge', label: 'Knowledge Hub', icon: BrainCircuit },
  { href: '/dashboard/profile', label: 'Profile', icon: User },
];

export const MOBILE_NAV_LINKS = [
  { href: '/dashboard', label: 'Overview', icon: Home },
  { href: '/dashboard/health', label: 'Health', icon: HeartPulse },
  { href: '/dashboard/appointments', label: 'Appointments', icon: CalendarDays },
  { href: '/dashboard/community', label: 'Community', icon: MessageSquare },
  { href: '/dashboard/knowledge', label: 'AI Hub', icon: BrainCircuit },
];
