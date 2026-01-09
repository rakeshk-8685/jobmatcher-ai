// ============================================
// Authentication Context
// Manages user authentication state and role-based access
// ============================================

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { User, UserRole, AuthState, LoginCredentials, RegisterData } from '../types';
import { mockUsers } from '../data/mockData';

interface AuthContextType extends AuthState {
    login: (credentials: LoginCredentials) => Promise<boolean>;
    register: (data: RegisterData) => Promise<boolean>;
    logout: () => void;
    switchRole: (role: UserRole) => void; // Demo feature
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'jobmatcher_auth';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, setState] = useState<AuthState>({
        user: null,
        isAuthenticated: false,
        isLoading: true,
    });

    // Initialize auth from storage
    useEffect(() => {
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
    }, []);

    const login = useCallback(async (credentials: LoginCredentials): Promise<boolean> => {
        setState(prev => ({ ...prev, isLoading: true }));

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));

        // STRICT VALIDATION: Must match email, password, AND role exactly
        const mockUser = mockUsers.find(u =>
            u.email.toLowerCase() === credentials.email.toLowerCase() &&
            u.password === credentials.password &&
            u.role === credentials.role
        );

        if (mockUser) {
            // Create user object without password for storage
            const { password: _, ...userWithoutPassword } = mockUser;
            const user: User = userWithoutPassword;

            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
            setState({
                user,
                isAuthenticated: true,
                isLoading: false,
            });
            return true;
        }

        setState(prev => ({ ...prev, isLoading: false }));
        return false;
    }, []);

    const register = useCallback(async (data: RegisterData): Promise<boolean> => {
        setState(prev => ({ ...prev, isLoading: true }));

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        const newUser: User = {
            id: `user-${Date.now()}`,
            email: data.email,
            name: data.name,
            role: data.role,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
        setState({
            user: newUser,
            isAuthenticated: true,
            isLoading: false,
        });

        return true;
    }, []);

    const logout = useCallback(() => {
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
