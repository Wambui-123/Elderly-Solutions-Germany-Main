"use client";

import { useUser } from "@/firebase";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { updateUserProfile } from "@/firebase/users";

// Role-specific onboarding components
const ElderlyOnboarding = () => (
    <>
        <CardTitle>Welcome to Elderly Solutions!</CardTitle>
        <CardDescription>Let's get your profile set up so you can connect with your caregivers and family.</CardDescription>
        <CardContent className="pt-6">
            <p className="text-muted-foreground">We'll guide you through setting up your health profile and connecting with your support network.</p>
        </CardContent>
    </>
);

const CaregiverOnboarding = () => (
    <>
        <CardTitle>Welcome, Caregiver!</CardTitle>
        <CardDescription>Let's get you set up to manage and monitor your patients.</CardDescription>
        <CardContent className="pt-6">
             <p className="text-muted-foreground">You can start by adding your first patient and exploring the health monitoring tools.</p>
        </CardContent>
    </>
);

const ProfessionalOnboarding = () => (
    <>
        <CardTitle>Welcome, Professional!</CardTitle>
        <CardDescription>Your dashboard is ready to help you oversee patient health records and progress.</CardDescription>
        <CardContent className="pt-6">
            <p className="text-muted-foreground">You can view patient rosters, generate AI-powered summaries, and track vital signs.</p>
        </CardContent>
    </>
);

export default function OnboardingPage() {
    const { user, loading } = useUser();
    const router = useRouter();

    const handleCompleteOnboarding = async () => {
        if (user) {
            await updateUserProfile(user.id, { hasCompletedOnboarding: true });
            router.push('/dashboard');
        }
    };

    if (loading || !user) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </div>
        );
    }
    
    // If onboarding is already complete, redirect to dashboard
    if (user.hasCompletedOnboarding) {
        router.replace('/dashboard');
        return (
             <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </div>
        );
    }

    const getOnboardingContent = () => {
        switch (user.role) {
            case 'elderly': return <ElderlyOnboarding />;
            case 'caregiver': return <CaregiverOnboarding />;
            case 'professional': return <ProfessionalOnboarding />;
            default: return <CardTitle>Welcome!</CardTitle>;
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
            <Card className="w-full max-w-lg text-center">
                <CardHeader>
                    {getOnboardingContent()}
                </CardHeader>
                <div className="p-6 pt-0">
                     <Button onClick={handleCompleteOnboarding} className="w-full">
                        Continue to Dashboard
                    </Button>
                </div>
            </Card>
        </div>
    );
}
