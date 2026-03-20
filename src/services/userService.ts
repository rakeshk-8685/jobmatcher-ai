import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, onAuthChange } from '../config/firebase';

export interface UserProfile {
    name: string;
    email: string;
    avatar?: string;
    company?: {
        name: string;
        website: string;
        description: string;
        // other recruiter fields
    };
    profile?: {
        title?: string;
        bio?: string;
        phone?: string;
        location?: string;
        linkedIn?: string;
        github?: string;
        portfolio?: string;
        skills?: any[];
        experience?: any[];
        education?: any[];
    };
    role: 'user' | 'recruiter' | 'admin';
}

// Helper to wait for auth to be ready
const ensureAuthenticated = async () => {
    // 1. Check Firebase Auth first
    if (auth.currentUser) return auth.currentUser;

    // 2. Check Local Storage for Mock User (Demo Mode)
    const storedAuth = localStorage.getItem('jobmatcher_auth');
    if (storedAuth) {
        try {
            const parsed = JSON.parse(storedAuth);
            // If it's a mock user (usually they have IDs like USR-...) AND no firebase user is expected
            // We return this object. We need to distinguish it.
            if (parsed && parsed.id) {
                console.log('userService - Found persisted user in localStorage');
                // We add a flag to know it's a mock user
                return { ...parsed, isMock: true, uid: parsed.id };
            }
        } catch (e) {
            console.error('Error parsing stored auth', e);
        }
    }

    console.log('userService - Waiting for Firebase Auth...');
    return new Promise<any>((resolve) => {
        const unsubscribe = onAuthChange((user) => {
            if (user) {
                console.log('userService - Firebase Auth Resolved:', user.uid);
                unsubscribe();
                resolve(user);
            }
        });

        // Timeout after 2 seconds to avoid confusing hang
        setTimeout(() => {
            unsubscribe();
            console.log('userService - Firebase Auth Timeout');
            // Final check for local storage
            const finalStored = localStorage.getItem('jobmatcher_auth');
            if (finalStored) {
                try {
                    const parsed = JSON.parse(finalStored);
                    if (parsed) resolve({ ...parsed, isMock: true, uid: parsed.id });
                    return;
                } catch { }
            }
            resolve(auth.currentUser); // Return whatever we have (likely null)
        }, 2000);
    });
};

export const userService = {
    getProfile: async () => {
        const user = await ensureAuthenticated();
        console.log('userService.getProfile - Current User:', user?.uid, 'Is Mock:', user?.isMock);

        if (!user) {
            console.error('userService.getProfile - No authenticated user found');
            throw new Error('User not authenticated');
        }

        // Handle Mock User (Demo Mode)
        if (user.isMock) {
            console.log('userService.getProfile - Returning Mock Data');
            // Return data from the local user object or reasonable defaults
            // We can assume the persisted user object has the key fields
            return {
                data: {
                    name: user.name || 'Demo User',
                    email: user.email || 'demo@example.com',
                    role: user.role || 'user',
                    profile: {
                        // Populate with some defaults if missing, or use what's in 'user' if we stored it there
                        title: 'Demo Title',
                        bio: 'This is a demo account. Profile changes will not be saved to the database.',
                    }
                } as UserProfile
            };
        }

        const userDocRef = doc(db, 'users', user.uid);
        try {
            const userDoc = await getDoc(userDocRef);
            console.log('userService.getProfile - Firestore Doc Exists:', userDoc.exists());

            if (userDoc.exists()) {
                const data = userDoc.data() as UserProfile;
                console.log('userService.getProfile - Data:', data);
                return { data };
            } else {
                console.log('userService.getProfile - Creating default profile from auth user');
                return {
                    data: {
                        name: user.displayName || '',
                        email: user.email || '',
                        role: 'user',
                        profile: {}
                    } as UserProfile
                };
            }
        } catch (error) {
            console.error('userService.getProfile - Firestore Error:', error);
            throw error;
        }
    },

    updateProfile: async (data: Partial<UserProfile> | any) => {
        const user = await ensureAuthenticated();
        console.log('userService.updateProfile - Current User:', user?.uid, 'Is Mock:', user?.isMock);

        if (!user) throw new Error('User not authenticated');

        // Handle Mock User
        if (user.isMock) {
            console.log('userService.updateProfile - Updating Mock Data (Local Only)');
            // For demo users, we can just update the local storage to simulate "saving"
            const storedAuth = localStorage.getItem('jobmatcher_auth');
            if (storedAuth) {
                const parsed = JSON.parse(storedAuth);
                const updatedUser = {
                    ...parsed,
                    name: data.name || parsed.name,
                    // Store other profile fields if we wanted to be fancy, but simple name update is enough for demo feedback
                };
                localStorage.setItem('jobmatcher_auth', JSON.stringify(updatedUser));
            }
            return { data };
        }

        const userDocRef = doc(db, 'users', user.uid);

        // We need to handle nested updates carefully or just merge provided data
        // For simplicity in this demo, we'll set with merge: true which updates fields
        // But first we need to make sure the structure matches what we want to save

        // The data coming from ProfilePage is flat: { name, headline, summary, ... }
        // We need to restructure it to match UserProfile interface for Firestore

        const updates: any = {};

        if (data.name) updates.name = data.name;

        // Construct nested profile object
        updates.profile = {};
        if (data.headline !== undefined) updates.profile.title = data.headline;
        if (data.summary !== undefined) updates.profile.bio = data.summary;
        if (data.phone !== undefined) updates.profile.phone = data.phone;
        if (data.location !== undefined) updates.profile.location = data.location;
        if (data.linkedIn !== undefined) updates.profile.linkedIn = data.linkedIn;
        if (data.github !== undefined) updates.profile.github = data.github;
        if (data.portfolio !== undefined) updates.profile.portfolio = data.portfolio;

        // Use setDoc with merge: true to create if not exists or update fields
        await setDoc(userDocRef, updates, { merge: true });

        return { data: updates };
    }
};

export default userService;
