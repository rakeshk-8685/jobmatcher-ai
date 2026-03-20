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
    if (auth.currentUser) return auth.currentUser;

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
            resolve(auth.currentUser); // Return whatever we have (likely null)
        }, 2000);
    });
};

export const userService = {
    getProfile: async () => {
        const user = await ensureAuthenticated();
        console.log('userService.getProfile - Current Firebase User:', user?.uid);

        if (!user) {
            console.error('userService.getProfile - No authenticated user found in firebase.auth()');
            throw new Error('User not authenticated');
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
        console.log('userService.updateProfile - Current Firebase User:', user?.uid);

        if (!user) throw new Error('User not authenticated');

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
