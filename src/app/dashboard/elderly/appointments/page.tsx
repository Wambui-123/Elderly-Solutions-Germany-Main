import { AppointmentList } from "@/components/dashboard/appointments/appointment-list";

export default function AppointmentsPage() {
  return (
    <>
      <h1 className="font-headline text-3xl font-bold mb-6">Appointments</h1>
      <AppointmentList />
    </>
  );
}
