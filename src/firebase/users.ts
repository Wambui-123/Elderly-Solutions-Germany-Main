"use client";

import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { firestore } from '.'; // Using the initialized instance
import type { User as FirebaseAuthUser } from 'firebase/auth';
import type { Role } from '@/lib/types';

interface UserProfileData {
    name: string;
    email: string;
    role: Role;
}

export async function createUserProfile(user: FirebaseAuthUser, data: UserProfileData) {
    const userDocRef = doc(firestore, 'users', user.uid);
    const userProfile = {
        uid: user.uid,
        name: data.name,
        email: data.email,
        role: data.role,
        avatarUrl: user.photoURL || `https://avatar.vercel.sh/${user.uid}.png`, // Default avatar
        createdAt: serverTimestamp(),
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
