import { MedicationSchedule } from "@/components/dashboard/elderly/medication-schedule";
import { VitalsOverview } from "@/components/dashboard/health/vitals-overview";

export default function HealthPage() {
  return (
    <>
      <h1 className="font-headline text-3xl font-bold mb-6">Health Hub</h1>
      <div className="space-y-6">
        <VitalsOverview />
        <MedicationSchedule />
      </div>
    </>
  );
}
