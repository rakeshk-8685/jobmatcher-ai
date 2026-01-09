// Admin Dashboard
import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Briefcase, Shield, BarChart3, TrendingUp, AlertTriangle, CheckCircle, Clock, ArrowRight } from 'lucide-react';
import { mockAdminStats } from '../../data/mockData';
import '../user/Dashboard.css';

const AdminDashboard: React.FC = () => {
    const recentUsers = [
        { id: '1', name: 'Alex Johnson', email: 'alex@email.com', role: 'user', status: 'active' },
        { id: '2', name: 'Sarah Williams', email: 'sarah@company.com', role: 'recruiter', status: 'active' },
        { id: '3', name: 'Mike Chen', email: 'mike@email.com', role: 'user', status: 'pending' },
    ];

    const pendingJobs = [
        { id: '1', title: 'Senior Developer', company: 'TechCorp', submitted: '2 hours ago' },
        { id: '2', title: 'Product Manager', company: 'StartupXYZ', submitted: '5 hours ago' },
    ];

    return (
        <div className="dashboard-page">
            <div className="dashboard-header">
                <div><h1 className="dashboard-title">Admin Dashboard</h1><p className="dashboard-subtitle">Platform overview and management</p></div>
                <Link to="/admin/analytics" className="btn btn-primary"><BarChart3 size={18} />View Reports</Link>
            </div>

            <div className="stats-grid">
                <div className="stat-card-box"><div className="stat-icon primary"><Users size={24} /></div><div><p className="stat-value-lg">{(mockAdminStats.totalUsers / 1000).toFixed(1)}K</p><p className="stat-label-lg">Total Users</p></div></div>
                <div className="stat-card-box"><div className="stat-icon success"><Briefcase size={24} /></div><div><p className="stat-value-lg">{mockAdminStats.activeJobs}</p><p className="stat-label-lg">Active Jobs</p></div></div>
                <div className="stat-card-box"><div className="stat-icon warning"><Clock size={24} /></div><div><p className="stat-value-lg">{mockAdminStats.pendingApprovals}</p><p className="stat-label-lg">Pending Approvals</p></div></div>
                <div className="stat-card-box"><div className="stat-icon accent"><TrendingUp size={24} /></div><div><p className="stat-value-lg">+23%</p><p className="stat-label-lg">Growth</p></div></div>
            </div>

            <div className="dashboard-grid-2">
                {/* Pending Approvals */}
                <div className="card">
                    <div className="card-header"><h3><AlertTriangle size={18} /> Pending Approvals</h3><Link to="/admin/jobs" className="card-link">View All <ArrowRight size={16} /></Link></div>
                    <div className="applications-list">
                        {pendingJobs.map((job) => (
                            <div key={job.id} className="application-item">
                                <div className="application-company"><div className="stat-icon warning" style={{ width: 40, height: 40 }}><Shield size={18} /></div><div><p className="application-job-title">{job.title}</p><p className="application-company-name">{job.company} • {job.submitted}</p></div></div>
                                <div className="actions-cell"><button className="btn btn-success btn-sm"><CheckCircle size={14} /> Approve</button></div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Platform Stats */}
                <div className="card">
                    <div className="card-header"><h3>Platform Statistics</h3></div>
                    <div className="chart-placeholder">📊 Analytics Chart Placeholder</div>
                </div>
            </div>

            {/* Recent Users */}
            <div className="card">
                <div className="card-header"><h3>Recent Users</h3><Link to="/admin/users" className="card-link">Manage Users <ArrowRight size={16} /></Link></div>
                <table className="data-table">
                    <thead><tr><th>User</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>
                        {recentUsers.map((user) => (
                            <tr key={user.id}>
                                <td><div className="user-cell"><div className="user-cell-avatar">{user.name.charAt(0)}</div><span className="user-cell-name">{user.name}</span></div></td>
                                <td>{user.email}</td>
                                <td><span className="badge badge-primary">{user.role}</span></td>
                                <td><span className={`status-badge ${user.status}`}>{user.status}</span></td>
                                <td><div className="actions-cell"><button className="btn btn-ghost btn-sm">View</button><button className="btn btn-secondary btn-sm">Edit</button></div></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminDashboard;
