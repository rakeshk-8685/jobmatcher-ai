// ============================================
// Job Matches Page
// AI-powered job recommendations
// ============================================

import React, { useState } from 'react';
import {
    Sparkles,
    MapPin,
    Briefcase,
    Clock,
    DollarSign,
    Heart,
    ArrowRight,
    TrendingUp
} from 'lucide-react';
import { mockJobs } from '../../data/mockData';
import '../user/Dashboard.css';

const JobMatchesPage: React.FC = () => {
    const [filter, setFilter] = useState<'all' | 'high' | 'saved'>('all');

    // Sort jobs by match score
    const sortedJobs = [...mockJobs].sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));

    const filteredJobs = sortedJobs.filter(job => {
        if (filter === 'high') return (job.matchScore || 0) >= 80;
        // In production: add saved jobs logic
        return true;
    });

    const getMatchColor = (score: number) => {
        if (score >= 90) return 'excellent';
        if (score >= 75) return 'good';
        if (score >= 60) return 'fair';
        return 'low';
    };

    return (
        <div className="dashboard-page">
            <div className="page-header">
                <div>
                    <h1 className="dashboard-title">
                        <Sparkles size={28} /> Job Matches
                    </h1>
                    <p className="dashboard-subtitle">
                        AI-powered job recommendations based on your profile
                    </p>
                </div>
            </div>

            {/* Match Stats */}
            <div className="match-stats">
                <div className="match-stat-card card">
                    <TrendingUp size={24} className="stat-icon" />
                    <div>
                        <span className="stat-value">{sortedJobs.length}</span>
                        <span className="stat-label">Total Matches</span>
                    </div>
                </div>
                <div className="match-stat-card card">
                    <Sparkles size={24} className="stat-icon excellent" />
                    <div>
                        <span className="stat-value">{sortedJobs.filter(j => (j.matchScore || 0) >= 80).length}</span>
                        <span className="stat-label">High Match (80%+)</span>
                    </div>
                </div>
                <div className="match-stat-card card">
                    <Heart size={24} className="stat-icon saved" />
                    <div>
                        <span className="stat-value">3</span>
                        <span className="stat-label">Saved Jobs</span>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="filter-bar">
                <button
                    className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                    onClick={() => setFilter('all')}
                >
                    All Matches
                </button>
                <button
                    className={`filter-btn ${filter === 'high' ? 'active' : ''}`}
                    onClick={() => setFilter('high')}
                >
                    High Match (80%+)
                </button>
                <button
                    className={`filter-btn ${filter === 'saved' ? 'active' : ''}`}
                    onClick={() => setFilter('saved')}
                >
                    <Heart size={14} /> Saved
                </button>
            </div>

            {/* Job Cards */}
            <div className="job-matches-grid">
                {filteredJobs.map((job) => (
                    <div key={job.id} className="job-match-card card">
                        <div className="job-match-header">
                            <div className="company-logo">
                                {job.company.charAt(0)}
                            </div>
                            <div className="job-match-info">
                                <h3>{job.title}</h3>
                                <p>{job.company}</p>
                            </div>
                            <div className={`match-score ${getMatchColor(job.matchScore || 0)}`}>
                                <Sparkles size={14} />
                                <span>{job.matchScore}%</span>
                            </div>
                        </div>

                        <div className="job-match-meta">
                            <span><MapPin size={14} /> {job.location}</span>
                            <span><Briefcase size={14} /> {job.type}</span>
                            <span><Clock size={14} /> {job.experience}</span>
                        </div>

                        <div className="job-match-salary">
                            <DollarSign size={16} />
                            <span>${(job.salary.min / 1000).toFixed(0)}k - ${(job.salary.max / 1000).toFixed(0)}k / year</span>
                        </div>

                        <div className="job-match-skills">
                            {job.skills.slice(0, 4).map((skill) => (
                                <span key={skill} className="skill-tag">{skill}</span>
                            ))}
                        </div>

                        <p className="job-match-description">{job.description}</p>

                        <div className="job-match-actions">
                            <button className="btn btn-icon">
                                <Heart size={18} />
                            </button>
                            <button className="btn btn-primary">
                                Apply Now <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default JobMatchesPage;
