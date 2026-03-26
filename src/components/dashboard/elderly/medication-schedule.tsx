'use client';

import { useMemo } from 'react';
import { collection, query, where, Timestamp } from 'firebase/firestore';
import { useUser, useFirestore, useCollection, useMemoFirebase, setDocumentNonBlocking } from '@/firebase';
import { doc, serverTimestamp } from 'firebase/firestore';
import type { Medication, MedicationAdherence } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Loader2, Pill } from 'lucide-react';

export function MedicationSchedule() {
  const { user, loading: userLoading } = useUser();
  const firestore = useFirestore();

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const startOfDayTimestamp = Timestamp.fromDate(startOfDay);
  const endOfDayTimestamp = Timestamp.fromDate(endOfDay);

  const medicationsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return collection(firestore, 'users', user.id, 'medications');
  }, [firestore, user]);

  const adherenceQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(
      collection(firestore, 'users', user.id, 'medicationAdherence'),
      where('scheduledTime', '>=', startOfDayTimestamp),
      where('scheduledTime', '<=', endOfDayTimestamp)
    );
  }, [firestore, user, startOfDayTimestamp, endOfDayTimestamp]);

  const { data: medications, isLoading: medsLoading } = useCollection<Medication>(medicationsQuery);
  const { data: adherence, isLoading: adherenceLoading } = useCollection<MedicationAdherence>(adherenceQuery);

  const handleTakeMedication = (medication: Medication) => {
    if (!user || !firestore) return;

    // This is a simplified approach. A real app would have more complex logic
    // to find or create the correct adherence record for a specific scheduled time.
    // For this demo, we'll create a new one with the current time.
    const newAdherenceRef = doc(collection(firestore, 'users', user.id, 'medicationAdherence'));
    
    const adherenceRecord: Omit<MedicationAdherence, 'id'> = {
        medicationId: medication.id,
        patientId: user.id,
        scheduledTime: Timestamp.now(), // This should ideally be the actual scheduled time
        actualTakenTime: serverTimestamp(),
        adherenceStatus: 'Taken',
        recordedByUserId: user.id,
    };

    setDocumentNonBlocking(newAdherenceRef, adherenceRecord, {});
  };

  const getMedStatus = (medId: string): 'Taken' | 'Upcoming' | 'Missed' => {
      const record = adherence?.find(a => a.medicationId === medId);
      return record?.adherenceStatus || 'Upcoming';
  };

  const isLoading = userLoading || medsLoading || adherenceLoading;

  const morningMeds = useMemo(() => medications?.filter(m => m.frequency.toLowerCase().includes('morning') || m.frequency.toLowerCase().includes('am')), [medications]);
  const afternoonMeds = useMemo(() => medications?.filter(m => m.frequency.toLowerCase().includes('afternoon') || m.frequency.toLowerCase().includes('pm')), [medications]);
  const eveningMeds = useMemo(() => medications?.filter(m => m.frequency.toLowerCase().includes('evening') || m.frequency.toLowerCase().includes('night')), [medications]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Medication</CardTitle>
        <CardDescription>Your personal medication schedule.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : !medications || medications.length === 0 ? (
          <p className="text-muted-foreground text-center py-10">No medications scheduled for today.</p>
        ) : (
          <>
            {morningMeds && morningMeds.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Morning</h3>
                <div className="space-y-3">
                  {morningMeds.map(med => {
                      const status = getMedStatus(med.id);
                      return (
                        <div key={med.id} className="flex items-center gap-4">
                            <Pill className="h-5 w-5 text-primary" />
                            <div className='flex-1'>
                                <p className="font-medium">{med.name}</p>
                                <p className="text-xs text-muted-foreground">{med.dosage} - {med.instructions}</p>
                            </div>
                            <Button variant={status === 'Taken' ? 'ghost' : 'default'} size="sm" disabled={status === 'Taken'} onClick={() => handleTakeMedication(med)}>
                                {status === 'Taken' ? 'Taken' : 'Take'}
                            </Button>
                        </div>
                      )
                  })}
                </div>
              </div>
            )}
            
            {afternoonMeds && afternoonMeds.length > 0 && <Separator />}

            {afternoonMeds && afternoonMeds.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Afternoon</h3>
                <div className="space-y-3">
                    {afternoonMeds.map(med => {
                        const status = getMedStatus(med.id);
                        return (
                            <div key={med.id} className="flex items-center gap-4">
                                <Pill className="h-5 w-5 text-primary" />
                                <div className='flex-1'>
                                    <p className="font-medium">{med.name}</p>
                                    <p className="text-xs text-muted-foreground">{med.dosage} - {med.instructions}</p>
                                </div>
                                <Button variant={status === 'Taken' ? 'ghost' : 'default'} size="sm" disabled={status === 'Taken'} onClick={() => handleTakeMedication(med)}>
                                    {status === 'Taken' ? 'Taken' : 'Take'}
                                </Button>
                            </div>
                        )
                    })}
                </div>
              </div>
            )}

             {eveningMeds && eveningMeds.length > 0 && <Separator />}

             {eveningMeds && eveningMeds.length > 0 && (
                <div>
                    <h3 className="font-semibold mb-2">Evening</h3>
                    <div className="space-y-3">
                        {eveningMeds.map(med => {
                             const status = getMedStatus(med.id);
                            return (
                                <div key={med.id} className="flex items-center gap-4">
                                    <Pill className="h-5 w-5 text-primary" />
                                    <div className='flex-1'>
                                        <p className="font-medium">{med.name}</p>
                                        <p className="text-xs text-muted-foreground">{med.dosage} - {med.instructions}</p>
                                    </div>
                                    <Button variant={status === 'Taken' ? 'ghost' : 'default'} size="sm" disabled={status === 'Taken'} onClick={() => handleTakeMedication(med)}>
                                        {status === 'Taken' ? 'Taken' : 'Take'}
                                    </Button>
                                </div>
                            )
                        })}
                    </div>
                </div>
             )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
