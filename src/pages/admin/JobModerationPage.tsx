// ============================================
// Job Moderation Page - Admin
// Approve, reject, and manage job postings
// ============================================

import React, { useState } from 'react';
import {
    Shield,
    CheckCircle,
    XCircle,
    Eye,
    Clock,
    AlertTriangle,
    MapPin,
    Building2
} from 'lucide-react';
import { mockJobs } from '../../data/mockData';
import '../user/Dashboard.css';
import './AdminPages.css';

// Admin view of jobs (adding status and reports)
const adminMockJobs = mockJobs.map(job => ({
    ...job,
    moderationStatus: ['pending', 'approved', 'rejected'][Math.floor(Math.random() * 3)] as 'pending' | 'approved' | 'rejected',
    reportCount: Math.random() > 0.8 ? Math.floor(Math.random() * 5) : 0,
    riskScore: Math.floor(Math.random() * 100)
}));

const JobModerationPage: React.FC = () => {
    const [jobs, setJobs] = useState(adminMockJobs);
    const [filter, setFilter] = useState('pending'); // pending, flagged, all

    const filteredJobs = jobs.filter(job => {
        if (filter === 'pending') return job.moderationStatus === 'pending';
        if (filter === 'flagged') return job.reportCount > 0 || job.riskScore > 80;
        return true;
    });

    const handleAction = (id: string, action: 'approve' | 'reject') => {
        setJobs(jobs.map(j => j.id === id ? { ...j, moderationStatus: action === 'approve' ? 'approved' : 'rejected' } : j));
    };

    const getRiskColor = (score: number) => {
        if (score < 30) return 'success'; // Safe
        if (score < 70) return 'warning'; // Medium
        return 'danger'; // High
    };

    return (
        <div className="dashboard-page">
            <div className="page-header">
                <div>
                    <h1 className="dashboard-title">
                        <Shield size={28} /> Job Moderation
                    </h1>
                    <p className="dashboard-subtitle">Review and manage job postings</p>
                </div>
            </div>

            {/* Stats */}
            <div className="stats-grid three-col">
                <div className="stat-card-box">
                    <div className="stat-icon warning"><Clock size={24} /></div>
                    <div>
                        <p className="stat-value-lg">{jobs.filter(j => j.moderationStatus === 'pending').length}</p>
                        <p className="stat-label-lg">Pending Review</p>
                    </div>
                </div>
                <div className="stat-card-box">
                    <div className="stat-icon danger"><AlertTriangle size={24} /></div>
                    <div>
                        <p className="stat-value-lg">{jobs.filter(j => j.reportCount > 0).length}</p>
                        <p className="stat-label-lg">Reported Jobs</p>
                    </div>
                </div>
                <div className="stat-card-box">
                    <div className="stat-icon success"><CheckCircle size={24} /></div>
                    <div>
                        <p className="stat-value-lg">{jobs.filter(j => j.moderationStatus === 'approved').length}</p>
                        <p className="stat-label-lg">Approved Today</p>
                    </div>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="filter-bar">
                <button
                    className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
                    onClick={() => setFilter('pending')}
                >
                    <Clock size={16} /> Pending
                </button>
                <button
                    className={`filter-btn ${filter === 'flagged' ? 'active' : ''}`}
                    onClick={() => setFilter('flagged')}
                >
                    <AlertTriangle size={16} /> Flagged
                </button>
                <button
                    className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                    onClick={() => setFilter('all')}
                >
                    All Jobs
                </button>
            </div>

            {/* Jobs List */}
            <div className="card no-padding">
                <div className="moderation-list">
                    {filteredJobs.length === 0 ? (
                        <div className="empty-state">
                            <CheckCircle size={48} />
                            <h3>All Caught Up!</h3>
                            <p>No jobs matching this filter.</p>
                        </div>
                    ) : (
                        filteredJobs.map(job => (
                            <div key={job.id} className="job-item-moderation">
                                <div className="job-company-logo">
                                    {job.company.charAt(0)}
                                </div>
                                <div className="job-content grow">
                                    <div className="job-header-row">
                                        <h3>{job.title}</h3>
                                        <div className="badges">
                                            <span className={`moderation-status ${job.moderationStatus}`}>{job.moderationStatus}</span>
                                            {job.reportCount > 0 && (
                                                <span className="badge badge-danger">
                                                    <AlertTriangle size={12} /> {job.reportCount} Reports
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <p className="job-company-name">
                                        <Building2 size={14} /> {job.company} •
                                        <MapPin size={14} /> {job.location} •
                                        Posted {new Date(job.postedAt).toLocaleDateString()}
                                    </p>
                                    <p className="job-description-preview">
                                        {job.description.substring(0, 150)}...
                                    </p>

                                    <div className="ai-risk-assessment">
                                        <div className={`risk-indicator ${getRiskColor(job.riskScore)}`}>
                                            <Shield size={14} />
                                            <span>Risk Score: {job.riskScore}/100</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="moderation-actions">
                                    <button className="btn btn-ghost" title="View Details">
                                        <Eye size={20} />
                                    </button>
                                    {job.moderationStatus === 'pending' && (
                                        <>
                                            <button
                                                className="btn btn-success-light"
                                                title="Approve"
                                                onClick={() => handleAction(job.id, 'approve')}
                                            >
                                                <CheckCircle size={20} />
                                            </button>
                                            <button
                                                className="btn btn-danger-light"
                                                title="Reject"
                                                onClick={() => handleAction(job.id, 'reject')}
                                            >
                                                <XCircle size={20} />
                                            </button>
                                        </>
                                    )}
                                    {job.moderationStatus === 'approved' && (
                                        <button
                                            className="btn btn-danger-light"
                                            title="Revoke Approval"
                                            onClick={() => handleAction(job.id, 'reject')}
                                        >
                                            <XCircle size={20} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default JobModerationPage;
