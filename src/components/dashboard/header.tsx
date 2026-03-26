import { SidebarTrigger } from '@/components/ui/sidebar';
import { UserNav } from '@/components/dashboard/user-nav';
import { Icons } from '@/components/icons';

export function Header() {
  return (
    <header className="sticky top-0 z-10 w-full border-b bg-background/70 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
            <SidebarTrigger className="md:hidden" />
            <div className="hidden items-center gap-2 md:flex">
                <Icons.logo className="h-6 w-6 text-primary" />
                <span className="font-headline text-lg font-bold">Elderly Solutions</span>
            </div>
        </div>

        <div className="flex items-center gap-4">
          <UserNav />
        </div>
      </div>
    </header>
  );
}
