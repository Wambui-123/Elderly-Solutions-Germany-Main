import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Bot, CheckCircle2, Pill } from 'lucide-react';
import type { User, Medication } from '@/lib/types';
import Link from 'next/link';

interface ElderlyDashboardProps {
  user: User;
  medications: Medication[];
}

export function ElderlyDashboard({ user, medications }: ElderlyDashboardProps) {
  const morningMeds = medications.filter(m => m.time.includes('AM'));
  const afternoonMeds = medications.filter(m => m.time.includes('PM'));

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-6">
        <Card className="flex flex-col items-center justify-center bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-8 text-center">
            <h2 className="font-headline text-2xl">Good Morning, {user.name.split(' ')[0]}!</h2>
            <p className="mt-2 mb-6">How are you feeling today?</p>
            <Button size="lg" variant="secondary" className="h-auto py-4 px-8 text-lg">
                <CheckCircle2 className="mr-3 h-8 w-8" />
                Daily Check-in
            </Button>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Need Help?</CardTitle>
                <CardDescription>Our AI assistant is here for you.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="mb-4 text-sm text-muted-foreground">
                    If you have questions about your tasks or medication, just ask.
                </p>
                <Button asChild className="w-full">
                    <Link href="/dashboard/knowledge">
                        <Bot className="mr-2 h-4 w-4" />
                        Ask Assistant
                    </Link>
                </Button>
            </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Today's Medication</CardTitle>
          <CardDescription>Your personal medication schedule.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div>
                <h3 className="font-semibold mb-2">Morning</h3>
                <div className="space-y-3">
                    {morningMeds.map(med => (
                        <div key={med.id} className="flex items-center gap-4">
                            <Pill className="h-5 w-5 text-primary" />
                            <div className='flex-1'>
                                <p className="font-medium">{med.name}</p>
                                <p className="text-xs text-muted-foreground">{med.dosage}</p>
                            </div>
                             <Button variant={med.status === 'Taken' ? 'ghost' : 'default'} size="sm" disabled={med.status === 'Taken'}>
                                {med.status === 'Taken' ? 'Taken' : 'Take'}
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
            <Separator />
            <div>
                <h3 className="font-semibold mb-2">Afternoon</h3>
                 <div className="space-y-3">
                    {afternoonMeds.map(med => (
                        <div key={med.id} className="flex items-center gap-4">
                            <Pill className="h-5 w-5 text-primary" />
                            <div className='flex-1'>
                                <p className="font-medium">{med.name}</p>
                                <p className="text-xs text-muted-foreground">{med.dosage}</p>
                            </div>
                            <Button variant={med.status === 'Taken' ? 'ghost' : 'default'} size="sm" disabled={med.status === 'Taken'}>
                                {med.status === 'Taken' ? 'Taken' : 'Take'}
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
