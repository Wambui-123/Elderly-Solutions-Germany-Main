

import { UserNav } from '@/components/dashboard/user-nav';
import Link from 'next/link';

export function Header() {
  return (
    <header className="sticky top-0 z-10 w-full border-b bg-background/70 backdrop-blur-xl h-16">
      <div className="container flex h-full items-center justify-between">
        <div className="hidden md:flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-2">
                <span className="font-headline text-xl font-bold">
                Elderly Solutions
                </span>
            </Link>
        </div>
        <div className="flex items-center gap-4 ml-auto">
          <UserNav />
        </div>
      </div>
    </header>
  );
}
