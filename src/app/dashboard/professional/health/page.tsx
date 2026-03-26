import { PatientRoster } from "@/components/dashboard/professional/patient-roster";

export default function ProfessionalHealthPage() {
  return (
    <>
      <h1 className="font-headline text-3xl font-bold mb-6">Patient Vitals & Records</h1>
      <p className="text-muted-foreground mb-6">Review patient charts, recent vitals, and health history.</p>
      <PatientRoster />
    </>
  );
}
