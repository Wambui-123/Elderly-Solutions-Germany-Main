import { PatientList } from "@/components/dashboard/caregiver/patient-list";

export default function CaregiverHealthPage() {
  return (
    <>
      <h1 className="font-headline text-3xl font-bold mb-6">Patient Health Overview</h1>
      <p className="text-muted-foreground mb-6">Select a patient to view their detailed health records, vitals, and medication adherence.</p>
      <PatientList />
    </>
  );
}
