// ============================================
// User Profile Page
// ============================================

import React, { useState } from 'react';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Briefcase,
    GraduationCap,
    Award,
    Save,
    Upload,
    Edit2,
    Github,
    Linkedin,
    Globe
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { mockCandidateProfile } from '../../data/mockData';
import '../user/Dashboard.css';

const ProfilePage: React.FC = () => {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const profile = mockCandidateProfile;

    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: '+1 (555) 123-4567',
        location: 'San Francisco, CA',
        headline: profile.headline,
        summary: profile.summary,
        linkedIn: 'linkedin.com/in/johndeveloper',
        github: 'github.com/johndeveloper',
        portfolio: 'johndeveloper.com'
    });

    const handleSave = () => {
        setIsEditing(false);
        // In production: API call to save profile
    };

    return (
        <div className="dashboard-page">
            <div className="page-header">
                <div>
                    <h1 className="dashboard-title">My Profile</h1>
                    <p className="dashboard-subtitle">Manage your personal information and preferences</p>
                </div>
                <button
                    className={`btn ${isEditing ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                >
                    {isEditing ? <><Save size={18} /> Save Changes</> : <><Edit2 size={18} /> Edit Profile</>}
                </button>
            </div>

            <div className="profile-grid">
                {/* Profile Card */}
                <div className="card profile-card">
                    <div className="profile-header">
                        <div className="profile-avatar-large">
                            {user?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        {isEditing && (
                            <button className="btn btn-sm btn-secondary upload-btn">
                                <Upload size={14} /> Upload Photo
                            </button>
                        )}
                    </div>

                    <div className="profile-info">
                        {isEditing ? (
                            <input
                                type="text"
                                className="input profile-name-input"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        ) : (
                            <h2>{formData.name}</h2>
                        )}

                        {isEditing ? (
                            <input
                                type="text"
                                className="input"
                                value={formData.headline}
                                onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                            />
                        ) : (
                            <p className="profile-headline">{formData.headline}</p>
                        )}
                    </div>

                    <div className="profile-contact">
                        <div className="contact-item">
                            <Mail size={16} />
                            <span>{formData.email}</span>
                        </div>
                        <div className="contact-item">
                            <Phone size={16} />
                            {isEditing ? (
                                <input
                                    type="text"
                                    className="input input-sm"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            ) : (
                                <span>{formData.phone}</span>
                            )}
                        </div>
                        <div className="contact-item">
                            <MapPin size={16} />
                            {isEditing ? (
                                <input
                                    type="text"
                                    className="input input-sm"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                />
                            ) : (
                                <span>{formData.location}</span>
                            )}
                        </div>
                    </div>

                    <div className="profile-social">
                        <a href="#" className="social-link"><Linkedin size={18} /></a>
                        <a href="#" className="social-link"><Github size={18} /></a>
                        <a href="#" className="social-link"><Globe size={18} /></a>
                    </div>
                </div>

                {/* About Section */}
                <div className="card">
                    <h3 className="card-title">About</h3>
                    {isEditing ? (
                        <textarea
                            className="input textarea"
                            rows={4}
                            value={formData.summary}
                            onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                        />
                    ) : (
                        <p className="profile-summary">{formData.summary}</p>
                    )}
                </div>

                {/* Experience Section */}
                <div className="card">
                    <h3 className="card-title">
                        <Briefcase size={18} /> Experience
                    </h3>
                    {profile.experience.map((exp) => (
                        <div key={exp.id} className="experience-item">
                            <div className="exp-icon"><Briefcase size={18} /></div>
                            <div className="exp-content">
                                <h4>{exp.title}</h4>
                                <p className="exp-company">{exp.company} • {exp.location}</p>
                                <p className="exp-dates">
                                    {new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} -
                                    {exp.current ? ' Present' : new Date(exp.endDate!).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                </p>
                                <p className="exp-description">{exp.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Education Section */}
                <div className="card">
                    <h3 className="card-title">
                        <GraduationCap size={18} /> Education
                    </h3>
                    {profile.education.map((edu) => (
                        <div key={edu.id} className="experience-item">
                            <div className="exp-icon"><GraduationCap size={18} /></div>
                            <div className="exp-content">
                                <h4>{edu.degree} in {edu.field}</h4>
                                <p className="exp-company">{edu.institution}</p>
                                <p className="exp-dates">
                                    Graduated {new Date(edu.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                    {edu.grade && ` • ${edu.grade}`}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Skills Section */}
                <div className="card">
                    <h3 className="card-title">
                        <Award size={18} /> Skills
                    </h3>
                    <div className="skills-grid">
                        {profile.skills.map((skill) => (
                            <div key={skill.name} className="skill-item">
                                <span className="skill-name">{skill.name}</span>
                                <span className={`skill-level ${skill.level}`}>{skill.level}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
