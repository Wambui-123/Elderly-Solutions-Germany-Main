"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from "@/firebase";
import { Bot, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { MedicationSchedule } from '@/components/dashboard/elderly/medication-schedule';

export default function ElderlyDashboardPage() {
    const { user } = useUser();

    if (!user) {
        return null; // Or a loading indicator
    }

    return (
        <>
            <div className="mb-6">
                <h1 className="font-headline text-3xl font-bold">
                    Welcome back, {user.name.split(' ')[0]}!
                </h1>
                <p className="text-muted-foreground">
                    Here's your overview for today.
                </p>
            </div>
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

                <MedicationSchedule />
            </div>
        </>
    );
}
