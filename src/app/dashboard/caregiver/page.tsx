"use client";

import { useUser } from "@/firebase";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserPlus } from "lucide-react";
import { PatientList } from "@/components/dashboard/caregiver/patient-list";


export default function CaregiverDashboardPage() {
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
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="space-y-6 lg:col-span-2">
                <PatientList />
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {/* This section will be connected to real-time data from health records in a future step. */}
                            <div className="flex items-center">
                                <Avatar className="flex h-9 w-9 items-center justify-center space-y-0 border">
                                   <UserPlus className="h-5 w-5 text-muted-foreground" />
                                </Avatar>
                                <div className="ml-4 space-y-1">
                                    <p className="text-sm font-medium leading-none">Real-time patient activity will be shown here.</p>
                                    <p className="text-sm text-muted-foreground">Coming soon</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Appointments</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center text-center">
                     {/* This section will be connected to the events collection in a future step. */}
                    <p className="text-muted-foreground mt-4">Your upcoming appointments with patients will be displayed here.</p>
                  </CardContent>
                </Card>
              </div>
            </div>
        </>
    );
}
