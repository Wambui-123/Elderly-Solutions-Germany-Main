
import { UserNav } from '@/components/dashboard/user-nav';

export function Header() {
  return (
    <header className="sticky top-0 z-10 w-full border-b bg-background/70 backdrop-blur-xl h-16">
      <div className="container flex h-full items-center justify-end">
        <div className="flex items-center gap-4">
          <UserNav />
        </div>
      </div>
    </header>
  );
}
