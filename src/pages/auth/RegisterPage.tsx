// ============================================
// Register Page
// ============================================

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Mail, Lock, ArrowRight, User, Briefcase, Eye, EyeOff, CheckCircle } from 'lucide-react';

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
import type { UserRole } from '../../types';
import './AuthPages.css';

const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const { register, loginWithGoogle, isLoading } = useAuth();
    const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [selectedRole, setSelectedRole] = useState<UserRole>('user');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);

    const getDashboardPath = (role: UserRole) => role === 'admin' ? '/admin/dashboard' : role === 'recruiter' ? '/recruiter/dashboard' : '/user/dashboard';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (formData.password !== formData.confirmPassword) { setError('Passwords do not match'); return; }
        if (!agreedToTerms) { setError('Please agree to the terms'); return; }
        const success = await register({ ...formData, role: selectedRole });
        if (success) navigate(getDashboardPath(selectedRole), { replace: true });
        else setError('Registration failed. Email may already be in use.');
    };

    const handleGoogleSignUp = async () => {
        setError('');
        setIsGoogleLoading(true);
        try {
            const user = await loginWithGoogle();
            if (user) {
                navigate(getDashboardPath(user.role), { replace: true });
            } else {
                setError('Google sign-up failed. Please try again.');
            }
        } catch {
            setError('Google sign-up failed. Please try again.');
        } finally {
            setIsGoogleLoading(false);
        }
    };

    const roles = [
        { value: 'user' as UserRole, label: 'Candidate', icon: <User size={20} />, desc: 'Find your dream job' },
        { value: 'recruiter' as UserRole, label: 'Recruiter', icon: <Briefcase size={20} />, desc: 'Hire top talent' },
    ];

    return (
        <div className="auth-page">
            <div className="auth-bg"><div className="auth-glow auth-glow-1"></div><div className="auth-glow auth-glow-2"></div></div>
            <div className="auth-container">
                <div className="auth-branding">
                    <Link to="/" className="auth-logo"><div className="logo-icon"><Sparkles size={28} /></div><span className="logo-text">JobMatcher</span><span className="logo-ai">AI</span></Link>

                    {/* Animated Illustration */}
                    <div className="auth-illustration">
                        <img src="/auth-illustration.png" alt="Job Matching" className="auth-hero-image" />
                        <div className="floating-element floating-1"></div>
                        <div className="floating-element floating-2"></div>
                        <div className="floating-element floating-3"></div>
                    </div>

                    <div className="auth-branding-content">
                        <h1>Join JobMatcher AI</h1>
                        <p>Create your account and start your journey.</p>
                        <div className="auth-benefits">
                            {['AI-powered matching', 'ATS score analysis', 'Personalized recs'].map((b, i) => (
                                <div key={i} className="auth-benefit"><CheckCircle size={18} /><span>{b}</span></div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="auth-form-container">
                    <div className="auth-form-wrapper">
                        <div className="auth-form-header"><h2>Create Account</h2><p>Choose your role</p></div>
                        <div className="role-selector role-selector-large">
                            {roles.map((role) => (
                                <button key={role.value} type="button" className={`role-option-large ${selectedRole === role.value ? 'active' : ''}`} onClick={() => setSelectedRole(role.value)}>
                                    <div className="role-icon-large">{role.icon}</div>
                                    <div className="role-info"><span className="role-label-large">{role.label}</span><span className="role-description">{role.desc}</span></div>
                                </button>
                            ))}
                        </div>
                        {error && <div className="auth-error">{error}</div>}

                        <button type="button" className="btn btn-google w-full" onClick={handleGoogleSignUp} disabled={isLoading || isGoogleLoading} style={{ marginBottom: '1rem' }}>
                            <GoogleIcon />
                            {isGoogleLoading ? 'Signing up...' : 'Sign up with Google'}
                        </button>

                        <div className="auth-divider"><span>or with email</span></div>

                        <form onSubmit={handleSubmit} className="auth-form">
                            <div className="input-group"><label className="input-label">Full Name</label><div className="input-with-icon"><User size={18} className="input-icon" /><input type="text" className="input" placeholder="Full name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required /></div></div>
                            <div className="input-group"><label className="input-label">Email</label><div className="input-with-icon"><Mail size={18} className="input-icon" /><input type="email" className="input" placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required /></div></div>
                            <div className="input-group"><label className="input-label">Password</label><div className="input-with-icon"><Lock size={18} className="input-icon" /><input type={showPassword ? 'text' : 'password'} className="input" placeholder="Password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required minLength={8} /><button type="button" className="input-toggle" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></div>
                            <div className="input-group"><label className="input-label">Confirm Password</label><div className="input-with-icon"><Lock size={18} className="input-icon" /><input type={showPassword ? 'text' : 'password'} className="input" placeholder="Confirm" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} required /></div></div>
                            <label className="checkbox-label terms-checkbox"><input type="checkbox" checked={agreedToTerms} onChange={(e) => setAgreedToTerms(e.target.checked)} /><span>I agree to <Link to="/terms" className="auth-link">Terms</Link> and <Link to="/privacy" className="auth-link">Privacy</Link></span></label>
                            <button type="submit" className="btn btn-primary btn-lg w-full" disabled={isLoading}>{isLoading ? 'Creating...' : 'Create Account'}<ArrowRight size={20} /></button>
                        </form>
                        <p className="auth-footer-text">Have an account? <Link to="/login" className="auth-link">Sign in</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
