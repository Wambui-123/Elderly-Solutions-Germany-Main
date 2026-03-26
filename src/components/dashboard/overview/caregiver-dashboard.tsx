import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, UserPlus, Video } from 'lucide-react';
import type { Patient, User } from '@/lib/types';

interface CaregiverDashboardProps {
  user: User;
  patients: Patient[];
}

export function CaregiverDashboard({ user, patients }: CaregiverDashboardProps) {
  const upcomingAppointment = {
    patient: patients[1],
    time: '3:00 PM',
    type: 'Video Call',
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Patient Overview</CardTitle>
            <CardDescription>Status of patients under your care.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            {patients.map((patient) => (
              <Card key={patient.id} className="flex items-center gap-4 p-4">
                <Image
                  src={patient.avatarUrl}
                  alt={`Photo of ${patient.name}`}
                  width={64}
                  height={64}
                  className="h-16 w-16 rounded-full object-cover"
                  data-ai-hint="smiling senior"
                />
                <div className="flex-1">
                  <p className="font-semibold">{patient.name}</p>
                  <p className="text-sm text-muted-foreground">{patient.condition}</p>
                </div>
                <Badge variant={patient.status === 'Stable' ? 'secondary' : 'destructive'}>{patient.status}</Badge>
              </Card>
            ))}
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex items-center">
                        <Avatar className="h-9 w-9">
                            <AvatarImage src={patients[0].avatarUrl} alt="Avatar" data-ai-hint="smiling senior" />
                            <AvatarFallback>HW</AvatarFallback>
                        </Avatar>
                        <div className="ml-4 space-y-1">
                            <p className="text-sm font-medium leading-none">{patients[0].name} reported high blood pressure.</p>
                            <p className="text-sm text-muted-foreground">15 minutes ago</p>
                        </div>
                        <Button variant="ghost" size="icon" className="ml-auto">
                            <Bell className="h-4 w-4" />
                        </Button>
                    </div>
                     <div className="flex items-center">
                        <Avatar className="flex h-9 w-9 items-center justify-center space-y-0 border">
                           <UserPlus className="h-5 w-5 text-muted-foreground" />
                        </Avatar>
                        <div className="ml-4 space-y-1">
                            <p className="text-sm font-medium leading-none">New patient assigned: Erika Vogel</p>
                            <p className="text-sm text-muted-foreground">2 hours ago</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Appointment</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center text-center">
            <Image
              src={upcomingAppointment.patient.avatarUrl}
              alt={`Photo of ${upcomingAppointment.patient.name}`}
              width={80}
              height={80}
              className="h-20 w-20 rounded-full object-cover"
              data-ai-hint="smiling man"
            />
            <p className="mt-2 font-semibold">{upcomingAppointment.patient.name}</p>
            <p className="text-lg font-bold text-primary">{upcomingAppointment.time}</p>
            <p className="text-sm text-muted-foreground">{upcomingAppointment.type}</p>
            <Button className="mt-4 w-full">
              <Video className="mr-2 h-4 w-4" />
              Join Call
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
