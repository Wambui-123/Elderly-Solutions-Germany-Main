
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from "@/firebase";
import { updateUserProfile, findUserByEmail, linkUserToPatient } from "@/firebase/users";
import type { User } from '@/lib/types';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from '@/components/ui/textarea';
import { Loader2, User as UserIcon, Heart, Accessibility, Search, CheckCircle, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';


// Step Components
const ElderlyStep1 = ({ formData, setFormData }: { formData: any, setFormData: any }) => (
    <div className="space-y-4">
        <div className="space-y-2">
            <label className="font-semibold">Mobility & Access Needs</label>
            <Textarea
                value={formData.mobilityNeeds}
                onChange={(e) => setFormData({ ...formData, mobilityNeeds: e.target.value })}
                className="h-24"
                placeholder="e.g., I use a walker, require ramps for access..."
            />
            <p className="text-sm text-muted-foreground">This helps us tailor event locations and services for you.</p>
        </div>
    </div>
);

const ElderlyStep2 = ({ formData, setFormData }: { formData: any, setFormData: any }) => (
    <div className="space-y-4">
        <div className="space-y-2">
            <label className="font-semibold">Health Alerts & Conditions</label>
            <Textarea
                value={formData.healthAlerts}
                onChange={(e) => setFormData({ ...formData, healthAlerts: e.target.value })}
                className="h-24"
                placeholder="e.g., Allergic to penicillin, diabetic, history of falls..."
            />
            <p className="text-sm text-muted-foreground">This information is shared only with your authorized care team in case of an emergency.</p>
        </div>
    </div>
);

const CaregiverStep1 = ({ onComplete }: { onComplete: (patient: User) => void }) => {
    const [isSearching, setIsSearching] = useState(false);
    const [searchError, setSearchError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [foundUser, setFoundUser] = useState<User | null>(null);

    const handleSearch = async () => {
        if (!searchTerm) return;
        setIsSearching(true);
        setSearchError('');
        setFoundUser(null);
        try {
            const userResult = await findUserByEmail(searchTerm);
            if (userResult) {
                setFoundUser(userResult);
            } else {
                setSearchError('No elderly user found with that email. Please ensure they have created an account.');
            }
        } catch (error) {
            setSearchError('An error occurred while searching. Please try again.');
            console.error(error);
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <div className="flex items-end gap-2">
                    <div className="flex-1 space-y-2">
                        <label className="font-semibold">Patient's Email Address</label>
                        <Input
                            type="email"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="e.g., patient@example.com"
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />
                    </div>
                    <Button onClick={handleSearch} disabled={isSearching}>
                        {isSearching ? <Loader2 className="animate-spin" /> : <Search className="h-4 w-4" />}
                        <span className="ml-2">Search</span>
                    </Button>
                </div>
                {searchError && <p className="text-sm text-destructive">{searchError}</p>}
                {foundUser && (
                    <Card className="bg-muted/50 p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <UserIcon className="h-8 w-8 text-primary" />
                                <div>
                                    <p className="font-bold">{foundUser.name}</p>
                                    <p className="text-sm text-muted-foreground">{foundUser.email}</p>
                                </div>
                            </div>
                            <Button size="sm" onClick={() => onComplete(foundUser)}>
                                <CheckCircle className="mr-2 h-4 w-4" /> Link to this Patient
                            </Button>
                        </div>
                    </Card>
                )}
            </div>
            <p className="text-sm text-muted-foreground italic">
              Linking allows you to access health logs and coordinate with other care circle members. The patient must have an existing 'Elderly' account.
            </p>
        </div>
    );
};


export default function OnboardingPage() {
    const { user, loading } = useUser();
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Form data state
    const [formData, setFormData] = useState({
        mobilityNeeds: '',
        healthAlerts: '',
    });
    // State for caregiver/pro flow
    const [linkedPatient, setLinkedPatient] = useState<User | null>(null);

    // Define steps based on role
    let steps: { title: string; description: string; icon: React.ReactNode; content: React.ReactNode }[] = [];

    if (user?.role === 'elderly') {
        steps = [
            { title: "Mobility Needs", description: "Help us understand your physical needs to better tailor your experience.", icon: <Accessibility />, content: <ElderlyStep1 formData={formData} setFormData={setFormData} /> },
            { title: "Health Information", description: "Provide critical health information for your dedicated care team.", icon: <Heart />, content: <ElderlyStep2 formData={formData} setFormData={setFormData} /> },
        ];
    } else if (user?.role === 'caregiver' || user?.role === 'professional') {
        steps = [
            { title: "Link to Patient", description: `Find the patient you'll be caring for by searching their email address.`, icon: <Search />, content: <CaregiverStep1 onComplete={setLinkedPatient} /> }
        ];
    }

    useEffect(() => {
        // If a caregiver has linked a patient, move to the (virtual) next step for submission.
        if (linkedPatient) {
            setStep(step + 1);
        }
    }, [linkedPatient, step]);
    
    if (loading || !user) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </div>
        );
    }
    
    // If onboarding is somehow already complete, redirect away.
    if (user.hasCompletedOnboarding) {
        router.replace('/dashboard');
        return <div className="flex h-screen items-center justify-center"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>;
    }

    const currentStepConfig = steps[step - 1];
    const isLastStep = step >= steps.length;
    
    const handleNext = () => {
        if (!isLastStep) {
            setStep(step + 1);
        }
    };

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1);
            if (linkedPatient) setLinkedPatient(null);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const dataToUpdate: Partial<User> = { hasCompletedOnboarding: true };

            if (user.role === 'elderly') {
                dataToUpdate.mobilityNeeds = formData.mobilityNeeds;
                dataToUpdate.healthAlerts = formData.healthAlerts;
            }
            
            // Update the current user's profile with onboarding data
            await updateUserProfile(user.id, dataToUpdate);

            // If a caregiver/pro linked a patient, establish the connection
            if ((user.role === 'caregiver' || user.role === 'professional') && linkedPatient) {
                await linkUserToPatient({ 
                    caregiverOrProId: user.id, 
                    patientId: linkedPatient.id, 
                    role: user.role 
                });
            }
            
            // On successful completion, redirect to dashboard
            router.push('/dashboard');

        } catch (error) {
            console.error("Failed to complete onboarding:", error);
            // Optionally, show an error toast to the user
            setIsSubmitting(false);
        }
    };


    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
            <Card className="w-full max-w-2xl">
                 <CardHeader>
                    <div className="mb-4 flex items-center gap-4">
                         <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                            {currentStepConfig?.icon || <UserIcon />}
                        </div>
                        <div>
                            <CardTitle className="text-2xl">{currentStepConfig?.title || "Welcome!"}</CardTitle>
                            <CardDescription>{currentStepConfig?.description || "Let's get your profile set up."}</CardDescription>
                        </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="flex w-full gap-2 pt-2">
                        {steps.map((_, i) => (
                             <div key={i} className={cn("h-1.5 flex-1 rounded-full", i < step ? 'bg-primary' : 'bg-muted-foreground/20' )} />
                        ))}
                    </div>
                </CardHeader>
                <CardContent className="min-h-[250px] py-6">
                    {currentStepConfig?.content}
                    {linkedPatient && (
                        <div className="mt-6">
                            <Card className="bg-green-50 border-green-200 p-4">
                                 <div className="flex items-center gap-4">
                                    <CheckCircle className="h-8 w-8 text-green-600" />
                                    <div>
                                        <p className="font-bold text-green-800">Patient Linked Successfully!</p>
                                        <p className="text-sm text-green-700">You are ready to complete your profile setup.</p>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    )}
                </CardContent>
                 <div className="flex items-center justify-end gap-4 p-6 border-t">
                    {step > 1 && (
                        <Button variant="outline" onClick={handleBack}>
                            Back
                        </Button>
                    )}

                    {!isLastStep ? (
                        <Button onClick={handleNext}>
                            Next <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    ) : (
                         <Button onClick={handleSubmit} disabled={isSubmitting || ( (user.role === 'caregiver' || user.role === 'professional') && !linkedPatient)}>
                            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                            Complete Setup
                        </Button>
                    )}
                </div>
            </Card>
        </div>
    );
}

