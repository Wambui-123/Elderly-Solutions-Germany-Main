'use client';

import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { User } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, FileText, Loader2 } from 'lucide-react';
import Link from 'next/link';

function PatientTableRow({ patientId }: { patientId: string }) {
    const firestore = useFirestore();
    const patientDocRef = useMemoFirebase(() => doc(firestore, 'users', patientId), [firestore, patientId]);
    const { data: patient, isLoading } = useDoc<User>(patientDocRef);

    if (isLoading) {
        return (
            <TableRow>
                <TableCell colSpan={5} className="text-center">
                    <Loader2 className="inline-block h-6 w-6 animate-spin" />
                </TableCell>
            </TableRow>
        );
    }
    
    if (!patient) {
        return (
             <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                    Could not load patient data for ID: {patientId}
                </TableCell>
            </TableRow>
        );
    }

    // Placeholder data, to be replaced by real data
    const status: 'Stable' | 'Critical' = Math.random() > 0.5 ? 'Stable' : 'Critical';
    const admissionDate = new Date().toLocaleDateString();


    return (
        <TableRow>
            <TableCell>
                <div className="flex items-center gap-3">
                <Avatar className="hidden h-9 w-9 sm:flex">
                    <AvatarImage src={patient.avatarUrl} alt="Avatar" data-ai-hint="person portrait" />
                    <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="font-medium">{patient.name}</div>
                </div>
            </TableCell>
            <TableCell className="hidden sm:table-cell">{patient.healthAlerts || 'N/A'}</TableCell>
            <TableCell className="hidden sm:table-cell">
                <Badge className="text-xs" variant={status === 'Stable' ? 'secondary' : 'destructive'}>
                    {status}
                </Badge>
            </TableCell>
            <TableCell className="hidden md:table-cell">{admissionDate}</TableCell>
            <TableCell className="text-right">
                <Button asChild size="sm" variant="outline">
                    <Link href="#">
                        View
                        <ArrowUpRight className="ml-1 h-4 w-4" />
                    </Link>
                </Button>
            </TableCell>
        </TableRow>
    );
}

export function PatientRoster() {
    const { user, loading } = useUser();
    
    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Patient Roster</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </CardContent>
            </Card>
        );
    }

    const patientIds = user?.managedPatientIds || [];
    
    return (
        <Card>
            <CardHeader className="flex flex-row items-center">
                <div className="grid gap-2">
                    <CardTitle>Patient Roster</CardTitle>
                    <CardDescription>List of all currently admitted patients.</CardDescription>
                </div>
                <Button asChild size="sm" className="ml-auto gap-1">
                    <Link href="/dashboard/knowledge">
                        <FileText className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Generate Summary</span>
                    </Link>
                </Button>
            </CardHeader>
            <CardContent>
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead className="hidden sm:table-cell">Condition Notes</TableHead>
                    <TableHead className="hidden sm:table-cell">Status</TableHead>
                    <TableHead className="hidden md:table-cell">Admission Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {patientIds.length > 0 ? (
                    patientIds.map(id => <PatientTableRow key={id} patientId={id} />)
                ) : (
                    <TableRow>
                        <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                            No patients assigned.
                        </TableCell>
                    </TableRow>
                )}
                </TableBody>
            </Table>
            </CardContent>
        </Card>
    )
}
