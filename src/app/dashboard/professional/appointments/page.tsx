import { AppointmentList } from "@/components/dashboard/appointments/appointment-list";

export default function ProfessionalAppointmentsPage() {
  return (
    <>
      <h1 className="font-headline text-3xl font-bold mb-6">Your Appointments</h1>
      <p className="text-muted-foreground mb-6">Manage your schedule and patient consultations.</p>
      <AppointmentList />
    </>
  );
}
