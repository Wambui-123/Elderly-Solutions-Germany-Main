"use client";

import { doc, setDoc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { initializeFirebase } from '.'; // Using the initialized instance
import type { User as FirebaseAuthUser } from 'firebase/auth';
import type { Role, User } from '@/lib/types';

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
        return docSnap.data();
    }

    // If the document doesn't exist, create it.
    const userProfile = {
        id: user.uid,
        name: data.name,
        email: data.email,
        role: data.role,
        avatarUrl: user.photoURL || `https://avatar.vercel.sh/${user.uid}.png`, // Default avatar
        createdAt: serverTimestamp(),
        hasCompletedOnboarding: false, // Set onboarding to false for new users
    };
    await setDoc(userDocRef, userProfile);
    return userProfile;
}

export async function getUserProfile(uid: string) {
    const userDocRef = doc(firestore, 'users', uid);
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
        return docSnap.data();
    } else {
        return null;
    }
}


export async function updateUserProfile(uid: string, data: Partial<User>) {
    const userDocRef = doc(firestore, 'users', uid);
    await updateDoc(userDocRef, {
        ...data,
        updatedAt: serverTimestamp()
    });
}