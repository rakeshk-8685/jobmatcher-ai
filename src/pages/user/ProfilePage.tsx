// ============================================
// User Profile Page
// ============================================

import React, { useState, useEffect } from 'react';
import {
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
// import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';
import '../user/Dashboard.css';

const ProfilePage: React.FC = () => {
    // const { user: authUser } = useAuth(); // removed unused
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Initial form state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        location: '',
        headline: '',
        summary: '',
        linkedIn: '',
        github: '',
        portfolio: ''
    });

    const [profileData, setProfileData] = useState<any>(null); // Store full profile object

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setIsLoading(true);
                const response = await userService.getProfile();
                const user = response.data;
                setProfileData(user);

                // Initialize form data from backend response
                // Handle different data structures for differnet roles if needed
                // For now, map based on the backend schema we implemented
                const publicProfile = user.profile || {};

                setFormData({
                    name: user.name || '',
                    email: user.email || '',
                    phone: publicProfile.phone || '',
                    location: publicProfile.location || '',
                    headline: publicProfile.title || '', // Mapping title to headline
                    summary: publicProfile.bio || '',
                    linkedIn: publicProfile.linkedIn || '',
                    github: publicProfile.github || '',
                    portfolio: publicProfile.portfolio || ''
                });

            } catch (err) {
                console.error("Failed to load profile", err);
                setError("Failed to load profile data");
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleSave = async () => {
        try {
            setIsLoading(true);
            await userService.updateProfile({
                name: formData.name,
                // We are sending flattened fields as per our controller logic for 'user' role
                // But generally keys should match what controller expects
                headline: formData.headline, // Controller maps this to profile.title
                summary: formData.summary,   // Controller maps this to profile.bio
                phone: formData.phone,
                location: formData.location,
                linkedIn: formData.linkedIn,
                github: formData.github,
                portfolio: formData.portfolio
            });
            setIsEditing(false);
            // Optionally refetch or just rely on local state update if we trust it
            // fetchProfile(); 
        } catch (err) {
            console.error("Failed to save profile", err);
            setError("Failed to save profile changes");
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading && !profileData) return <div className="p-8 text-center">Loading profile...</div>;

    // Use mock data fallback for complex arrays if not yet in DB, or empty array
    // The previous mockCandidateProfile had experience/education/skills. 
    // We'll use profileData.profile.experience if available, else empty or fallback if you want to keep data visible for demo
    const experience = profileData?.profile?.experience || [];
    const education = profileData?.profile?.education || [];
    const skills: any[] = profileData?.profile?.skills || []; // schema says string[], mock said object with level

    return (
        <div className="dashboard-page">
            <div className="page-header">
                <div>
                    <h1 className="dashboard-title">My Profile</h1>
                    <p className="dashboard-subtitle">Manage your personal information and preferences</p>
                </div>
            </div>

            {error && <div className="alert alert-error" style={{ marginBottom: '1rem', color: 'red', padding: '1rem', background: '#fee' }}>{error}</div>}

            <div className="profile-grid">
                {/* Profile Card */}
                <div className="card profile-card">
                    <div className="profile-card-header">
                        <button
                            className={`btn ${isEditing ? 'btn-primary' : 'btn-secondary'} btn-edit-profile`}
                            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                            disabled={isLoading}
                        >
                            {isEditing ? <><Save size={16} /> Save</> : <><Edit2 size={16} /> Edit</>}
                        </button>
                    </div>
                    <div className="profile-header">
                        <div className="profile-avatar-large">
                            {formData.name?.charAt(0).toUpperCase() || 'U'}
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
                                placeholder="Your Name"
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
                                placeholder="Professional Headline"
                            />
                        ) : (
                            <p className="profile-headline">{formData.headline || 'No headline set'}</p>
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
                                    placeholder="Phone Number"
                                />
                            ) : (
                                <span>{formData.phone || 'No phone'}</span>
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
                                    placeholder="Location"
                                />
                            ) : (
                                <span>{formData.location || 'No location'}</span>
                            )}
                        </div>
                    </div>

                    <div className="profile-social">
                        {isEditing ? (
                            <div className="social-edit-list">
                                <div className="social-edit-item">
                                    <Linkedin size={16} />
                                    <input
                                        type="text"
                                        className="input input-sm"
                                        placeholder="LinkedIn URL"
                                        value={formData.linkedIn}
                                        onChange={(e) => setFormData({ ...formData, linkedIn: e.target.value })}
                                    />
                                </div>
                                <div className="social-edit-item">
                                    <Github size={16} />
                                    <input
                                        type="text"
                                        className="input input-sm"
                                        placeholder="GitHub URL"
                                        value={formData.github}
                                        onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                                    />
                                </div>
                                <div className="social-edit-item">
                                    <Globe size={16} />
                                    <input
                                        type="text"
                                        className="input input-sm"
                                        placeholder="Portfolio URL"
                                        value={formData.portfolio}
                                        onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                                    />
                                </div>
                            </div>
                        ) : (
                            <>
                                {formData.linkedIn && <a href={`https://${formData.linkedIn.replace('https://', '')}`} target="_blank" rel="noopener noreferrer" className="social-link" title={formData.linkedIn}><Linkedin size={18} /></a>}
                                {formData.github && <a href={`https://${formData.github.replace('https://', '')}`} target="_blank" rel="noopener noreferrer" className="social-link" title={formData.github}><Github size={18} /></a>}
                                {formData.portfolio && <a href={`https://${formData.portfolio.replace('https://', '')}`} target="_blank" rel="noopener noreferrer" className="social-link" title={formData.portfolio}><Globe size={18} /></a>}
                            </>
                        )}
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
                            placeholder="Tell us about yourself..."
                        />
                    ) : (
                        <p className="profile-summary">{formData.summary || 'No summary provided.'}</p>
                    )}
                </div>

                {/* Experience Section - Only showing if data exists or we add edit functionality for it later */}
                {/* For now, we are just hiding the mock data if real data is empty, to not confuse user */}
                <div className="card">
                    <h3 className="card-title">
                        <Briefcase size={18} /> Experience
                    </h3>
                    {experience.length > 0 ? experience.map((exp: any, index: number) => (
                        <div key={index} className="experience-item">
                            <div className="exp-icon"><Briefcase size={18} /></div>
                            <div className="exp-content">
                                <h4>{exp.title}</h4>
                                <p className="exp-company">{exp.company} • {exp.location}</p>
                                <p className="exp-dates">
                                    {exp.startDate && new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} -
                                    {exp.current ? ' Present' : (exp.endDate && new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }))}
                                </p>
                                <p className="exp-description">{exp.description}</p>
                            </div>
                        </div>
                    )) : (
                        <p style={{ color: '#888', fontStyle: 'italic' }}>No experience listed.</p>
                    )}
                </div>

                {/* Education Section */}
                <div className="card">
                    <h3 className="card-title">
                        <GraduationCap size={18} /> Education
                    </h3>
                    {education.length > 0 ? education.map((edu: any, index: number) => (
                        <div key={index} className="experience-item">
                            <div className="exp-icon"><GraduationCap size={18} /></div>
                            <div className="exp-content">
                                <h4>{edu.degree} in {edu.field}</h4>
                                <p className="exp-company">{edu.institution}</p>
                                <p className="exp-dates">
                                    Graduated {edu.endDate && new Date(edu.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                </p>
                            </div>
                        </div>
                    )) : (
                        <p style={{ color: '#888', fontStyle: 'italic' }}>No education listed.</p>
                    )}
                </div>

                {/* Skills Section */}
                <div className="card">
                    <h3 className="card-title">
                        <Award size={18} /> Skills
                    </h3>
                    <div className="skills-grid">
                        {skills.length > 0 ? skills.map((skill: any, index: number) => (
                            <div key={index} className="skill-item">
                                {/* Handling both string and object skill formats just in case */}
                                <span className="skill-name">{typeof skill === 'string' ? skill : skill.name}</span>
                                {typeof skill !== 'string' && skill.level && <span className={`skill-level ${skill.level}`}>{skill.level}</span>}
                            </div>
                        )) : (
                            <p style={{ color: '#888', fontStyle: 'italic' }}>No skills listed.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
