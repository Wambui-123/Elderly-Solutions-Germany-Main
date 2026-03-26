"use client";

import { useEffect, useState } from 'react';
import { onAuthStateChanged, type User as FirebaseAuthUser } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';

import { useAuth, useFirestore } from '@/firebase/provider';
import type { User } from '@/lib/types';

interface AuthState {
  user: User | null;
  firebaseUser: FirebaseAuthUser | null;
  loading: boolean;
  error: Error | null;
}

export function useUser() {
  const auth = useAuth();
  const firestore = useFirestore();
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    firebaseUser: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!auth || !firestore) {
      // Firebase might not be initialized yet
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setAuthState((prevState) => ({ ...prevState, firebaseUser, loading: true }));
        const userDocRef = doc(firestore, 'users', firebaseUser.uid);
        
        const unsubDoc = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            const userData = docSnap.data() as User;
            setAuthState({ user: userData, firebaseUser, loading: false, error: null });
          } else {
             // If the user doc doesn't exist, maybe it's still being created.
             // Or, it's a login with a provider (like Google) for the first time.
             // We'll set loading to false but user will be null until the doc is created.
            setAuthState({ user: null, firebaseUser, loading: false, error: null });
          }
        }, (error) => {
          console.error("Error fetching user document:", error);
          setAuthState({ user: null, firebaseUser, loading: false, error });
        });
        
        return () => unsubDoc();

      } else {
        setAuthState({ user: null, firebaseUser: null, loading: false, error: null });
      }
    }, (error) => {
        console.error("Auth state error:", error);
        setAuthState({ user: null, firebaseUser: null, loading: false, error });
    });

    return () => unsubscribe();
  }, [auth, firestore]);

  return authState;
}
