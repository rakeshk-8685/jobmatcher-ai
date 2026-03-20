// ============================================
// AI Matching Page - AI-powered candidate matching
// ============================================

import React, { useState } from 'react';
import {
    Sparkles,
    Search,
    Filter,
    Users,
    TrendingUp,
    Star,
    Mail,
    Phone,
    ChevronDown,
    ChevronUp,
    Eye,
    MessageSquare,
    CheckCircle,
    Clock,
    Briefcase,
    MapPin,
    Zap
} from 'lucide-react';
import '../user/DashboardPages.css';
import './RecruiterPages.css';

interface Candidate {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    location: string;
    experience: string;
    matchScore: number;
    skills: string[];
    status: 'new' | 'reviewed' | 'shortlisted' | 'contacted' | 'rejected';
    appliedFor: string;
    resumeUrl?: string;
}

const AIMatchingPage: React.FC = () => {
    const [selectedJob, setSelectedJob] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [minScore, setMinScore] = useState(0);
    const [expandedCandidate, setExpandedCandidate] = useState<string | null>(null);

    // Mock data
    const jobs = [
        { id: '1', title: 'Senior Frontend Developer', applicants: 45 },
        { id: '2', title: 'Full Stack Engineer', applicants: 32 },
        { id: '3', title: 'DevOps Engineer', applicants: 28 },
        { id: '4', title: 'Product Manager', applicants: 21 }
    ];

    const mockCandidates: Candidate[] = [
        {
            id: '1', name: 'Sarah Johnson', email: 'sarah.j@email.com', phone: '+1 555-0101',
            role: 'Senior Frontend Developer', location: 'San Francisco, CA', experience: '6 years',
            matchScore: 96, skills: ['React', 'TypeScript', 'Node.js', 'GraphQL', 'AWS'],
            status: 'new', appliedFor: 'Senior Frontend Developer'
        },
        {
            id: '2', name: 'Michael Chen', email: 'mchen@email.com', phone: '+1 555-0102',
            role: 'Full Stack Engineer', location: 'New York, NY', experience: '5 years',
            matchScore: 92, skills: ['React', 'Python', 'PostgreSQL', 'Docker', 'Kubernetes'],
            status: 'shortlisted', appliedFor: 'Full Stack Engineer'
        },
        {
            id: '3', name: 'Emily Rodriguez', email: 'emily.r@email.com', phone: '+1 555-0103',
            role: 'React Developer', location: 'Austin, TX', experience: '4 years',
            matchScore: 88, skills: ['React', 'JavaScript', 'Redux', 'CSS', 'Jest'],
            status: 'reviewed', appliedFor: 'Senior Frontend Developer'
        },
        {
            id: '4', name: 'David Kim', email: 'dkim@email.com', phone: '+1 555-0104',
            role: 'Backend Developer', location: 'Seattle, WA', experience: '7 years',
            matchScore: 85, skills: ['Node.js', 'Python', 'MongoDB', 'Redis', 'AWS'],
            status: 'contacted', appliedFor: 'Full Stack Engineer'
        },
        {
            id: '5', name: 'Jessica Thompson', email: 'jthompson@email.com', phone: '+1 555-0105',
            role: 'DevOps Engineer', location: 'Denver, CO', experience: '5 years',
            matchScore: 82, skills: ['Docker', 'Kubernetes', 'Terraform', 'AWS', 'CI/CD'],
            status: 'new', appliedFor: 'DevOps Engineer'
        },
        {
            id: '6', name: 'Ryan Patel', email: 'rpatel@email.com', phone: '+1 555-0106',
            role: 'Software Engineer', location: 'Chicago, IL', experience: '3 years',
            matchScore: 78, skills: ['JavaScript', 'React', 'Node.js', 'SQL'],
            status: 'new', appliedFor: 'Senior Frontend Developer'
        }
    ];

    const [allCandidates, setAllCandidates] = useState<Candidate[]>(mockCandidates);

    React.useEffect(() => {
        try {
            const storedStr = localStorage.getItem('jobmatcher_saved_candidates');
            if (storedStr) {
                const storedCandidates = JSON.parse(storedStr);
                setAllCandidates([...storedCandidates, ...mockCandidates]);
            }
        } catch (e) {
            console.error('Failed to load saved candidates from localStorage', e);
        }
    }, []);

    const getScoreColor = (score: number) => {
        if (score >= 90) return 'excellent';
        if (score >= 75) return 'good';
        if (score >= 60) return 'partial';
        return 'poor';
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'new': return 'new';
            case 'reviewed': return 'pending';
            case 'shortlisted': return 'success';
            case 'contacted': return 'active';
            case 'rejected': return 'rejected';
            default: return '';
        }
    };

    const filteredCandidates = allCandidates.filter(c => {
        const matchesJob = selectedJob === 'all' || c.appliedFor === jobs.find(j => j.id === selectedJob)?.title;
        const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
        const matchesScore = c.matchScore >= minScore;
        return matchesJob && matchesSearch && matchesStatus && matchesScore;
    });

    const stats = {
        total: allCandidates.length,
        excellent: allCandidates.filter(c => c.matchScore >= 90).length,
        good: allCandidates.filter(c => c.matchScore >= 75 && c.matchScore < 90).length,
        new: allCandidates.filter(c => c.status === 'new').length
    };

    return (
        <div className="dashboard-page">
            <div className="page-header">
                <div className="page-header-content">
                    <h1 className="page-title">
                        <Sparkles size={28} />
                        AI-Powered Candidate Matching
                    </h1>
                    <p className="page-subtitle">Find the best candidates ranked by AI match score</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid four-col">
                <div className="stat-card-box">
                    <div className="stat-icon primary"><Users size={24} /></div>
                    <div>
                        <p className="stat-value-lg">{stats.total}</p>
                        <p className="stat-label-lg">Total Candidates</p>
                    </div>
                </div>
                <div className="stat-card-box">
                    <div className="stat-icon success"><TrendingUp size={24} /></div>
                    <div>
                        <p className="stat-value-lg">{stats.excellent}</p>
                        <p className="stat-label-lg">Excellent Match (90%+)</p>
                    </div>
                </div>
                <div className="stat-card-box">
                    <div className="stat-icon warning"><Star size={24} /></div>
                    <div>
                        <p className="stat-value-lg">{stats.good}</p>
                        <p className="stat-label-lg">Good Match (75%+)</p>
                    </div>
                </div>
                <div className="stat-card-box">
                    <div className="stat-icon accent"><Zap size={24} /></div>
                    <div>
                        <p className="stat-value-lg">{stats.new}</p>
                        <p className="stat-label-lg">New Candidates</p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="card filters-card">
                <div className="filters-row">
                    <div className="filter-group">
                        <label><Briefcase size={14} /> Job Posting</label>
                        <select
                            className="form-input"
                            value={selectedJob}
                            onChange={(e) => setSelectedJob(e.target.value)}
                        >
                            <option value="all">All Jobs</option>
                            {jobs.map(job => (
                                <option key={job.id} value={job.id}>
                                    {job.title} ({job.applicants})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="filter-group">
                        <label><Search size={14} /> Search</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Name or skill..."
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
                            <option value="new">New</option>
                            <option value="reviewed">Reviewed</option>
                            <option value="shortlisted">Shortlisted</option>
                            <option value="contacted">Contacted</option>
                        </select>
                    </div>
                    <div className="filter-group">
                        <label><TrendingUp size={14} /> Min Score</label>
                        <select
                            className="form-input"
                            value={minScore}
                            onChange={(e) => setMinScore(Number(e.target.value))}
                        >
                            <option value={0}>All Scores</option>
                            <option value={90}>90%+ (Excellent)</option>
                            <option value={75}>75%+ (Good)</option>
                            <option value={60}>60%+ (Partial)</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Candidates List */}
            <div className="candidates-list">
                {filteredCandidates.map(candidate => (
                    <div key={candidate.id} className="candidate-card card">
                        <div
                            className="candidate-main"
                            onClick={() => setExpandedCandidate(
                                expandedCandidate === candidate.id ? null : candidate.id
                            )}
                        >
                            <div className="candidate-left">
                                <div className="candidate-avatar">
                                    {candidate.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div className="candidate-info">
                                    <h3 className="candidate-name">{candidate.name}</h3>
                                    <p className="candidate-role">{candidate.role}</p>
                                    <div className="candidate-meta">
                                        <span><MapPin size={12} /> {candidate.location}</span>
                                        <span><Briefcase size={12} /> {candidate.experience}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="candidate-center">
                                <div className="candidate-skills">
                                    {candidate.skills.slice(0, 4).map(skill => (
                                        <span key={skill} className="skill-chip small">{skill}</span>
                                    ))}
                                    {candidate.skills.length > 4 && (
                                        <span className="skill-chip more">+{candidate.skills.length - 4}</span>
                                    )}
                                </div>
                            </div>
                            <div className="candidate-right">
                                <div className={`match-score-badge ${getScoreColor(candidate.matchScore)}`}>
                                    <Sparkles size={14} />
                                    {candidate.matchScore}% Match
                                </div>
                                <span className={`status-badge ${getStatusStyle(candidate.status)}`}>
                                    {candidate.status}
                                </span>
                                {expandedCandidate === candidate.id ? (
                                    <ChevronUp size={20} className="expand-icon" />
                                ) : (
                                    <ChevronDown size={20} className="expand-icon" />
                                )}
                            </div>
                        </div>

                        {expandedCandidate === candidate.id && (
                            <div className="candidate-expanded">
                                <div className="expanded-grid">
                                    <div className="expanded-section">
                                        <h4>Contact Information</h4>
                                        <p><Mail size={14} /> {candidate.email}</p>
                                        <p><Phone size={14} /> {candidate.phone}</p>
                                    </div>
                                    <div className="expanded-section">
                                        <h4>Applied For</h4>
                                        <p><Briefcase size={14} /> {candidate.appliedFor}</p>
                                        <p><Clock size={14} /> Applied 2 days ago</p>
                                    </div>
                                    <div className="expanded-section">
                                        <h4>All Skills</h4>
                                        <div className="skills-list">
                                            {candidate.skills.map(skill => (
                                                <span key={skill} className="skill-chip">{skill}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="candidate-actions">
                                    <button className="btn btn-ghost">
                                        <Eye size={16} /> View Resume
                                    </button>
                                    <button className="btn btn-secondary">
                                        <MessageSquare size={16} /> Message
                                    </button>
                                    <button className="btn btn-primary">
                                        <CheckCircle size={16} /> Shortlist
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                {filteredCandidates.length === 0 && (
                    <div className="empty-state card">
                        <Users size={48} />
                        <h3>No candidates found</h3>
                        <p>Try adjusting your filters to see more results</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AIMatchingPage;
