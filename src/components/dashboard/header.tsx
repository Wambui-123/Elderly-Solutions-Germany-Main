import { SidebarTrigger } from '@/components/ui/sidebar';
import { UserNav } from '@/components/dashboard/user-nav';

export function Header() {
  return (
    <header className="sticky top-0 z-10 w-full border-b bg-background/70 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
            <SidebarTrigger className="md:hidden" />
        </div>

        <div className="flex items-center gap-4">
          <UserNav />
        </div>
      </div>
    </header>
  );
}
