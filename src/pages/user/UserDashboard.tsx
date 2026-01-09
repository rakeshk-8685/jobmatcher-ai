// User Dashboard - Main dashboard for candidates
import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, FileText, TrendingUp, ArrowRight, Clock, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import { mockJobs, mockApplications, mockATSScore } from '../../data/mockData';
import './Dashboard.css';

const UserDashboard: React.FC = () => {
    const recentJobs = mockJobs.slice(0, 3);
    const recentApps = mockApplications.slice(0, 3);

    return (
        <div className="dashboard-page">
            <div className="dashboard-header">
                <div>
                    <h1 className="dashboard-title">Dashboard</h1>
                    <p className="dashboard-subtitle">Welcome back! Here's your job search overview.</p>
                </div>
                <Link to="/user/jobs" className="btn btn-primary">
                    <Sparkles size={18} />
                    Find Jobs
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
                <div className="stat-card-box"><div className="stat-icon primary"><Briefcase size={24} /></div><div><p className="stat-value-lg">12</p><p className="stat-label-lg">Job Matches</p></div></div>
                <div className="stat-card-box"><div className="stat-icon success"><FileText size={24} /></div><div><p className="stat-value-lg">{mockApplications.length}</p><p className="stat-label-lg">Applications</p></div></div>
                <div className="stat-card-box"><div className="stat-icon warning"><Clock size={24} /></div><div><p className="stat-value-lg">2</p><p className="stat-label-lg">Interviews</p></div></div>
                <div className="stat-card-box"><div className="stat-icon accent"><TrendingUp size={24} /></div><div><p className="stat-value-lg">+15%</p><p className="stat-label-lg">Profile Views</p></div></div>
            </div>

            <div className="dashboard-grid-2">
                {/* ATS Score Card */}
                <div className="card ats-score-card">
                    <div className="card-header"><h3>ATS Score</h3><Link to="/user/ats-score" className="card-link">View Details <ArrowRight size={16} /></Link></div>
                    <div className="ats-score-content">
                        <div className="ats-circle">
                            <svg viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="45" className="ats-circle-bg" />
                                <circle cx="50" cy="50" r="45" className="ats-circle-progress" style={{ strokeDasharray: `${mockATSScore.overall * 2.83} 283` }} />
                            </svg>
                            <div className="ats-circle-value"><span className="ats-score-number">{mockATSScore.overall}</span><span className="ats-score-label">Score</span></div>
                        </div>
                        <div className="ats-breakdown">
                            {Object.entries(mockATSScore.breakdown).map(([key, value]) => (
                                <div key={key} className="ats-breakdown-item"><span className="ats-breakdown-label">{key}</span><div className="ats-breakdown-bar"><div className="ats-breakdown-fill" style={{ width: `${value}%` }}></div></div><span className="ats-breakdown-value">{value}%</span></div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Recent Applications */}
                <div className="card">
                    <div className="card-header"><h3>Recent Applications</h3><Link to="/user/applications" className="card-link">View All <ArrowRight size={16} /></Link></div>
                    <div className="applications-list">
                        {recentApps.map((app) => (
                            <div key={app.id} className="application-item">
                                <div className="application-company"><div className="company-avatar">{app.job.company.charAt(0)}</div><div><p className="application-job-title">{app.job.title}</p><p className="application-company-name">{app.job.company}</p></div></div>
                                <div className={`application-status ${app.status}`}>{app.status === 'interview' && <CheckCircle size={14} />}{app.status === 'reviewing' && <Clock size={14} />}{app.status === 'pending' && <AlertCircle size={14} />}{app.status}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Job Recommendations */}
            <div className="card">
                <div className="card-header"><h3>Recommended Jobs</h3><Link to="/user/jobs" className="card-link">View All <ArrowRight size={16} /></Link></div>
                <div className="jobs-grid">
                    {recentJobs.map((job) => (
                        <div key={job.id} className="job-card">
                            <div className="job-card-header"><div className="job-company-logo">{job.company.charAt(0)}</div><div className="job-match-badge">{job.matchScore}% Match</div></div>
                            <h4 className="job-title">{job.title}</h4>
                            <p className="job-company">{job.company}</p>
                            <p className="job-location">{job.location}</p>
                            <div className="job-tags">{job.skills.slice(0, 3).map((skill, i) => (<span key={i} className="job-tag">{skill}</span>))}</div>
                            <div className="job-card-footer"><span className="job-salary">${(job.salary.min / 1000).toFixed(0)}k - ${(job.salary.max / 1000).toFixed(0)}k</span><button className="btn btn-primary btn-sm">Apply</button></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
