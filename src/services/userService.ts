import api from './api';

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

export const userService = {
    getProfile: async () => {
        return await api.get<UserProfile>('/users/profile');
    },

    updateProfile: async (data: Partial<UserProfile> | any) => {
        return await api.put<UserProfile>('/users/profile', data);
    }
};

export default userService;
