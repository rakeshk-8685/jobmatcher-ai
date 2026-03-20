// ============================================
// Analytics Page - Admin
// Platform performance and growth metrics
// ============================================

import React from 'react';
import {
    BarChart3,
    Users,
    Briefcase,
    Globe,
    Activity,
    Calendar,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';
import '../user/Dashboard.css';
import './AdminPages.css';

const AnalyticsPage: React.FC = () => {
    // Mock Data for Charts
    const userGrowthData = [
        { month: 'Jan', users: 1200 },
        { month: 'Feb', users: 1500 },
        { month: 'Mar', users: 1800 },
        { month: 'Apr', users: 2400 },
        { month: 'May', users: 3200 },
        { month: 'Jun', users: 4500 }
    ];

    const revenueData = [
        { month: 'Jan', amount: 45000 },
        { month: 'Feb', amount: 52000 },
        { month: 'Mar', amount: 49000 },
        { month: 'Apr', amount: 68000 },
        { month: 'May', amount: 85000 },
        { month: 'Jun', amount: 98000 }
    ];

    const maxUsers = Math.max(...userGrowthData.map(d => d.users));
    const maxRevenue = Math.max(...revenueData.map(d => d.amount));

    return (
        <div className="dashboard-page">
            <div className="page-header">
                <div>
                    <h1 className="dashboard-title">
                        <BarChart3 size={28} /> Platform Analytics
                    </h1>
                    <p className="dashboard-subtitle">Key metrics and performance indicators</p>
                </div>
                <div className="date-range-picker">
                    <Calendar size={18} />
                    <span>Last 6 Months</span>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="stats-grid four-col">
                <div className="stat-card-box">
                    <div className="stat-icon primary"><Users size={24} /></div>
                    <div>
                        <p className="stat-value-lg">15.4K</p>
                        <p className="stat-label-lg">Total Users</p>
                        <span className="trend positive"><ArrowUpRight size={14} /> +12%</span>
                    </div>
                </div>
                <div className="stat-card-box">
                    <div className="stat-icon success"><Briefcase size={24} /></div>
                    <div>
                        <p className="stat-value-lg">3,456</p>
                        <p className="stat-label-lg">Active Jobs</p>
                        <span className="trend positive"><ArrowUpRight size={14} /> +8%</span>
                    </div>
                </div>
                <div className="stat-card-box">
                    <div className="stat-icon accent"><Activity size={24} /></div>
                    <div>
                        <p className="stat-value-lg">89%</p>
                        <p className="stat-label-lg">Match Rate</p>
                        <span className="trend positive"><ArrowUpRight size={14} /> +2%</span>
                    </div>
                </div>
                <div className="stat-card-box">
                    <div className="stat-icon warning"><Globe size={24} /></div>
                    <div>
                        <p className="stat-value-lg">₹12.5M</p>
                        <p className="stat-label-lg">Revenue</p>
                        <span className="trend negative"><ArrowDownRight size={14} /> -1.2%</span>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="analytics-grid">
                {/* User Growth Chart */}
                <div className="card">
                    <div className="card-header">
                        <h3>User Growth</h3>
                        <div className="chart-legend">
                            <span className="legend-item"><span className="dot primary"></span> Users</span>
                        </div>
                    </div>
                    <div className="analytics-chart-container">
                        {userGrowthData.map((data, index) => (
                            <div key={index} className="chart-bar-wrapper">
                                <div
                                    className="chart-bar"
                                    style={{ height: `${(data.users / maxUsers) * 100}%` }}
                                    title={`${data.users} Users`}
                                >
                                    <span className="chart-tooltip">{data.users}</span>
                                </div>
                                <span className="chart-label">{data.month}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Revenue Chart */}
                <div className="card">
                    <div className="card-header">
                        <h3>Revenue Trend</h3>
                        <div className="chart-legend">
                            <span className="legend-item"><span className="dot success"></span> Revenue</span>
                        </div>
                    </div>
                    <div className="analytics-chart-container">
                        {revenueData.map((data, index) => (
                            <div key={index} className="chart-bar-wrapper">
                                <div
                                    className="chart-bar"
                                    style={{
                                        height: `${(data.amount / maxRevenue) * 100}%`,
                                        background: 'var(--color-success)'
                                    }}
                                    title={`₹${(data.amount / 1000).toFixed(1)}K`}
                                >
                                    <span className="chart-tooltip">₹{(data.amount / 1000).toFixed(1)}K</span>
                                </div>
                                <span className="chart-label">{data.month}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Activity Table (Simplified) */}
            <div className="card">
                <div className="card-header">
                    <h3>Recent Platform Activity</h3>
                </div>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Activity</th>
                            <th>User</th>
                            <th>Type</th>
                            <th>Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>New Job Posted</td>
                            <td>TechCorp Inc.</td>
                            <td><span className="badge badge-purple">Job</span></td>
                            <td>2 mins ago</td>
                        </tr>
                        <tr>
                            <td>New User Registration</td>
                            <td>John Doe</td>
                            <td><span className="badge badge-primary">User</span></td>
                            <td>15 mins ago</td>
                        </tr>
                        <tr>
                            <td>Subscription Renewed</td>
                            <td>Design Studio</td>
                            <td><span className="badge badge-success">Billing</span></td>
                            <td>1 hour ago</td>
                        </tr>
                        <tr>
                            <td>Report Filed</td>
                            <td>Jane Smith</td>
                            <td><span className="badge badge-danger">Moderation</span></td>
                            <td>3 hours ago</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AnalyticsPage;
