import { RegisterForm } from '@/components/auth/register-form';
import { Icons } from '@/components/icons';
import Link from 'next/link';

export default function SignupPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center">
          <Link href="/" className="mb-4">
            <Icons.logo className="h-16 w-16 text-primary" />
          </Link>
          <h1 className="mt-4 font-headline text-3xl font-bold text-center">
            Create an Account
          </h1>
          <p className="mt-2 text-center text-muted-foreground">
            Get started with Elderly Solutions today.
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
