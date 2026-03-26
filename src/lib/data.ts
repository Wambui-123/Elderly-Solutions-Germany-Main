import type { User, Patient, VitalSign, Medication } from './types';

const users: User[] = [
    {
        id: '1',
        name: 'Klaus Müller',
        email: 'caregiver@example.com',
        avatarUrl: 'https://picsum.photos/seed/101/100/100',
        role: 'caregiver'
    },
    {
        id: '2',
        name: 'Dr. Anna Schmidt',
        email: 'pro@example.com',
        avatarUrl: 'https://picsum.photos/seed/102/100/100',
        role: 'professional'
    },
    {
        id: '3',
        name: 'Ingrid Bauer',
        email: 'elderly@example.com',
        avatarUrl: 'https://picsum.photos/seed/103/100/100',
        role: 'elderly'
    },
     {
        id: '4',
        name: 'Lars Richter',
        email: 'lars.richter@example.com',
        avatarUrl: 'https://picsum.photos/seed/104/100/100',
        role: 'caregiver'
    },
];

const patients: Patient[] = [
    {
        id: 'p1',
        name: 'Helga Wagner',
        condition: 'Hypertension',
        status: 'Critical',
        avatarUrl: 'https://picsum.photos/seed/p1/200/200'
    },
    {
        id: 'p2',
        name: 'Günther Schulz',
        condition: 'Diabetes Type 2',
        status: 'Stable',
        avatarUrl: 'https://picsum.photos/seed/p2/200/200'
    },
    {
        id: 'p3',
        name: 'Erika Vogel',
        condition: 'Arthritis',
        status: 'Stable',
        avatarUrl: 'https://picsum.photos/seed/p3/200/200'
    },
];

const vitals: VitalSign[] = [
    { date: "Mon", heartRate: 75, bloodPressure: 120 },
    { date: "Tue", heartRate: 78, bloodPressure: 122 },
    { date: "Wed", heartRate: 80, bloodPressure: 125 },
    { date: "Thu", heartRate: 77, bloodPressure: 121 },
    { date: "Fri", heartRate: 82, bloodPressure: 128 },
    { date: "Sat", heartRate: 79, bloodPressure: 124 },
    { date: "Sun", heartRate: 85, bloodPressure: 130 },
];

const medications: Medication[] = [
    { id: 'm1', name: 'Lisinopril', dosage: '10mg', time: '8:00 AM', status: 'Taken' },
    { id: 'm2', name: 'Metformin', dosage: '500mg', time: '9:00 AM', status: 'Upcoming' },
    { id: 'm3', name: 'Aspirin', dosage: '81mg', time: '9:00 AM', status: 'Upcoming' },
    { id: 'm4', name: 'Simvastatin', dosage: '20mg', time: '8:00 PM', status: 'Upcoming' },
];

export const data = {
    users,
    patients,
    vitals,
    medications,
}
