"use server";

import { redirect } from 'next/navigation';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function login(prevState: { message: string }, formData: FormData) {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!parsed.success) {
    return { message: 'Invalid email or password format.' };
  }

  // Mock authentication logic
  if (parsed.data.email === 'caregiver@example.com' && parsed.data.password === 'password') {
    // In a real app, you would set a session cookie here.
    redirect('/dashboard');
  }
  if (parsed.data.email === 'elderly@example.com' && parsed.data.password === 'password') {
    redirect('/dashboard');
  }
  if (parsed.data.email === 'pro@example.com' && parsed.data.password === 'password') {
    redirect('/dashboard');
  }

  return { message: 'Invalid email or password.' };
}
