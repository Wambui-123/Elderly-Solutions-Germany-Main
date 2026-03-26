import { VitalsChart } from "@/components/dashboard/health/vitals-chart";
import { MedicationTracker } from "@/components/dashboard/health/medication-tracker";
import { data } from "@/lib/data";

export default function HealthPage() {
  return (
    <>
      <h1 className="font-headline text-3xl font-bold mb-6">Health Tracking</h1>
      <div className="space-y-6">
        <VitalsChart data={data.vitals} />
        <MedicationTracker medications={data.medications} />
      </div>
    </>
  );
}
