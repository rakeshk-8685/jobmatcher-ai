// ============================================
// Firebase Configuration
// Initialize Firebase for authentication
// ============================================

import { initializeApp } from 'firebase/app';
import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile,
    type User as FirebaseUser
} from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBfhiJ73kUcpFoYR6bWZ5N2XuKFNULddRE",
    authDomain: "job-matcher-ai-react.firebaseapp.com",
    projectId: "job-matcher-ai-react",
    storageBucket: "job-matcher-ai-react.firebasestorage.app",
    messagingSenderId: "484621937904",
    appId: "1:484621937904:web:cb998b5d509f41d959e635",
    measurementId: "G-6BX22LLC8C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Google Sign In
export const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        return result.user;
    } catch (error) {
        console.error('Google sign in error:', error);
        throw error;
    }
};

// Email/Password Sign In
export const signInWithEmail = async (email: string, password: string) => {
    try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        return result.user;
    } catch (error) {
        console.error('Email sign in error:', error);
        throw error;
    }
};

// Email/Password Sign Up
export const signUpWithEmail = async (email: string, password: string, displayName: string) => {
    try {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        // Update the user's display name
        await updateProfile(result.user, { displayName });
        return result.user;
    } catch (error) {
        console.error('Email sign up error:', error);
        throw error;
    }
};

// Sign Out
export const firebaseSignOut = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error('Sign out error:', error);
        throw error;
    }
};

// Auth state observer
export const onAuthChange = (callback: (user: FirebaseUser | null) => void) => {
    return onAuthStateChanged(auth, callback);
};

export { auth, type FirebaseUser };
export default app;
