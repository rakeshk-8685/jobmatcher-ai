// ============================================
// Authentication Context with Firebase
// Manages user authentication state and role-based access
// ============================================

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { User, UserRole, AuthState, LoginCredentials, RegisterData } from '../types';
import { mockUsers } from '../data/mockData';
import {
    signInWithGoogle,
    signUpWithEmail,
    firebaseSignOut,
    onAuthChange,
    type FirebaseUser
} from '../config/firebase';

interface AuthContextType extends AuthState {
    login: (credentials: LoginCredentials) => Promise<boolean>;
    loginWithGoogle: () => Promise<User | null>;
    register: (data: RegisterData) => Promise<boolean>;
    logout: () => void;
    switchRole: (role: UserRole) => void; // Demo feature
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'jobmatcher_auth';

// Helper to convert Firebase user to app user
const firebaseUserToAppUser = (firebaseUser: FirebaseUser, role: UserRole = 'user'): User => {
    return {
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
        role: role,
        avatar: firebaseUser.photoURL || undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, setState] = useState<AuthState>({
        user: null,
        isAuthenticated: false,
        isLoading: true,
    });

    // Initialize auth from storage and Firebase
    useEffect(() => {
        // First check local storage for persisted user
        const stored = localStorage.getItem(AUTH_STORAGE_KEY);
        if (stored) {
            try {
                const userData = JSON.parse(stored) as User;
                setState({
                    user: userData,
                    isAuthenticated: true,
                    isLoading: false,
                });
            } catch {
                localStorage.removeItem(AUTH_STORAGE_KEY);
                setState(prev => ({ ...prev, isLoading: false }));
            }
        } else {
            setState(prev => ({ ...prev, isLoading: false }));
        }

        // Also listen for Firebase auth changes
        const unsubscribe = onAuthChange((firebaseUser) => {
            if (firebaseUser) {
                // Check if we have stored role preference
                const storedData = localStorage.getItem(AUTH_STORAGE_KEY);
                let role: UserRole = 'user';
                if (storedData) {
                    try {
                        const parsed = JSON.parse(storedData);
                        role = parsed.role || 'user';
                    } catch {
                        // ignore
                    }
                }
                const user = firebaseUserToAppUser(firebaseUser, role);
                localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
                setState({
                    user,
                    isAuthenticated: true,
                    isLoading: false,
                });
            }
        });

        return () => unsubscribe();
    }, []);

    // Email/Password login
    const login = useCallback(async (credentials: LoginCredentials): Promise<boolean> => {
        setState(prev => ({ ...prev, isLoading: true }));

        try {
            // Call backend API
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: credentials.email,
                    password: credentials.password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            // Backend returns: { success: true, data: { user, accessToken, refreshToken } }
            const { user: backendUser, accessToken } = data.data;

            // Merge backend user with app user structure if needed, or just use backend user
            // We MUST store the accessToken so api.ts can find it
            const appUser = {
                ...backendUser,
                token: accessToken // Store token with user object for api.ts to find
            };

            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(appUser));
            setState({
                user: appUser,
                isAuthenticated: true,
                isLoading: false,
            });
            return true;

        } catch (error) {
            console.error('Login failed:', error);

            // Fallback: Check if credentials match any mock user (for demo purposes when backend is down)
            const mockUser = mockUsers.find(
                u => u.email === credentials.email &&
                    u.password === credentials.password // Note: In real app, never compare plain text passwords like this
            );

            if (mockUser) {
                console.log('Backend unavailable. Logging in with mock data.');

                // Mimic backend response structure
                const appUser = {
                    ...mockUser,
                    token: 'mock-jwt-token-' + Date.now()
                };

                localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(appUser));
                setState({
                    user: appUser,
                    isAuthenticated: true,
                    isLoading: false,
                });
                return true;
            }

            setState(prev => ({ ...prev, isLoading: false }));
            return false;
        }
    }, []);

    // Google Sign In
    const loginWithGoogle = useCallback(async (): Promise<User | null> => {
        setState(prev => ({ ...prev, isLoading: true }));

        try {
            const firebaseUser = await signInWithGoogle();
            const user = firebaseUserToAppUser(firebaseUser, 'user'); // Default to 'user' role

            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
            setState({
                user,
                isAuthenticated: true,
                isLoading: false,
            });
            return user;
        } catch (error) {
            console.error('Google sign in failed:', error);
            setState(prev => ({ ...prev, isLoading: false }));
            return null;
        }
    }, []);

    // Register with Firebase
    const register = useCallback(async (data: RegisterData): Promise<boolean> => {
        setState(prev => ({ ...prev, isLoading: true }));

        try {
            const firebaseUser = await signUpWithEmail(data.email, data.password, data.name);
            const user = firebaseUserToAppUser(firebaseUser, data.role);

            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
            setState({
                user,
                isAuthenticated: true,
                isLoading: false,
            });
            return true;
        } catch (error) {
            console.error('Registration failed:', error);
            setState(prev => ({ ...prev, isLoading: false }));
            return false;
        }
    }, []);

    // Logout
    const logout = useCallback(async () => {
        try {
            await firebaseSignOut();
        } catch (error) {
            console.error('Firebase signout error:', error);
        }
        localStorage.removeItem(AUTH_STORAGE_KEY);
        setState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
        });
    }, []);

    // Demo feature: Quick role switching
    const switchRole = useCallback((role: UserRole) => {
        const mockUser = mockUsers.find(u => u.role === role);
        if (mockUser) {
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(mockUser));
            setState({
                user: mockUser,
                isAuthenticated: true,
                isLoading: false,
            });
        }
    }, []);

    const value: AuthContextType = {
        ...state,
        login,
        loginWithGoogle,
        register,
        logout,
        switchRole,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;
