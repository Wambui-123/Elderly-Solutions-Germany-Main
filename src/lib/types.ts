export type Role = "elderly" | "caregiver" | "professional" | "admin";

export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: Role;
};

export type Patient = {
  id: string;
  name: string;
  condition: string;
  status: 'Stable' | 'Critical';
  avatarUrl: string;
}

export type VitalSign = {
  date: string;
  heartRate: number;
  bloodPressure: number;
};

export type Medication = {
    id: string;
    name: string;
    dosage: string;
    time: string;
    status: 'Taken' | 'Upcoming' | 'Missed';
}
