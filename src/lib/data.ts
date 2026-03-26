import type { User } from './types';

// Mock data is being phased out.
// This file is kept to prevent breaking imports in components that have not yet been refactored.

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
    {
        id: '5',
        name: 'Admina Strator',
        email: 'admin@example.com',
        avatarUrl: 'https://picsum.photos/seed/admin/100/100',
        role: 'admin'
    }
];

export const data = {
    users,
    patients: [],
    vitals: [],
    medications: [],
}
