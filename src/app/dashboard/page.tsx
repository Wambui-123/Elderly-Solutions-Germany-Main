"use client";
import { useUser } from "@/firebase";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function DashboardRootPage() {
    const { user, loading } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (!loading && user) {
            const { role } = user;
            if (role) {
                // Redirect to the role-specific dashboard
                router.replace(`/dashboard/${role}`);
            } else {
                // Handle case where user has no role, maybe redirect to profile setup
                router.replace('/dashboard/profile');
            }
        } else if (!loading && !user) {
            // Not logged in
            router.replace('/login');
        }
    }, [user, loading, router]);


    return (
        <div className="flex h-[80vh] w-full items-center justify-center">
             <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
                <p className="text-muted-foreground">Loading your dashboard...</p>
            </div>
        </div>
    );
}
