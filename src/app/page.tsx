import { LoginForm } from '@/components/auth/login-form';
import { Icons } from '@/components/icons';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center">
          <Icons.logo className="h-16 w-16 text-primary" />
          <h1 className="mt-4 font-headline text-3xl font-bold text-center">
            Elderly Solutions Germany
          </h1>
          <p className="mt-2 text-center text-muted-foreground">
            Welcome back. Please sign in to your account.
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
