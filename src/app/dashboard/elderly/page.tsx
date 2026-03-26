"use client";

import { Button } from '@/components/ui/button';
import { useUser } from "@/firebase";
import { Bot } from 'lucide-react';
import Link from 'next/link';
import { DailyCheckinCard } from '@/components/dashboard/elderly/daily-checkin-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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
                    Here's your overview for today. We're glad to see you.
                </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
                <DailyCheckinCard />

                <Card>
                    <CardHeader>
                        <CardTitle>Need Help?</CardTitle>
                        <CardDescription>Our AI assistant is here for you.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="mb-4 text-sm text-muted-foreground">
                            If you have questions about your tasks or medication, just ask. Our friendly assistant can provide clear answers.
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
        </>
    );
}
