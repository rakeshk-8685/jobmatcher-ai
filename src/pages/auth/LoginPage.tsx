// ============================================
// Login Page
// Multi-role authentication form
// ============================================

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Sparkles,
    Mail,
    Lock,
    ArrowRight,
    User,
    Briefcase,
    Shield,
    Eye,
    EyeOff,
} from 'lucide-react';

// Google Icon SVG
const GoogleIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
);
import { useAuth } from '../../context/AuthContext';
import { demoCredentials } from '../../data/mockData';
import type { UserRole } from '../../types';
import './AuthPages.css';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { login, loginWithGoogle, switchRole, isLoading } = useAuth(); // Added switchRole

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [selectedRole, setSelectedRole] = useState<UserRole>('user');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);

    function getDashboardPath(role: UserRole): string {
        switch (role) {
            case 'admin': return '/admin/dashboard';
            case 'recruiter': return '/recruiter/dashboard';
            default: return '/user/dashboard';
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!formData.email || !formData.password) {
            setError('Please enter both email and password.');
            return;
        }

        const success = await login({
            email: formData.email,
            password: formData.password,
            role: selectedRole,
        });

        if (success) {
            navigate(getDashboardPath(selectedRole), { replace: true });
        } else {
            setError('Invalid credentials. Make sure email, password, and role are correct.');
        }
    };

    const handleDemoLogin = async (role: UserRole) => {
        setSelectedRole(role);
        const creds = demoCredentials[role];

        // Pre-fill the form with demo credentials
        setFormData({ email: creds.email, password: creds.password });

        // Use switchRole for immediate demo access (bypasses backend)
        switchRole(role);
        navigate(getDashboardPath(role), { replace: true });
    };

    const handleGoogleLogin = async () => {
        setError('');
        setIsGoogleLoading(true);

        try {
            const user = await loginWithGoogle();
            if (user) {
                navigate(getDashboardPath(user.role), { replace: true });
            } else {
                setError('Google sign-in failed. Please try again.');
            }
        } catch (err) {
            console.error('Google login error:', err);
            setError('Google sign-in failed. Please try again.');
        } finally {
            setIsGoogleLoading(false);
        }
    };

    const roles: { value: UserRole; label: string; icon: React.ReactNode; description: string }[] = [
        { value: 'user', label: 'Candidate', icon: <User size={20} />, description: 'Looking for jobs' },
        { value: 'recruiter', label: 'Recruiter', icon: <Briefcase size={20} />, description: 'Hiring talent' },
        { value: 'admin', label: 'Admin', icon: <Shield size={20} />, description: 'Manage platform' },
    ];

    return (
        <div className="auth-page">
            <div className="auth-bg">
                <div className="auth-glow auth-glow-1"></div>
                <div className="auth-glow auth-glow-2"></div>
            </div>

            <div className="auth-container">
                {/* Left Side - Branding with Animated Image */}
                <div className="auth-branding">
                    <Link to="/" className="auth-logo">
                        <div className="logo-icon">
                            <Sparkles size={28} />
                        </div>
                        <span className="logo-text">JobMatcher</span>
                        <span className="logo-ai">AI</span>
                    </Link>

                    {/* Animated Illustration */}
                    <div className="auth-illustration">
                        <img
                            src="/auth-illustration.png"
                            alt="Job Matching Illustration"
                            className="auth-hero-image"
                        />
                        {/* Floating Elements */}
                        <div className="floating-element floating-1"></div>
                        <div className="floating-element floating-2"></div>
                        <div className="floating-element floating-3"></div>
                    </div>

                    <div className="auth-branding-content">
                        <h1>Welcome Back</h1>
                        <p>Sign in to access your personalized dashboard and continue your journey.</p>

                        <div className="auth-features">
                            <div className="auth-feature">
                                <div className="auth-feature-icon">
                                    <User size={20} />
                                </div>
                                <div>
                                    <h4>Smart Job Matching</h4>
                                    <p>AI-powered recommendations tailored to your profile</p>
                                </div>
                            </div>
                            <div className="auth-feature">
                                <div className="auth-feature-icon">
                                    <Briefcase size={20} />
                                </div>
                                <div>
                                    <h4>ATS Score Analysis</h4>
                                    <p>Optimize your resume for maximum visibility</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="auth-form-container">
                    <div className="auth-form-wrapper">
                        <div className="auth-form-header">
                            <h2>Sign In</h2>
                            <p>Choose your role and enter your credentials</p>
                        </div>

                        {/* Role Selection */}
                        <div className="role-selector">
                            {roles.map((role) => (
                                <button
                                    key={role.value}
                                    type="button"
                                    className={`role-option ${selectedRole === role.value ? 'active' : ''}`}
                                    onClick={() => setSelectedRole(role.value)}
                                >
                                    <div className="role-icon">{role.icon}</div>
                                    <span className="role-label">{role.label}</span>
                                </button>
                            ))}
                        </div>

                        {error && (
                            <div className="auth-error">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="auth-form">
                            <div className="input-group">
                                <label className="input-label">Email Address</label>
                                <div className="input-with-icon">
                                    <Mail size={18} className="input-icon" />
                                    <input
                                        type="email"
                                        className="input"
                                        placeholder="Enter your email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="input-group">
                                <label className="input-label">Password</label>
                                <div className="input-with-icon">
                                    <Lock size={18} className="input-icon" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        className="input"
                                        placeholder="Enter your password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="input-toggle"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <div className="auth-options">
                                <label className="checkbox-label">
                                    <input type="checkbox" />
                                    <span>Remember me</span>
                                </label>
                                <Link to="/forgot-password" className="auth-link">
                                    Forgot password?
                                </Link>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary btn-lg w-full"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Signing in...' : 'Sign In'}
                                <ArrowRight size={20} />
                            </button>
                        </form>

                        <div className="auth-divider">
                            <span>or continue with</span>
                        </div>

                        <button
                            type="button"
                            className="btn btn-google w-full"
                            onClick={handleGoogleLogin}
                            disabled={isLoading || isGoogleLoading}
                        >
                            <GoogleIcon />
                            {isGoogleLoading ? 'Signing in...' : 'Sign in with Google'}
                        </button>

                        <div className="auth-divider">
                            <span>or try demo access</span>
                        </div>

                        <div className="demo-credentials">
                            <div className="demo-credentials-info">
                                <strong>Demo Accounts:</strong>
                                <span>candidate@demo.com / candidate123</span>
                                <span>recruiter@demo.com / recruiter123</span>
                                <span>admin@demo.com / admin123</span>
                            </div>
                        </div>

                        <div className="demo-buttons">
                            {roles.map((role) => (
                                <button
                                    key={role.value}
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => handleDemoLogin(role.value)}
                                    disabled={isLoading}
                                >
                                    {role.icon}
                                    {role.label} Demo
                                </button>
                            ))}
                        </div>

                        <p className="auth-footer-text">
                            Don't have an account?{' '}
                            <Link to="/register" className="auth-link">
                                Create one
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
