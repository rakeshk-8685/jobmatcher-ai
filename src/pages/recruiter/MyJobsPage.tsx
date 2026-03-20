// ============================================
// My Jobs Page - Manage all job postings
// ============================================

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Briefcase,
    PlusCircle,
    Search,
    Filter,
    Eye,
    Edit,
    Trash2,
    Users,
    TrendingUp,
    MapPin,
    IndianRupee,
    Clock,
    MoreVertical,
    Copy,
    Pause,
    Play,
    CheckCircle,
    AlertCircle
} from 'lucide-react';
import { getMyJobs, type JobData } from '../../services/jobs';
import '../user/DashboardPages.css';
import './RecruiterPages.css';

interface Job {
    id: string;
    _id?: string;
    title: string;
    company: string;
    location: string;
    type: string;
    salary: { min: number; max: number };
    status: 'active' | 'paused' | 'closed' | 'draft' | 'pending' | 'rejected';
    applicationsCount: number;
    viewsCount: number;
    createdAt: string;
    skills: string[];
}

const MyJobsPage: React.FC = () => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [activeMenu, setActiveMenu] = useState<string | null>(null);

    // Fetch jobs from API
    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const data = await getMyJobs();
                setJobs(data.map((job: JobData) => ({
                    id: job._id || job.id || '',
                    _id: job._id,
                    title: job.title,
                    company: job.company,
                    location: job.location,
                    type: job.type,
                    salary: job.salary,
                    status: job.status || 'active',
                    applicationsCount: job.applicationsCount || 0,
                    viewsCount: job.viewsCount || 0,
                    createdAt: job.createdAt || new Date().toISOString(),
                    skills: job.skills || []
                })));
            } catch (error) {
                console.error('Error fetching jobs:', error);
            }
        };
        fetchJobs();
    }, []);

    const stats = {
        total: jobs.length,
        active: jobs.filter(j => j.status === 'active').length,
        applications: jobs.reduce((sum, j) => sum + (j.applicationsCount || 0), 0),
        views: jobs.reduce((sum, j) => sum + (j.viewsCount || 0), 0)
    };


    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'active': return <CheckCircle size={14} />;
            case 'paused': return <Pause size={14} />;
            case 'closed': return <AlertCircle size={14} />;
            case 'draft': return <Edit size={14} />;
            default: return null;
        }
    };

    const filteredJobs = jobs.filter(job => {
        const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.location.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleAction = (action: string, jobId: string) => {
        console.log(`Action: ${action} for job: ${jobId}`);
        setActiveMenu(null);
        // Handle actions here
    };

    return (
        <div className="dashboard-page">
            <div className="page-header">
                <div className="page-header-content">
                    <h1 className="page-title">
                        <Briefcase size={28} />
                        My Job Postings
                    </h1>
                    <p className="page-subtitle">Manage and track all your job listings</p>
                </div>
                <Link to="/recruiter/post-job" className="btn btn-primary">
                    <PlusCircle size={18} />
                    Post New Job
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid four-col">
                <div className="stat-card-box">
                    <div className="stat-icon primary"><Briefcase size={24} /></div>
                    <div>
                        <p className="stat-value-lg">{stats.total}</p>
                        <p className="stat-label-lg">Total Jobs</p>
                    </div>
                </div>
                <div className="stat-card-box">
                    <div className="stat-icon success"><CheckCircle size={24} /></div>
                    <div>
                        <p className="stat-value-lg">{stats.active}</p>
                        <p className="stat-label-lg">Active Jobs</p>
                    </div>
                </div>
                <div className="stat-card-box">
                    <div className="stat-icon warning"><Users size={24} /></div>
                    <div>
                        <p className="stat-value-lg">{stats.applications}</p>
                        <p className="stat-label-lg">Total Applications</p>
                    </div>
                </div>
                <div className="stat-card-box">
                    <div className="stat-icon accent"><Eye size={24} /></div>
                    <div>
                        <p className="stat-value-lg">{stats.views.toLocaleString()}</p>
                        <p className="stat-label-lg">Total Views</p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="card filters-card">
                <div className="filters-row">
                    <div className="filter-group grow">
                        <label><Search size={14} /> Search Jobs</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Search by title or location..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="filter-group">
                        <label><Filter size={14} /> Status</label>
                        <select
                            className="form-input"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="paused">Paused</option>
                            <option value="closed">Closed</option>
                            <option value="draft">Draft</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Jobs Grid */}
            <div className="jobs-grid">
                {filteredJobs.map(job => (
                    <div key={job.id} className={`job-card card ${job.status}`}>
                        <div className="job-card-header">
                            <div className="job-card-title">
                                <h3>{job.title}</h3>
                                <p className="job-company">{job.company}</p>
                            </div>
                            <div className="job-card-menu">
                                <button
                                    className="btn-icon"
                                    onClick={() => setActiveMenu(activeMenu === job.id ? null : job.id)}
                                >
                                    <MoreVertical size={18} />
                                </button>
                                {activeMenu === job.id && (
                                    <div className="dropdown-menu">
                                        <button onClick={() => handleAction('view', job.id)}>
                                            <Eye size={14} /> View Details
                                        </button>
                                        <button onClick={() => handleAction('edit', job.id)}>
                                            <Edit size={14} /> Edit Job
                                        </button>
                                        <button onClick={() => handleAction('duplicate', job.id)}>
                                            <Copy size={14} /> Duplicate
                                        </button>
                                        {job.status === 'active' ? (
                                            <button onClick={() => handleAction('pause', job.id)}>
                                                <Pause size={14} /> Pause
                                            </button>
                                        ) : job.status === 'paused' && (
                                            <button onClick={() => handleAction('activate', job.id)}>
                                                <Play size={14} /> Activate
                                            </button>
                                        )}
                                        <button className="danger" onClick={() => handleAction('delete', job.id)}>
                                            <Trash2 size={14} /> Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="job-card-meta">
                            <span><MapPin size={14} /> {job.location}</span>
                            <span><IndianRupee size={14} /> ₹{job.salary?.min ? (job.salary.min / 100000).toFixed(1) : 0}L - ₹{job.salary?.max ? (job.salary.max / 100000).toFixed(1) : 0}L</span>
                            <span><Clock size={14} /> {new Date(job.createdAt).toLocaleDateString()}</span>
                        </div>

                        <div className="job-card-skills">
                            {job.skills.slice(0, 3).map(skill => (
                                <span key={skill} className="skill-chip small">{skill}</span>
                            ))}
                            {job.skills.length > 3 && (
                                <span className="skill-chip more">+{job.skills.length - 3}</span>
                            )}
                        </div>

                        <div className="job-card-stats">
                            <div className="job-stat">
                                <Users size={16} />
                                <span className="stat-number">{job.applicationsCount}</span>
                                <span className="stat-label">Applications</span>
                            </div>
                            <div className="job-stat">
                                <Eye size={16} />
                                <span className="stat-number">{job.viewsCount}</span>
                                <span className="stat-label">Views</span>
                            </div>
                            <div className="job-stat">
                                <TrendingUp size={16} />
                                <span className="stat-number">{job.viewsCount > 0 ? Math.round(job.applicationsCount / job.viewsCount * 100) : 0}%</span>
                                <span className="stat-label">Apply Rate</span>
                            </div>
                        </div>

                        <div className="job-card-footer">
                            <span className={`status-badge ${job.status}`}>
                                {getStatusIcon(job.status)}
                                {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                            </span>
                            <Link to={`/recruiter/applicants?job=${job.id}`} className="btn btn-secondary btn-sm">
                                <Users size={14} /> View Applicants
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            {filteredJobs.length === 0 && (
                <div className="empty-state card">
                    <Briefcase size={48} />
                    <h3>No jobs found</h3>
                    <p>Try adjusting your filters or create a new job posting</p>
                    <Link to="/recruiter/post-job" className="btn btn-primary">
                        <PlusCircle size={18} /> Post New Job
                    </Link>
                </div>
            )}
        </div>
    );
};

export default MyJobsPage;
