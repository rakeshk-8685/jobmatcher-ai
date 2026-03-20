// ============================================
// User Management Page - Admin
// Manage platform users, roles, and status
// ============================================

import React, { useState } from 'react';
import {
    Search,
    Filter,
    MoreVertical,
    Shield,
    Trash2,
    CheckCircle,
    XCircle,
    Mail,
    User,
    Briefcase,
    AlertTriangle,
    Download
} from 'lucide-react';
import { mockUsers } from '../../data/mockData';
import '../user/Dashboard.css';
import './AdminPages.css';

// Extended mock user for admin view
const adminMockUsers = [
    { ...mockUsers[0], status: 'active', reports: 0 },
    { ...mockUsers[1], status: 'active', reports: 0 },
    { ...mockUsers[2], status: 'active', reports: 0 },
    {
        id: 'usr-4',
        name: 'Bad Actor',
        email: 'spammer@email.com',
        role: 'user',
        status: 'suspended',
        createdAt: new Date('2024-03-10'),
        reports: 12
    },
    {
        id: 'usr-5',
        name: 'New Recruiter',
        email: 'hiring@startup.io',
        role: 'recruiter',
        status: 'pending',
        createdAt: new Date('2024-03-15'),
        reports: 0
    },
    {
        id: 'usr-6',
        name: 'Jane Smith',
        email: 'jane@email.com',
        role: 'user',
        status: 'active',
        createdAt: new Date('2024-02-20'),
        reports: 1
    }
];

const UserManagementPage: React.FC = () => {
    const [users, setUsers] = useState(adminMockUsers);
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedUser, setSelectedUser] = useState<string | null>(null);

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = roleFilter === 'all' || user.role === roleFilter;
        const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
        return matchesSearch && matchesRole && matchesStatus;
    });

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'admin': return 'badge-primary';
            case 'recruiter': return 'badge-purple';
            default: return 'badge-gray';
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active': return 'status-active';
            case 'suspended': return 'status-rejected';
            case 'pending': return 'status-pending';
            default: return '';
        }
    };

    const handleAction = (action: string, userId: string) => {
        // Implement action logic
        if (action === 'suspend') {
            setUsers(users.map(u => u.id === userId ? { ...u, status: 'suspended' } : u));
        } else if (action === 'activate') {
            setUsers(users.map(u => u.id === userId ? { ...u, status: 'active' } : u));
        } else if (action === 'delete') {
            setUsers(users.filter(u => u.id !== userId));
        }
        setSelectedUser(null);
    };

    return (
        <div className="dashboard-page">
            <div className="page-header">
                <div>
                    <h1 className="dashboard-title">
                        <User size={28} /> User Management
                    </h1>
                    <p className="dashboard-subtitle">Manage user accounts and permissions</p>
                </div>
                <button className="btn btn-secondary">
                    <Download size={18} /> Export Users
                </button>
            </div>

            {/* Quick Stats */}
            <div className="stats-grid four-col">
                <div className="stat-card-box">
                    <div className="stat-icon primary"><User size={24} /></div>
                    <div>
                        <p className="stat-value-lg">{users.filter(u => u.role === 'user').length}</p>
                        <p className="stat-label-lg">Candidates</p>
                    </div>
                </div>
                <div className="stat-card-box">
                    <div className="stat-icon purple"><Briefcase size={24} /></div>
                    <div>
                        <p className="stat-value-lg">{users.filter(u => u.role === 'recruiter').length}</p>
                        <p className="stat-label-lg">Recruiters</p>
                    </div>
                </div>
                <div className="stat-card-box">
                    <div className="stat-icon warning"><Shield size={24} /></div>
                    <div>
                        <p className="stat-value-lg">{users.filter(u => u.role === 'admin').length}</p>
                        <p className="stat-label-lg">Admins</p>
                    </div>
                </div>
                <div className="stat-card-box">
                    <div className="stat-icon danger"><AlertTriangle size={24} /></div>
                    <div>
                        <p className="stat-value-lg">{users.filter(u => u.reports > 0 || u.status === 'suspended').length}</p>
                        <p className="stat-label-lg">Flagged</p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            {/* Filters */}
            <div className="admin-filters-card">
                <div className="admin-filters-row">
                    <div className="admin-filter-group grow">
                        <label><Search size={14} /> Search Users</label>
                        <div className="search-input-wrapper">
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Search by name or email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="admin-filter-group">
                        <label><Filter size={14} /> Role</label>
                        <select
                            className="form-input"
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                        >
                            <option value="all">All Roles</option>
                            <option value="user">Candidates</option>
                            <option value="recruiter">Recruiters</option>
                            <option value="admin">Admins</option>
                        </select>
                    </div>
                    <div className="admin-filter-group">
                        <label><Shield size={14} /> Status</label>
                        <select
                            className="form-input"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="pending">Pending</option>
                            <option value="suspended">Suspended</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="card no-padding">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Role & Email</th>
                            <th>Status</th>
                            <th>Joined</th>
                            <th>Reports</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user) => (
                            <tr key={user.id}>
                                <td>
                                    <div className="user-cell">
                                        <div className="user-cell-avatar">{user.name.charAt(0)}</div>
                                        <div className="user-info">
                                            <span className="user-cell-name">{user.name}</span>
                                            <span className="user-cell-id">ID: {user.id}</span>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className="role-email-cell">
                                        <span className={`badge ${getRoleBadge(user.role)}`}>{user.role}</span>
                                        <span className="email-text"><Mail size={12} /> {user.email}</span>
                                    </div>
                                </td>
                                <td>
                                    <span className={`status-badge ${getStatusBadge(user.status || 'active')}`}>
                                        {user.status || 'active'}
                                    </span>
                                </td>
                                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                <td>
                                    {user.reports > 0 ? (
                                        <span className="report-count danger">{user.reports} Reports</span>
                                    ) : (
                                        <span className="report-count safe">Clean</span>
                                    )}
                                </td>
                                <td>
                                    <div className="actions-cell">
                                        <button
                                            className="btn-icon"
                                            onClick={() => setSelectedUser(selectedUser === user.id ? null : user.id)}
                                        >
                                            <MoreVertical size={18} />
                                        </button>

                                        {selectedUser === user.id && (
                                            <div className="dropdown-menu">
                                                <button onClick={() => handleAction('view', user.id)}>
                                                    <User size={14} /> View Profile
                                                </button>
                                                {user.status !== 'active' && (
                                                    <button onClick={() => handleAction('activate', user.id)}>
                                                        <CheckCircle size={14} /> Activate User
                                                    </button>
                                                )}
                                                {user.status !== 'suspended' && (
                                                    <button className="warning" onClick={() => handleAction('suspend', user.id)}>
                                                        <XCircle size={14} /> Suspend User
                                                    </button>
                                                )}
                                                <button className="danger" onClick={() => handleAction('delete', user.id)}>
                                                    <Trash2 size={14} /> Delete Account
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredUsers.length === 0 && (
                    <div className="empty-state">
                        <User size={48} />
                        <h3>No users found</h3>
                        <p>Try adjusting your search or filters</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserManagementPage;
