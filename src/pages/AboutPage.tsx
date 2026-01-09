// ============================================
// About Page
// ============================================

import React from 'react';
import { Link } from 'react-router-dom';
import {
    Sparkles,
    Target,
    Users,
    Award,
    CheckCircle,
    ArrowRight,
    Zap,
    Shield,
    TrendingUp
} from 'lucide-react';
import Navbar from '../components/Navbar';
import './LandingPage.css';

const AboutPage: React.FC = () => {
    const stats = [
        { value: '50K+', label: 'Jobs Posted' },
        { value: '100K+', label: 'Candidates Matched' },
        { value: '5K+', label: 'Companies' },
        { value: '92%', label: 'Match Accuracy' },
    ];

    const values = [
        {
            icon: <Target size={24} />,
            title: 'Precision Matching',
            description: 'Our AI analyzes skills, experience, and culture fit to find perfect matches.'
        },
        {
            icon: <Zap size={24} />,
            title: 'Speed & Efficiency',
            description: 'Reduce hiring time by 60% with automated screening and ranking.'
        },
        {
            icon: <Shield size={24} />,
            title: 'Fair & Unbiased',
            description: 'Our algorithms are designed to promote diversity and reduce bias.'
        },
        {
            icon: <TrendingUp size={24} />,
            title: 'Continuous Learning',
            description: 'Our AI improves with every match, getting smarter over time.'
        },
    ];

    const team = [
        { name: 'Alex Chen', role: 'CEO & Co-Founder', avatar: 'AC' },
        { name: 'Sarah Miller', role: 'CTO', avatar: 'SM' },
        { name: 'James Wilson', role: 'Head of AI', avatar: 'JW' },
        { name: 'Emma Davis', role: 'Head of Product', avatar: 'ED' },
    ];

    return (
        <div className="landing-page">
            <Navbar />

            <main className="about-page">
                {/* Hero Section */}
                <section className="about-hero">
                    <div className="container">
                        <div className="about-hero-content">
                            <div className="about-badge">
                                <Sparkles size={14} />
                                About JobMatcher AI
                            </div>
                            <h1>Revolutionizing Job Matching with AI</h1>
                            <p>
                                We're on a mission to transform how people find jobs and how companies find talent.
                                Using advanced AI and machine learning, we create perfect matches between candidates and opportunities.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="about-stats">
                    <div className="container">
                        <div className="stats-grid">
                            {stats.map((stat, index) => (
                                <div key={index} className="stat-item">
                                    <span className="stat-value">{stat.value}</span>
                                    <span className="stat-label">{stat.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Mission Section */}
                <section className="about-mission">
                    <div className="container">
                        <div className="mission-content">
                            <h2>Our Mission</h2>
                            <p>
                                To eliminate the frustration of job hunting and hiring by using AI to create
                                meaningful connections between talented individuals and the companies that need them.
                            </p>
                            <div className="mission-features">
                                <div className="mission-feature">
                                    <CheckCircle size={20} />
                                    <span>AI-powered resume analysis</span>
                                </div>
                                <div className="mission-feature">
                                    <CheckCircle size={20} />
                                    <span>Smart job matching algorithms</span>
                                </div>
                                <div className="mission-feature">
                                    <CheckCircle size={20} />
                                    <span>Real-time ATS optimization</span>
                                </div>
                                <div className="mission-feature">
                                    <CheckCircle size={20} />
                                    <span>Personalized career insights</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Values Section */}
                <section className="about-values">
                    <div className="container">
                        <h2>Our Values</h2>
                        <div className="values-grid">
                            {values.map((value, index) => (
                                <div key={index} className="value-card card">
                                    <div className="value-icon">{value.icon}</div>
                                    <h3>{value.title}</h3>
                                    <p>{value.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Team Section */}
                <section className="about-team">
                    <div className="container">
                        <h2>Meet Our Team</h2>
                        <p className="section-subtitle">
                            A passionate team of engineers, data scientists, and HR experts
                        </p>
                        <div className="team-grid">
                            {team.map((member, index) => (
                                <div key={index} className="team-card card">
                                    <div className="team-avatar">{member.avatar}</div>
                                    <h4>{member.name}</h4>
                                    <p>{member.role}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="about-cta">
                    <div className="container">
                        <div className="cta-content card">
                            <h2>Ready to Transform Your Career?</h2>
                            <p>Join thousands of professionals who've found their dream jobs through JobMatcher AI</p>
                            <div className="cta-buttons">
                                <Link to="/register" className="btn btn-primary btn-lg">
                                    Get Started Free <ArrowRight size={20} />
                                </Link>
                                <Link to="/jobs" className="btn btn-secondary btn-lg">
                                    Browse Jobs
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default AboutPage;
