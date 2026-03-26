"use client";

import { useMemo } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import type { VitalsEntry } from '@/lib/types';
import { VitalsChart } from "./vitals-chart";
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';

// Helper to process raw vitals data for the chart
const processVitalsForChart = (vitals: VitalsEntry[]) => {
  if (!vitals) return [];
  // Reverse to get chronological order and take the last 7
  return vitals
    .sort((a, b) => (a.timestamp as any).seconds - (b.timestamp as any).seconds)
    .slice(-7)
    .map(v => ({
      date: format(new Date((v.timestamp as any).seconds * 1000), 'MMM d'),
      heartRate: v.heartRate,
      // Representing blood pressure as a single value is tricky.
      // For this chart, we'll just use systolic. A real app might have a more complex chart.
      bloodPressure: v.bloodPressureSystolic, 
    }));
};

export function VitalsOverview() {
  const { user, loading: userLoading } = useUser();
  const firestore = useFirestore();

  const vitalsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(
      collection(firestore, 'user_profiles', user.id, 'vitalsEntries'),
      orderBy('timestamp', 'desc'),
      limit(30) // Fetch the last 30 entries to ensure we have enough data
    );
  }, [firestore, user]);

  const { data: rawVitals, isLoading: vitalsLoading } = useCollection<VitalsEntry>(vitalsQuery);

  const chartData = useMemo(() => processVitalsForChart(rawVitals || []), [rawVitals]);
  
  const isLoading = userLoading || vitalsLoading;

  if (isLoading) {
    return (
       <Card>
        <CardHeader>
            <CardTitle>Vital Signs Overview</CardTitle>
            <CardDescription>Last 7 days</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (!rawVitals || rawVitals.length === 0) {
     return (
       <Card>
        <CardHeader>
            <CardTitle>Vital Signs Overview</CardTitle>
            <CardDescription>Last 7 days</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-64">
            <p className="text-muted-foreground">No vital signs have been recorded yet.</p>
        </CardContent>
      </Card>
    );
  }

  return <VitalsChart data={chartData} />;
}
