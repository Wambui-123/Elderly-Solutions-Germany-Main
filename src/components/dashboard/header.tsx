
import { SidebarTrigger } from '@/components/ui/sidebar';
import { UserNav } from '@/components/dashboard/user-nav';
import Link from 'next/link';

export function Header() {
  return (
    <header className="sticky top-0 z-10 w-full border-b bg-background/70 backdrop-blur-xl h-16">
      <div className="container flex h-full items-center justify-between">
        <div className="flex items-center gap-2">
            <SidebarTrigger className="md:hidden" />
             <Link href="/dashboard" className="font-headline text-xl font-bold text-primary md:hidden">
                Elderly Solutions
            </Link>
        </div>

        <div className="flex items-center gap-4">
          <UserNav />
        </div>
      </div>
    </header>
  );
}
