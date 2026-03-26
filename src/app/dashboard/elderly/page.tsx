"use client";

import { ElderlyDashboard } from "@/components/dashboard/overview/elderly-dashboard";
import { useUser } from "@/firebase";
import { data } from "@/lib/data"; // Keep using mock data for medications for now

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
            <ElderlyDashboard user={user} medications={data.medications} />
        </>
    );
}
