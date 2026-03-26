"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from "@/firebase";

export default function AdminDashboardPage() {
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
                    Here's your admin overview for today.
                </p>
            </div>
            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Admin Dashboard</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>Welcome, {user.name}. Here you can manage users, settings, and monitor the platform.</p>
                        {/* More admin-specific components would go here */}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
