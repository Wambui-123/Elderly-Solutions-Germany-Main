import { PlusCircle } from "lucide-react";
import type { Medication } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface MedicationTrackerProps {
  medications: Medication[];
}

const statusVariant: { [key in Medication['status']]: "default" | "secondary" | "destructive" } = {
    'Taken': 'default',
    'Upcoming': 'secondary',
    'Missed': 'destructive'
}

export function MedicationTracker({ medications }: MedicationTrackerProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
            <CardTitle>Medication Adherence</CardTitle>
            <CardDescription>Today's medication schedule</CardDescription>
        </div>
        <Button size="sm">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Medication
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Medication</TableHead>
              <TableHead>Dosage</TableHead>
              <TableHead>Time</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {medications.map((med) => (
              <TableRow key={med.id}>
                <TableCell className="font-medium">{med.name}</TableCell>
                <TableCell>{med.dosage}</TableCell>
                <TableCell>{med.time}</TableCell>
                <TableCell className="text-right">
                  <Badge variant={statusVariant[med.status]}>{med.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
