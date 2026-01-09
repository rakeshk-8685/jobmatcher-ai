// Recruiter Dashboard
import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Briefcase, PlusCircle, TrendingUp, Eye, Clock, CheckCircle, Sparkles, ArrowRight } from 'lucide-react';
import { mockJobs } from '../../data/mockData';
import '../user/Dashboard.css';

const RecruiterDashboard: React.FC = () => {
    const myJobs = mockJobs.slice(0, 3);
    const candidates = [
        { id: '1', name: 'John Doe', role: 'Senior Frontend Dev', match: 95, status: 'new' },
        { id: '2', name: 'Jane Smith', role: 'Full Stack Engineer', match: 88, status: 'reviewed' },
        { id: '3', name: 'Mike Johnson', role: 'React Developer', match: 82, status: 'shortlisted' },
    ];

    return (
        <div className="dashboard-page">
            <div className="dashboard-header">
                <div><h1 className="dashboard-title">Recruiter Dashboard</h1><p className="dashboard-subtitle">Manage jobs and find top candidates</p></div>
                <Link to="/recruiter/post-job" className="btn btn-primary"><PlusCircle size={18} />Post New Job</Link>
            </div>

            <div className="stats-grid">
                <div className="stat-card-box"><div className="stat-icon primary"><Briefcase size={24} /></div><div><p className="stat-value-lg">8</p><p className="stat-label-lg">Active Jobs</p></div></div>
                <div className="stat-card-box"><div className="stat-icon success"><Users size={24} /></div><div><p className="stat-value-lg">156</p><p className="stat-label-lg">Total Applications</p></div></div>
                <div className="stat-card-box"><div className="stat-icon warning"><Eye size={24} /></div><div><p className="stat-value-lg">1.2K</p><p className="stat-label-lg">Job Views</p></div></div>
                <div className="stat-card-box"><div className="stat-icon accent"><TrendingUp size={24} /></div><div><p className="stat-value-lg">12</p><p className="stat-label-lg">Hires This Month</p></div></div>
            </div>

            <div className="dashboard-grid-2">
                {/* AI Matched Candidates */}
                <div className="card">
                    <div className="card-header"><h3><Sparkles size={18} /> AI-Matched Candidates</h3><Link to="/recruiter/candidates" className="card-link">View All <ArrowRight size={16} /></Link></div>
                    <div className="applications-list">
                        {candidates.map((c) => (
                            <div key={c.id} className="application-item">
                                <div className="application-company"><div className="company-avatar">{c.name.charAt(0)}</div><div><p className="application-job-title">{c.name}</p><p className="application-company-name">{c.role}</p></div></div>
                                <div className="job-match-badge">{c.match}% Match</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="card">
                    <div className="card-header"><h3>Recent Activity</h3></div>
                    <div className="applications-list">
                        <div className="application-item"><div className="application-company"><div className="stat-icon success" style={{ width: 32, height: 32 }}><CheckCircle size={16} /></div><div><p className="application-job-title">New application received</p><p className="application-company-name">2 minutes ago</p></div></div></div>
                        <div className="application-item"><div className="application-company"><div className="stat-icon warning" style={{ width: 32, height: 32 }}><Clock size={16} /></div><div><p className="application-job-title">Interview scheduled</p><p className="application-company-name">1 hour ago</p></div></div></div>
                        <div className="application-item"><div className="application-company"><div className="stat-icon primary" style={{ width: 32, height: 32 }}><Eye size={16} /></div><div><p className="application-job-title">Job posting viewed 50+ times</p><p className="application-company-name">3 hours ago</p></div></div></div>
                    </div>
                </div>
            </div>

            {/* Active Job Postings */}
            <div className="card">
                <div className="card-header"><h3>Your Job Postings</h3><Link to="/recruiter/jobs" className="card-link">Manage All <ArrowRight size={16} /></Link></div>
                <table className="data-table">
                    <thead><tr><th>Job Title</th><th>Applications</th><th>Views</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>
                        {myJobs.map((job) => (
                            <tr key={job.id}>
                                <td><div className="user-cell"><div className="user-cell-avatar">{job.title.charAt(0)}</div><span className="user-cell-name">{job.title}</span></div></td>
                                <td>{job.applicationsCount}</td>
                                <td>234</td>
                                <td><span className={`status-badge ${job.status}`}>{job.status}</span></td>
                                <td><div className="actions-cell"><button className="btn btn-ghost btn-sm">View</button><button className="btn btn-secondary btn-sm">Edit</button></div></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RecruiterDashboard;
