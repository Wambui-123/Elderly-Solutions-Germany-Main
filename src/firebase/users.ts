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

/**
 * Creates the user document for a brand new user signing up with email/password.
 * This function only writes, it does not read, to avoid race conditions with security rules.
 */
export async function handleUserRegistration(user: FirebaseAuthUser, data: UserProfileData) {
    const userDocRef = doc(firestore, 'user_profiles', user.uid);

    const userProfile: User = {
        id: user.uid,
        name: data.name,
        email: data.email!,
        role: data.role,
        avatarUrl: user.photoURL || "",
        createdAt: serverTimestamp() as Timestamp,
        hasCompletedOnboarding: false,
        caregiverIds: [],
        professionalIds: [],
        managedPatientIds: [],
    };
    // setDoc will create the document because it doesn't exist.
    await setDoc(userDocRef, userProfile);
    return userProfile;
}

/**
 * Creates or updates a user profile during a Google Sign-In event.
 * It reads the document first to check if the user is new, and then either
 * creates the full profile or updates the existing one.
 */
export async function handleGoogleSignIn(user: FirebaseAuthUser) {
    const userDocRef = doc(firestore, 'user_profiles', user.uid);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
        // If user exists, update their name and photo, but leave role and other data intact.
        const updateData: Partial<User> = {
            name: user.displayName || docSnap.data().name,
            avatarUrl: user.photoURL || docSnap.data().avatarUrl,
            updatedAt: serverTimestamp() as Timestamp
        };
        await updateDoc(userDocRef, updateData);
    } else {
        // If user does not exist, create a new profile with a default role.
        const userProfile: User = {
            id: user.uid,
            name: user.displayName || 'Google User',
            email: user.email!,
            role: 'caregiver', // Default role for new Google sign-ups
            avatarUrl: user.photoURL || "",
            createdAt: serverTimestamp() as Timestamp,
            hasCompletedOnboarding: false,
            caregiverIds: [],
            professionalIds: [],
            managedPatientIds: [],
        };
        await setDoc(userDocRef, userProfile);
    }
}


export async function getUserProfile(uid: string): Promise<User | null> {
    const userDocRef = doc(firestore, 'user_profiles', uid);
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
        return docSnap.data() as User;
    } else {
        return null;
    }
}

export function updateUserProfile(uid: string, data: Partial<User>) {
    const userDocRef = doc(firestore, 'user_profiles', uid);
    const dataToUpdate = {
        ...data,
        updatedAt: serverTimestamp()
    }
    
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
            throw error;
        });
}

export async function findUserByEmail(email: string): Promise<User | null> {
    if (!email) return null;
    const usersRef = collection(firestore, 'user_profiles');
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

    const patientDocRef = doc(firestore, 'user_profiles', patientId);
    const caregiverOrProDocRef = doc(firestore, 'user_profiles', caregiverOrProId);

    const patientDocSnap = await getDoc(patientDocRef);
    if (!patientDocSnap.exists()) {
        throw new Error("Patient document not found.");
    }
    const patientData = patientDocSnap.data() as User;

    if (role === 'caregiver') {
        const updatedCaregiverIds = Array.from(new Set([...(patientData.caregiverIds || []), caregiverOrProId]));
        await updateDoc(patientDocRef, { caregiverIds: updatedCaregiverIds, updatedAt: serverTimestamp() });
    } else { 
        const updatedProfessionalIds = Array.from(new Set([...(patientData.professionalIds || []), caregiverOrProId]));
        await updateDoc(patientDocRef, { professionalIds: updatedProfessionalIds, updatedAt: serverTimestamp() });
    }

    await updateDoc(caregiverOrProDocRef, { 
        managedPatientIds: arrayUnion(patientId),
        updatedAt: serverTimestamp() 
    });
}
