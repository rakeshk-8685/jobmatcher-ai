// ============================================
// Jobs Page - Public job listings
// ============================================

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Search,
    MapPin,
    Briefcase,
    Clock,
    DollarSign,
    Filter,
    Sparkles,
    ArrowRight,
    Loader2
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { getJobs, type JobData } from '../services/jobs';
import './LandingPage.css';

const JobsPage: React.FC = () => {
    const [jobs, setJobs] = useState<JobData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const [typeFilter, setTypeFilter] = useState('');

    // Fetch jobs from API on mount
    useEffect(() => {
        const fetchJobs = async () => {
            setLoading(true);
            try {
                const data = await getJobs();
                setJobs(data);
            } catch (error) {
                console.error('Error fetching jobs:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, []);

    const filteredJobs = jobs.filter(job => {
        const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.skills?.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesLocation = !locationFilter || job.location.toLowerCase().includes(locationFilter.toLowerCase());
        const matchesType = !typeFilter || job.type === typeFilter;

        return matchesSearch && matchesLocation && matchesType;
    });

    return (
        <div className="landing-page">
            <Navbar />

            <main className="jobs-page-content">
                <div className="container">
                    {/* Header */}
                    <div className="jobs-header">
                        <h1>Find Your Perfect Job</h1>
                        <p>Browse {jobs.length}+ opportunities matched to your skills</p>
                    </div>

                    {/* Search Bar */}
                    <div className="jobs-search-bar">
                        <div className="search-input-wrapper">
                            <Search size={20} />
                            <input
                                type="text"
                                placeholder="Search jobs, skills, or companies..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="input"
                            />
                        </div>
                        <div className="search-input-wrapper">
                            <MapPin size={20} />
                            <input
                                type="text"
                                placeholder="Location"
                                value={locationFilter}
                                onChange={(e) => setLocationFilter(e.target.value)}
                                className="input"
                            />
                        </div>
                        <select
                            className="input select"
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                        >
                            <option value="">All Types</option>
                            <option value="full-time">Full Time</option>
                            <option value="part-time">Part Time</option>
                            <option value="remote">Remote</option>
                            <option value="contract">Contract</option>
                        </select>
                        <button className="btn btn-primary">
                            <Filter size={18} />
                            Filter
                        </button>
                    </div>

                    {/* Results Count */}
                    <p className="jobs-results-count">
                        Showing {filteredJobs.length} of {jobs.length} jobs
                    </p>

                    {/* Job Listings */}
                    <div className="jobs-grid">
                        {filteredJobs.map((job) => (
                            <div key={job._id || job.id} className="job-listing-card card">
                                <div className="job-listing-header">
                                    <div className="job-company-logo">
                                        {job.company.charAt(0)}
                                    </div>
                                    <div className="job-listing-info">
                                        <h3>{job.title}</h3>
                                        <p className="job-company-name">{job.company}</p>
                                    </div>
                                </div>

                                <div className="job-listing-meta">
                                    <span><MapPin size={14} /> {job.location}</span>
                                    <span><Briefcase size={14} /> {job.type}</span>
                                    <span><Clock size={14} /> {job.experienceLevel}</span>
                                    <span>
                                        <DollarSign size={14} />
                                        ${job.salary?.min ? (job.salary.min / 1000).toFixed(0) : 0}k - ${job.salary?.max ? (job.salary.max / 1000).toFixed(0) : 0}k
                                    </span>
                                </div>

                                <p className="job-listing-description">{job.description}</p>

                                <div className="job-listing-skills">
                                    {job.skills.slice(0, 4).map((skill) => (
                                        <span key={skill} className="skill-tag">{skill}</span>
                                    ))}
                                    {job.skills.length > 4 && (
                                        <span className="skill-tag more">+{job.skills.length - 4}</span>
                                    )}
                                </div>

                                <div className="job-listing-footer">
                                    <span className="job-posted-date">
                                        Posted {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'Recently'}
                                    </span>
                                    <Link to="/login" className="btn btn-primary btn-sm">
                                        Apply Now <ArrowRight size={16} />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredJobs.length === 0 && (
                        <div className="no-results">
                            <p>No jobs found matching your criteria.</p>
                            <button
                                className="btn btn-secondary"
                                onClick={() => {
                                    setSearchTerm('');
                                    setLocationFilter('');
                                    setTypeFilter('');
                                }}
                            >
                                Clear Filters
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default JobsPage;
