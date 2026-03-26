"use client";

import { AdminDashboard } from "@/components/dashboard/overview/admin-dashboard";
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
            <AdminDashboard user={user} />
        </>
    );
}
