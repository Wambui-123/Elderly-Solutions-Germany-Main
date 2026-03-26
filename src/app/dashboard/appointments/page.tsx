import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AppointmentsPage() {
  return (
    <>
      <h1 className="font-headline text-3xl font-bold mb-6">Appointments</h1>
      <Card>
        <CardHeader>
          <CardTitle>Upcoming & Past Appointments</CardTitle>
          <CardDescription>View and manage your appointments.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Appointments page content will go here.</p>
        </CardContent>
      </Card>
    </>
  );
}
