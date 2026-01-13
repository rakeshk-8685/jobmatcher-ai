// ============================================
// Applications Page
// Track job applications and statuses
// ============================================

import React, { useState } from 'react';
import {
    FileText,
    Clock,
    CheckCircle,
    XCircle,
    Calendar,
    Building2,
    MapPin,
    Eye,
    MessageSquare
} from 'lucide-react';
import { mockApplications } from '../../data/mockData';
import '../user/Dashboard.css';

const ApplicationsPage: React.FC = () => {
    const [statusFilter, setStatusFilter] = useState<string>('all');

    const statusConfig: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
        pending: { icon: <Clock size={16} />, color: 'warning', label: 'Pending' },
        reviewing: { icon: <Eye size={16} />, color: 'info', label: 'Reviewing' },
        interview: { icon: <Calendar size={16} />, color: 'primary', label: 'Interview' },
        shortlisted: { icon: <CheckCircle size={16} />, color: 'success', label: 'Shortlisted' },
        rejected: { icon: <XCircle size={16} />, color: 'error', label: 'Rejected' },
        hired: { icon: <CheckCircle size={16} />, color: 'success', label: 'Hired' },
    };

    const filteredApplications = statusFilter === 'all'
        ? mockApplications
        : mockApplications.filter(app => app.status === statusFilter);

    const applicationStats = {
        total: mockApplications.length,
        pending: mockApplications.filter(a => a.status === 'pending').length,
        reviewing: mockApplications.filter(a => a.status === 'reviewing').length,
        interview: mockApplications.filter(a => a.status === 'interview').length,
    };

    return (
        <div className="dashboard-page">
            <div className="page-header">
                <div>
                    <h1 className="dashboard-title">
                        <FileText size={28} /> My Applications
                    </h1>
                    <p className="dashboard-subtitle">
                        Track and manage your job applications
                    </p>
                </div>
            </div>

            {/* Stats */}
            <div className="stats-grid stats-4">
                <div className="stat-card-box">
                    <div className="stat-icon-box"><FileText size={20} /></div>
                    <div className="stat-content">
                        <span className="stat-value">{applicationStats.total}</span>
                        <span className="stat-label">  Total Applications</span>
                    </div>
                </div>
                <div className="stat-card-box">
                    <div className="stat-icon-box warning"><Clock size={20} /></div>
                    <div className="stat-content">
                        <span className="stat-value">{applicationStats.pending}</span>
                        <span className="stat-label"> Pending</span>
                    </div>
                </div>
                <div className="stat-card-box">
                    <div className="stat-icon-box info"><Eye size={20} /></div>
                    <div className="stat-content">
                        <span className="stat-value">{applicationStats.reviewing}</span>
                        <span className="stat-label">  Under Review</span>
                    </div>
                </div>
                <div className="stat-card-box">
                    <div className="stat-icon-box primary"><Calendar size={20} /></div>
                    <div className="stat-content">
                        <span className="stat-value">{applicationStats.interview}</span>
                        <span className="stat-label">  Interviews</span>
                    </div>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="filter-bar">
                <button
                    className={`filter-btn ${statusFilter === 'all' ? 'active' : ''}`}
                    onClick={() => setStatusFilter('all')}
                >
                    All ({mockApplications.length})
                </button>
                {Object.entries(statusConfig).map(([status, config]) => {
                    const count = mockApplications.filter(a => a.status === status).length;
                    if (count === 0) return null;
                    return (
                        <button
                            key={status}
                            className={`filter-btn ${statusFilter === status ? 'active' : ''}`}
                            onClick={() => setStatusFilter(status)}
                        >
                            {config.icon} {config.label} ({count})
                        </button>
                    );
                })}
            </div>

            {/* Applications List */}
            <div className="applications-list">
                {filteredApplications.map((app) => {
                    const status = statusConfig[app.status];
                    return (
                        <div key={app.id} className="application-card card">
                            <div className="application-header">
                                <div className="company-logo">
                                    {app.job?.company.charAt(0) || 'C'}
                                </div>
                                <div className="application-info">
                                    <h3>{app.job?.title}</h3>
                                    <div className="application-meta">
                                        <span><Building2 size={14} /> {app.job?.company}</span>
                                        <span><MapPin size={14} /> {app.job?.location}</span>
                                    </div>
                                </div>
                                <div className={`status-badge ${status.color}`}>
                                    {status.icon}
                                    <span>{status.label}</span>
                                </div>
                            </div>

                            <div className="application-details">
                                <div className="detail-item">
                                    <span className="detail-label">Applied</span>
                                    <span className="detail-value">
                                        {new Date(app.appliedAt).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Match Score</span>
                                    <span className="detail-value match-score">{app.matchScore}%</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Last Updated</span>
                                    <span className="detail-value">
                                        {new Date(app.updatedAt).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </span>
                                </div>
                            </div>

                            <div className="application-actions">
                                <button className="btn btn-secondary btn-sm">
                                    <Eye size={14} /> View Details
                                </button>
                                <button className="btn btn-secondary btn-sm">
                                    <MessageSquare size={14} /> Messages
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {filteredApplications.length === 0 && (
                <div className="empty-state card">
                    <FileText size={48} />
                    <h3>No applications found</h3>
                    <p>No applications match the selected filter.</p>
                </div>
            )}
        </div>
    );
};

export default ApplicationsPage;
