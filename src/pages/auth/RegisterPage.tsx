// ============================================
// Register Page
// ============================================

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Mail, Lock, ArrowRight, User, Briefcase, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import type { UserRole } from '../../types';
import './AuthPages.css';

const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const { register, isLoading } = useAuth();
    const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [selectedRole, setSelectedRole] = useState<UserRole>('user');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    const getDashboardPath = (role: UserRole) => role === 'admin' ? '/admin/dashboard' : role === 'recruiter' ? '/recruiter/dashboard' : '/user/dashboard';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (formData.password !== formData.confirmPassword) { setError('Passwords do not match'); return; }
        if (!agreedToTerms) { setError('Please agree to the terms'); return; }
        const success = await register({ ...formData, role: selectedRole });
        if (success) navigate(getDashboardPath(selectedRole), { replace: true });
        else setError('Registration failed');
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
