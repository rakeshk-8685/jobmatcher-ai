// ============================================
// Sidebar Component
// Dashboard navigation sidebar
// ============================================

import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    User,
    Briefcase,
    FileText,
    Users,
    PlusCircle,
    BarChart3,
    Settings,
    Shield,
    Search,
    Sparkles,
    Zap,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { UserRole } from '../types';
import './Sidebar.css';

interface NavItem {
    label: string;
    path: string;
    icon: React.ReactNode;
    badge?: number;
}

const Sidebar: React.FC = () => {
    const { user } = useAuth();

    const getNavItems = (role: UserRole): NavItem[] => {
        switch (role) {
            case 'user':
                return [
                    { label: 'Dashboard', path: '/user/dashboard', icon: <LayoutDashboard size={20} /> },
                    { label: 'My Profile', path: '/user/profile', icon: <User size={20} /> },
                    { label: 'Job Matches', path: '/user/jobs', icon: <Briefcase size={20} />, badge: 5 },
                    { label: 'Applications', path: '/user/applications', icon: <FileText size={20} />, badge: 3 },
                    { label: 'ATS Score', path: '/user/ats-score', icon: <BarChart3 size={20} /> },
                    { label: 'Settings', path: '/user/settings', icon: <Settings size={20} /> },
                ];
            case 'recruiter':
                return [
                    { label: 'Dashboard', path: '/recruiter/dashboard', icon: <LayoutDashboard size={20} /> },
                    { label: 'My Profile', path: '/recruiter/profile', icon: <User size={20} /> },
                    { label: 'Post a Job', path: '/recruiter/post-job', icon: <PlusCircle size={20} /> },
                    { label: 'AI Matching', path: '/recruiter/candidates', icon: <Sparkles size={20} />, badge: 12 },
                    { label: 'My Jobs', path: '/recruiter/jobs', icon: <Briefcase size={20} /> },
                    { label: 'Applicants', path: '/recruiter/applicants', icon: <Users size={20} />, badge: 8 },
                    { label: 'ATS Analyzer', path: '/recruiter/ats-analyzer', icon: <BarChart3 size={20} /> },
                    { label: 'Bulk Analyzer', path: '/recruiter/bulk-ats-analyzer', icon: <Zap size={20} /> },
                    { label: 'Settings', path: '/recruiter/settings', icon: <Settings size={20} /> },
                ];
            case 'admin':
                return [
                    { label: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
                    { label: 'My Profile', path: '/admin/profile', icon: <User size={20} /> },
                    { label: 'User Management', path: '/admin/users', icon: <Users size={20} /> },
                    { label: 'Job Moderation', path: '/admin/jobs', icon: <Shield size={20} />, badge: 5 },
                    { label: 'Analytics', path: '/admin/analytics', icon: <BarChart3 size={20} /> },
                    { label: 'Settings', path: '/admin/settings', icon: <Settings size={20} /> },
                ];
            default:
                return [];
        }
    };

    const navItems = user ? getNavItems(user.role) : [];

    const getRoleLabel = (role: UserRole): string => {
        switch (role) {
            case 'user': return 'Candidate';
            case 'recruiter': return 'Recruiter';
            case 'admin': return 'Administrator';
            default: return role;
        }
    };

    return (
        <aside className="sidebar">
            {/* Sidebar Header */}
            <div className="sidebar-header">
                <div className="sidebar-logo">
                    <div className="sidebar-logo-icon">
                        <Sparkles size={20} />
                    </div>
                    <div className="sidebar-logo-text">
                        <span className="sidebar-logo-name">JobMatcher</span>
                        <span className="sidebar-logo-tag">AI</span>
                    </div>
                </div>
            </div>

            {/* User Info */}
            {user && (
                <div className="sidebar-user">
                    <div className="sidebar-user-avatar">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="sidebar-user-info">
                        <p className="sidebar-user-name">{user.name}</p>
                        <p className="sidebar-user-role">{getRoleLabel(user.role)}</p>
                    </div>
                </div>
            )}

            {/* Search */}
            <div className="sidebar-search">
                <Search size={18} className="sidebar-search-icon" />
                <input
                    type="text"
                    placeholder="Search..."
                    className="sidebar-search-input"
                />
            </div>

            {/* Navigation */}
            <nav className="sidebar-nav">
                <p className="sidebar-nav-label">Menu</p>
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `sidebar-nav-item ${isActive ? 'active' : ''}`
                        }
                    >
                        <span className="sidebar-nav-icon">{item.icon}</span>
                        <span className="sidebar-nav-label-text">{item.label}</span>
                        {item.badge && (
                            <span className="sidebar-nav-badge">{item.badge}</span>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Sidebar Footer */}
            <div className="sidebar-footer">
                <NavLink to="/settings" className="sidebar-nav-item">
                    <span className="sidebar-nav-icon"><Settings size={20} /></span>
                    <span className="sidebar-nav-label-text">Settings</span>
                </NavLink>
            </div>
        </aside>
    );
};

export default Sidebar;
