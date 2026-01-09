// ============================================
// Navbar Component
// Responsive navigation with role-based menu
// ============================================

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
    Menu,
    X,
    User,
    LogOut,
    Settings,
    Bell,
    ChevronDown,
    Briefcase,
    Users,
    LayoutDashboard,
    Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import './Navbar.css';

const Navbar: React.FC = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
        setProfileMenuOpen(false);
    };

    const getDashboardLink = () => {
        if (!user) return '/login';
        switch (user.role) {
            case 'admin': return '/admin/dashboard';
            case 'recruiter': return '/recruiter/dashboard';
            default: return '/user/dashboard';
        }
    };

    const isActive = (path: string) => location.pathname === path;

    return (
        <nav className="navbar">
            <div className="navbar-container">
                {/* Logo */}
                <Link to="/" className="navbar-logo">
                    <div className="logo-icon">
                        <Sparkles size={24} />
                    </div>
                    <span className="logo-text">JobMatcher</span>
                    <span className="logo-ai">AI</span>
                </Link>

                {/* Desktop Navigation */}
                <div className="navbar-links hide-mobile">
                    <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
                        Home
                    </Link>
                    <Link to="/jobs" className={`nav-link ${isActive('/jobs') ? 'active' : ''}`}>
                        Jobs
                    </Link>
                    <Link to="/about" className={`nav-link ${isActive('/about') ? 'active' : ''}`}>
                        About
                    </Link>
                </div>

                {/* Right Side Actions */}
                <div className="navbar-actions">
                    {/* Theme Toggle */}
                    <div className="hide-mobile">
                        <ThemeToggle />
                    </div>

                    {isAuthenticated && user ? (
                        <>
                            {/* Notifications */}
                            <button className="nav-icon-btn">
                                <Bell size={20} />
                                <span className="notification-badge">3</span>
                            </button>

                            {/* Profile Dropdown */}
                            <div className="profile-dropdown">
                                <button
                                    className="profile-trigger"
                                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                                >
                                    <div className="profile-avatar">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="profile-name hide-mobile">{user.name}</span>
                                    <ChevronDown size={16} className={profileMenuOpen ? 'rotated' : ''} />
                                </button>

                                {profileMenuOpen && (
                                    <div className="profile-menu">
                                        <div className="profile-menu-header">
                                            <div className="profile-avatar lg">
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="profile-info">
                                                <p className="profile-info-name">{user.name}</p>
                                                <p className="profile-info-role">{user.role}</p>
                                            </div>
                                        </div>
                                        <div className="profile-menu-divider" />
                                        <Link
                                            to={getDashboardLink()}
                                            className="profile-menu-item"
                                            onClick={() => setProfileMenuOpen(false)}
                                        >
                                            <LayoutDashboard size={18} />
                                            Dashboard
                                        </Link>
                                        <Link
                                            to={`/${user.role}/profile`}
                                            className="profile-menu-item"
                                            onClick={() => setProfileMenuOpen(false)}
                                        >
                                            <User size={18} />
                                            Profile
                                        </Link>
                                        <Link
                                            to="/settings"
                                            className="profile-menu-item"
                                            onClick={() => setProfileMenuOpen(false)}
                                        >
                                            <Settings size={18} />
                                            Settings
                                        </Link>
                                        <div className="profile-menu-divider" />
                                        <button className="profile-menu-item logout" onClick={handleLogout}>
                                            <LogOut size={18} />
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="auth-buttons hide-mobile">
                            <Link to="/login" className="btn btn-ghost">
                                Sign In
                            </Link>
                            <Link to="/register" className="btn btn-primary">
                                Get Started
                            </Link>
                        </div>
                    )}

                    {/* Mobile Menu Toggle */}
                    <button
                        className="mobile-menu-btn"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="mobile-menu">
                    <Link to="/" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                        Home
                    </Link>
                    <Link to="/jobs" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                        <Briefcase size={20} />
                        Jobs
                    </Link>
                    <Link to="/about" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                        <Users size={20} />
                        About
                    </Link>
                    {!isAuthenticated && (
                        <>
                            <div className="mobile-menu-divider" />
                            <Link to="/login" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                                Sign In
                            </Link>
                            <Link to="/register" className="btn btn-primary w-full" onClick={() => setMobileMenuOpen(false)}>
                                Get Started
                            </Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
