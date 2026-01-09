// ============================================
// Landing Page
// Modern, stunning homepage with AI visualization
// ============================================

import React from 'react';
import { Link } from 'react-router-dom';
import {
    Sparkles,
    ArrowRight,
    Briefcase,
    Users,
    BarChart3,
    Zap,
    Target,
    Shield,
    CheckCircle,
    Star,
    Brain,
    FileSearch,
    Rocket,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import './LandingPage.css';

const LandingPage: React.FC = () => {
    const features = [
        {
            icon: <Brain size={28} />,
            title: 'AI-Powered Matching',
            description: 'Our advanced AI analyzes job descriptions and candidate profiles to find perfect matches with 95% accuracy.',
        },
        {
            icon: <FileSearch size={28} />,
            title: 'ATS Score Prediction',
            description: 'Get instant feedback on your resume with our ATS scoring system. Know exactly how to improve.',
        },
        {
            icon: <Zap size={28} />,
            title: 'Smart Recommendations',
            description: 'Receive personalized job recommendations based on your skills, experience, and career goals.',
        },
        {
            icon: <Target size={28} />,
            title: 'JD-Based Matching',
            description: 'Recruiters can paste job descriptions and instantly find candidates that match required skills.',
        },
        {
            icon: <BarChart3 size={28} />,
            title: 'Analytics Dashboard',
            description: 'Track your applications, view match trends, and get insights to improve your job search.',
        },
        {
            icon: <Shield size={28} />,
            title: 'Verified Profiles',
            description: 'All profiles are verified ensuring authentic candidates and legitimate job postings.',
        },
    ];

    const stats = [
        { value: '50K+', label: 'Active Users' },
        { value: '12K+', label: 'Companies' },
        { value: '95%', label: 'Match Rate' },
        { value: '48hrs', label: 'Avg Time to Hire' },
    ];

    const testimonials = [
        {
            name: 'Sarah Chen',
            role: 'Software Engineer at Google',
            content: 'JobMatcher AI helped me land my dream job! The ATS score feature was incredibly helpful in optimizing my resume.',
            rating: 5,
        },
        {
            name: 'Michael Rodriguez',
            role: 'HR Director at TechCorp',
            content: 'As a recruiter, this platform has cut our hiring time in half. The AI matching is incredibly accurate.',
            rating: 5,
        },
        {
            name: 'Emily Watson',
            role: 'Product Manager at Stripe',
            content: 'The job recommendations were spot on. I found opportunities I never would have discovered on my own.',
            rating: 5,
        },
    ];

    const steps = [
        {
            number: '01',
            title: 'Create Your Profile',
            description: 'Upload your resume and let our AI parse your skills and experience automatically.',
        },
        {
            number: '02',
            title: 'Get Your ATS Score',
            description: 'Receive instant feedback on your resume with actionable suggestions for improvement.',
        },
        {
            number: '03',
            title: 'Match & Apply',
            description: 'Browse AI-curated job matches and apply with one click to positions that fit you best.',
        },
    ];

    return (
        <div className="landing-page">
            <Navbar />

            {/* Hero Section */}
            <section className="hero">
                <div className="hero-bg">
                    <div className="hero-glow hero-glow-1"></div>
                    <div className="hero-glow hero-glow-2"></div>
                    <div className="hero-grid"></div>
                </div>

                <div className="hero-content container">
                    <div className="hero-badge animate-fade-in">
                        <Sparkles size={16} />
                        <span>AI-Powered Job Matching Platform</span>
                    </div>

                    <h1 className="hero-title animate-fade-in-up">
                        Find Your Perfect Job Match with{' '}
                        <span className="gradient-text">AI Intelligence</span>
                    </h1>

                    <p className="hero-subtitle animate-fade-in-up stagger-1">
                        Our advanced AI analyzes your profile and job descriptions to deliver
                        personalized matches with unprecedented accuracy. Join thousands of
                        professionals who've found their dream careers.
                    </p>

                    <div className="hero-actions animate-fade-in-up stagger-2">
                        <Link to="/register" className="btn btn-primary btn-lg">
                            Get Started Free
                            <ArrowRight size={20} />
                        </Link>
                        <Link to="/login" className="btn btn-secondary btn-lg">
                            I'm a Recruiter
                            <Briefcase size={20} />
                        </Link>
                    </div>

                    <div className="hero-stats animate-fade-in-up stagger-3">
                        {stats.map((stat, index) => (
                            <div key={index} className="hero-stat">
                                <span className="hero-stat-value">{stat.value}</span>
                                <span className="hero-stat-label">{stat.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Floating Cards Animation */}
                <div className="hero-visual">
                    <div className="floating-card card-1 animate-float">
                        <div className="floating-card-icon success">
                            <CheckCircle size={24} />
                        </div>
                        <div className="floating-card-content">
                            <p className="floating-card-title">New Match Found!</p>
                            <p className="floating-card-text">Senior Developer at TechCorp</p>
                        </div>
                    </div>

                    <div className="floating-card card-2 animate-float" style={{ animationDelay: '0.5s' }}>
                        <div className="floating-card-icon primary">
                            <BarChart3 size={24} />
                        </div>
                        <div className="floating-card-content">
                            <p className="floating-card-title">ATS Score</p>
                            <div className="mini-progress">
                                <div className="mini-progress-bar" style={{ width: '92%' }}></div>
                            </div>
                            <p className="floating-card-text">92% - Excellent</p>
                        </div>
                    </div>

                    <div className="floating-card card-3 animate-float" style={{ animationDelay: '1s' }}>
                        <div className="floating-card-icon accent">
                            <Users size={24} />
                        </div>
                        <div className="floating-card-content">
                            <p className="floating-card-title">5 New Candidates</p>
                            <p className="floating-card-text">Match your job posting</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section" id="features">
                <div className="container">
                    <div className="section-header">
                        <span className="section-badge">Features</span>
                        <h2 className="section-title">
                            Everything You Need for{' '}
                            <span className="gradient-text">Smart Hiring</span>
                        </h2>
                        <p className="section-subtitle">
                            Powerful tools for candidates and recruiters, powered by cutting-edge AI technology.
                        </p>
                    </div>

                    <div className="features-grid">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="feature-card animate-fade-in-up"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="feature-icon">{feature.icon}</div>
                                <h3 className="feature-title">{feature.title}</h3>
                                <p className="feature-description">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="how-it-works-section">
                <div className="container">
                    <div className="section-header">
                        <span className="section-badge">How It Works</span>
                        <h2 className="section-title">
                            Three Simple Steps to Your{' '}
                            <span className="gradient-text">Dream Job</span>
                        </h2>
                    </div>

                    <div className="steps-container">
                        {steps.map((step, index) => (
                            <div key={index} className="step-card">
                                <div className="step-number">{step.number}</div>
                                <h3 className="step-title">{step.title}</h3>
                                <p className="step-description">{step.description}</p>
                                {index < steps.length - 1 && <div className="step-connector"></div>}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="testimonials-section">
                <div className="container">
                    <div className="section-header">
                        <span className="section-badge">Testimonials</span>
                        <h2 className="section-title">
                            Loved by <span className="gradient-text">Professionals</span>
                        </h2>
                    </div>

                    <div className="testimonials-grid">
                        {testimonials.map((testimonial, index) => (
                            <div key={index} className="testimonial-card">
                                <div className="testimonial-rating">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} size={16} fill="currentColor" />
                                    ))}
                                </div>
                                <p className="testimonial-content">"{testimonial.content}"</p>
                                <div className="testimonial-author">
                                    <div className="testimonial-avatar">
                                        {testimonial.name.charAt(0)}
                                    </div>
                                    <div className="testimonial-info">
                                        <p className="testimonial-name">{testimonial.name}</p>
                                        <p className="testimonial-role">{testimonial.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="container">
                    <div className="cta-card">
                        <div className="cta-content">
                            <h2 className="cta-title">
                                Ready to Find Your Perfect Match?
                            </h2>
                            <p className="cta-subtitle">
                                Join thousands of professionals and companies using AI to connect talent with opportunity.
                            </p>
                            <div className="cta-actions">
                                <Link to="/register" className="btn btn-primary btn-lg">
                                    <Rocket size={20} />
                                    Start Free Today
                                </Link>
                                <Link to="/about" className="btn btn-ghost btn-lg">
                                    Learn More
                                </Link>
                            </div>
                        </div>
                        <div className="cta-visual">
                            <div className="cta-glow"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="container">
                    <div className="footer-content">
                        <div className="footer-brand">
                            <div className="footer-logo">
                                <div className="logo-icon">
                                    <Sparkles size={24} />
                                </div>
                                <span className="logo-text">JobMatcher</span>
                                <span className="logo-ai">AI</span>
                            </div>
                            <p className="footer-tagline">
                                AI-powered job matching for the modern workforce.
                            </p>
                        </div>

                        <div className="footer-links">
                            <div className="footer-column">
                                <h4>Product</h4>
                                <a href="#features">Features</a>
                                <a href="#pricing">Pricing</a>
                                <a href="#enterprise">Enterprise</a>
                            </div>
                            <div className="footer-column">
                                <h4>Company</h4>
                                <a href="/about">About</a>
                                <a href="/careers">Careers</a>
                                <a href="/blog">Blog</a>
                            </div>
                            <div className="footer-column">
                                <h4>Resources</h4>
                                <a href="/docs">Documentation</a>
                                <a href="/help">Help Center</a>
                                <a href="/api">API</a>
                            </div>
                            <div className="footer-column">
                                <h4>Legal</h4>
                                <a href="/privacy">Privacy</a>
                                <a href="/terms">Terms</a>
                                <a href="/cookies">Cookies</a>
                            </div>
                        </div>
                    </div>

                    <div className="footer-bottom">
                        <p>&copy; 2025 JobMatcher AI. Created By Rakesh's Father. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
