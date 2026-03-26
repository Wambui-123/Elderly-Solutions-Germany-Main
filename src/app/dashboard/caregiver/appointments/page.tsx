import { AppointmentList } from "@/components/dashboard/appointments/appointment-list";

export default function CaregiverAppointmentsPage() {
  return (
    <>
      <h1 className="font-headline text-3xl font-bold mb-6">Patient Appointments</h1>
      <p className="text-muted-foreground mb-6">This page will show appointments for the patients you manage.</p>
      {/* For now, it shows the caregiver's own appointments. This can be adapted later. */}
      <AppointmentList />
    </>
  );
}
