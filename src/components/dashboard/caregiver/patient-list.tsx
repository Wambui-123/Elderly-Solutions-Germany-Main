'use client';

import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { User } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

function PatientCard({ patientId }: { patientId: string }) {
    const firestore = useFirestore();
    const patientDocRef = useMemoFirebase(() => doc(firestore, 'users', patientId), [firestore, patientId]);
    const { data: patient, isLoading } = useDoc<User>(patientDocRef);

    if (isLoading) {
        return (
            <Card className="flex items-center gap-4 p-4 h-24">
                <Loader2 className="h-6 w-6 animate-spin" />
            </Card>
        );
    }

    if (!patient) {
        return null;
    }
    
    // This is a placeholder for a real status from the patient's data
    const status: 'Stable' | 'Critical' = Math.random() > 0.5 ? 'Stable' : 'Critical';

    return (
        <Card className="flex items-center gap-4 p-4">
             <Avatar className="h-12 w-12">
                <AvatarImage src={patient.avatarUrl} alt={`Photo of ${patient.name}`} data-ai-hint="smiling senior" />
                <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
                <p className="font-semibold">{patient.name}</p>
                <p className="text-sm text-muted-foreground">{patient.email}</p>
            </div>
            <Badge variant={status === 'Stable' ? 'secondary' : 'destructive'}>{status}</Badge>
        </Card>
    );
}


export function PatientList() {
    const { user, loading } = useUser();

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Patient Overview</CardTitle>
                    <CardDescription>Status of patients under your care.</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center items-center h-40">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </CardContent>
            </Card>
        );
    }
    
    const patientIds = user?.managedPatientIds || [];

    return (
        <Card>
            <CardHeader>
                <CardTitle>Patient Overview</CardTitle>
                <CardDescription>Status of patients under your care.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
                {patientIds.length > 0 ? (
                    patientIds.map(id => <PatientCard key={id} patientId={id} />)
                ) : (
                    <div className="md:col-span-2 text-center text-muted-foreground py-10">
                        <p>You are not yet linked to any patients.</p>
                        <Button variant="link" asChild>
                            <Link href="/onboarding">Link to a Patient now</Link>
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
