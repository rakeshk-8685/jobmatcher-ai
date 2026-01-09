// ============================================
// Protected Route Component
// Handles role-based access control
// ============================================

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { UserRole } from '../types';
import LoadingSpinner from './LoadingSpinner.tsx';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
    const { user, isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return <LoadingSpinner fullScreen />;
    }

    if (!isAuthenticated || !user) {
        // Redirect to login while saving the attempted URL
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (!allowedRoles.includes(user.role)) {
        // Redirect to appropriate dashboard based on role
        const dashboardRoutes: Record<UserRole, string> = {
            user: '/user/dashboard',
            recruiter: '/recruiter/dashboard',
            admin: '/admin/dashboard',
        };
        return <Navigate to={dashboardRoutes[user.role]} replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
