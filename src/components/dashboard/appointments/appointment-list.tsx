"use client";

import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy } from 'firebase/firestore';
import type { Event as AppointmentEvent } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Loader2, Calendar, PlusCircle } from 'lucide-react';
import { format } from 'date-fns';

function AppointmentCard({ appointment }: { appointment: AppointmentEvent }) {
    const startTime = (appointment.startTime as any)?.seconds 
        ? new Date((appointment.startTime as any).seconds * 1000) 
        : new Date();
    
    return (
        <div className="flex items-start gap-4 rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
            <div className="flex flex-col items-center justify-center p-2 bg-muted rounded-md w-16 text-center">
                <span className="text-sm font-bold uppercase text-primary">{format(startTime, 'MMM')}</span>
                <span className="text-2xl font-bold">{format(startTime, 'd')}</span>
            </div>
            <div className="flex-1">
                <h3 className="font-semibold">{appointment.title}</h3>
                <p className="text-sm text-muted-foreground">{format(startTime, 'h:mm a')}</p>
                <p className="text-sm text-muted-foreground mt-1">{appointment.location}</p>
            </div>
        </div>
    );
}

export function AppointmentList() {
    const { user, loading: userLoading } = useUser();
    const firestore = useFirestore();

    const appointmentsQuery = useMemoFirebase(() => {
        if (!user) return null;
        return query(
            collection(firestore, 'events'),
            where('attendeeIds', 'array-contains', user.id),
            orderBy('startTime', 'desc')
        );
    }, [firestore, user]);

    const { data: appointments, isLoading: appointmentsLoading } = useCollection<AppointmentEvent>(appointmentsQuery);

    const isLoading = userLoading || appointmentsLoading;

    const upcomingAppointments = appointments?.filter(a => (a.startTime as any).seconds * 1000 > Date.now()) || [];
    const pastAppointments = appointments?.filter(a => (a.startTime as any).seconds * 1000 <= Date.now()) || [];

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Your Appointments</CardTitle>
                    <CardDescription>View and manage your upcoming and past appointments.</CardDescription>
                </div>
                 <Button size="sm" onClick={() => alert("Booking new appointments coming soon!")}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Book New
                </Button>
            </CardHeader>
            <CardContent className="space-y-6">
                {isLoading ? (
                    <div className="flex h-64 items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : !appointments || appointments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground">
                        <Calendar className="h-12 w-12 mb-4" />
                        <p className="font-semibold">No appointments scheduled.</p>
                        <p className="text-sm">You can book new appointments with caregivers and professionals.</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-lg font-semibold mb-4">Upcoming</h2>
                            {upcomingAppointments.length > 0 ? (
                                <div className="space-y-4">
                                    {upcomingAppointments.map(app => <AppointmentCard key={app.id} appointment={app} />)}
                                </div>
                            ) : (
                                <p className="text-muted-foreground text-sm">You have no upcoming appointments.</p>
                            )}
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold mb-4">Past</h2>
                             {pastAppointments.length > 0 ? (
                                <div className="space-y-4">
                                    {pastAppointments.map(app => <AppointmentCard key={app.id} appointment={app} />)}
                                </div>
                            ) : (
                                <p className="text-muted-foreground text-sm">You have no past appointments.</p>
                            )}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
