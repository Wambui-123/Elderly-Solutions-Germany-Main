"use client";

import { doc, setDoc, getDoc, serverTimestamp, updateDoc, collection, query, where, getDocs, arrayUnion, Timestamp } from 'firebase/firestore';
import { initializeFirebase } from '.'; // Using the initialized instance
import type { User as FirebaseAuthUser } from 'firebase/auth';
import type { Role, User } from '@/lib/types';
import { errorEmitter } from './error-emitter';
import { FirestorePermissionError } from './errors';

const { firestore } = initializeFirebase();

interface UserProfileData {
    name: string;
    email: string;
    role: Role;
}

// This function now safely creates a profile only if one doesn't already exist.
export async function createUserProfile(user: FirebaseAuthUser, data: UserProfileData) {
    const userDocRef = doc(firestore, 'users', user.uid);

    // Check if the document already exists to avoid overwriting on subsequent logins.
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
        // If the document exists, we can just return its data.
        // No need to write anything.
        return docSnap.data() as User;
    }

    // If the document doesn't exist, create it.
    const userProfile: User = {
        id: user.uid,
        name: data.name,
        email: data.email!,
        role: data.role,
        avatarUrl: user.photoURL || `https://avatar.vercel.sh/${user.uid}.png`, // Default avatar
        createdAt: serverTimestamp() as Timestamp,
        hasCompletedOnboarding: false, // Set onboarding to false for new users
        caregiverIds: [],
        professionalIds: [],
        managedPatientIds: [],
    };
    await setDoc(userDocRef, userProfile);
    return userProfile;
}

export async function getUserProfile(uid: string): Promise<User | null> {
    const userDocRef = doc(firestore, 'users', uid);
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
        return docSnap.data() as User;
    } else {
        return null;
    }
}

export function updateUserProfile(uid: string, data: Partial<User>) {
    const userDocRef = doc(firestore, 'users', uid);
    const dataToUpdate = {
        ...data,
        updatedAt: serverTimestamp()
    }
    
    // Non-blocking update with error handling
    updateDoc(userDocRef, dataToUpdate)
        .catch(error => {
            errorEmitter.emit(
                'permission-error',
                new FirestorePermissionError({
                    path: userDocRef.path,
                    operation: 'update',
                    requestResourceData: dataToUpdate,
                })
            );
            // Re-throw the original error to allow for local catch blocks if needed
            throw error;
        });
}

export async function findUserByEmail(email: string): Promise<User | null> {
    if (!email) return null;
    const usersRef = collection(firestore, 'users');
    // Only allow searching for elderly users for privacy and security
    const q = query(usersRef, where('email', '==', email), where('role', '==', 'elderly'));
    
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        return { id: userDoc.id, ...userDoc.data() } as User;
    }
    return null;
}

export async function linkUserToPatient(args: { caregiverOrProId: string; patientId: string; role: 'caregiver' | 'professional' }) {
    const { caregiverOrProId, patientId, role } = args;

    const patientDocRef = doc(firestore, 'users', patientId);
    const caregiverOrProDocRef = doc(firestore, 'users', caregiverOrProId);

    // Add the caregiver/pro to the patient's list
    const patientUpdate = role === 'caregiver' 
        ? { caregiverIds: arrayUnion(caregiverOrProId) }
        : { professionalIds: arrayUnion(caregiverOrProId) };
    
    await updateDoc(patientDocRef, patientUpdate);

    // Add the patient to the caregiver/pro's managed list
    const caregiverUpdate = { managedPatientIds: arrayUnion(patientId) };
    await updateDoc(caregiverOrProDocRef, caregiverUpdate);
}
