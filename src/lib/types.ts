import { type Timestamp } from 'firebase/firestore';

export type Role = "elderly" | "caregiver" | "professional" | "admin";

export type User = {
  id: string; // Corresponds to Firebase Auth UID
  name: string;
  email: string;
  avatarUrl: string;
  role: Role;
  hasCompletedOnboarding?: boolean;
  createdAt?: Timestamp | { seconds: number; nanoseconds: number; }; // Firestore Timestamp
  updatedAt?: Timestamp | { seconds: number; nanoseconds: number; }; // Firestore Timestamp
  
  // Onboarding fields for 'elderly'
  mobilityNeeds?: string;
  healthAlerts?: string;

  // Relationship IDs
  managedPatientIds?: string[]; // For caregivers/professionals
  caregiverIds?: string[];      // For elderly
  professionalIds?: string[]; // For elderly
};


// Matches VitalsEntry schema
export type VitalsEntry = {
    id: string;
    patientId: string;
    timestamp: Timestamp | { seconds: number; nanoseconds: number; };
    bloodPressureSystolic: number;
    bloodPressureDiastolic: number;
    heartRate: number;
    temperature: number;
    oxygenSaturation: number;
    notes?: string;
    recordedByUserId: string;
};

// Matches Medication schema
export type Medication = {
    id: string;
    patientId: string;
    name: string;
    dosage: string;
    frequency: string;
    instructions: string;
    prescribedByUserId: string;
    startDate: Timestamp | { seconds: number; nanoseconds: number; };
    endDate?: Timestamp | { seconds: number; nanoseconds: number; };
};

// Matches MedicationAdherence schema
export type MedicationAdherence = {
    id: string;
    medicationId: string;
    patientId: string;
    scheduledTime: Timestamp | { seconds: number; nanoseconds: number; };
    actualTakenTime?: Timestamp | { seconds: number; nanoseconds: number; };
    adherenceStatus: 'Taken' | 'Missed' | 'Scheduled';
    notes?: string;
    recordedByUserId: string;
};

// Matches Event schema
export type Event = {
    id: string;
    title: string;
    description: string;
    startTime: Timestamp | { seconds: number; nanoseconds: number; };
    endTime: Timestamp | { seconds: number; nanoseconds: number; };
    location: string;
    organizerId: string;
    attendeeIds: string[];
    createdAt: Timestamp | { seconds: number; nanoseconds: number; };
    updatedAt?: Timestamp | { seconds: number; nanoseconds: number; };
};
