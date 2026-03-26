export type Role = "elderly" | "caregiver" | "professional" | "admin";

export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: Role;
  hasCompletedOnboarding?: boolean;
  createdAt?: any; 
  updatedAt?: any;
  // Onboarding fields
  mobilityNeeds?: string;
  healthAlerts?: string;
  // Relationship IDs
  managedPatientIds?: string[];
  caregiverIds?: string[];
  professionalIds?: string[];
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
