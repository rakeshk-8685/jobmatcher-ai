// ============================================
// Post a Job Page - Premium Redesign
// Create new job postings with style
// ============================================

import React, { useState } from 'react';
import {
    Briefcase,
    MapPin,
    DollarSign,
    Clock,
    FileText,
    Code,
    GraduationCap,
    Users,
    Send,
    Save,
    Eye,
    Plus,
    X,
    Sparkles,
    CheckCircle,
    Building2,
    ChevronRight,
    ChevronLeft,
    Zap,
    Gift,
    Target,
    Rocket
} from 'lucide-react';
import '../user/DashboardPages.css';
import './PostJobPage.css';

interface JobFormData {
    title: string;
    company: string;
    location: string;
    type: 'full-time' | 'part-time' | 'contract' | 'remote';
    experience: 'entry' | 'mid' | 'senior' | 'lead';
    salary: { min: string; max: string };
    description: string;
    requirements: string[];
    skills: string[];
    benefits: string[];
}

const PostJobPage: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<JobFormData>({
        title: '',
        company: '',
        location: '',
        type: 'full-time',
        experience: 'mid',
        salary: { min: '', max: '' },
        description: '',
        requirements: [''],
        skills: [],
        benefits: []
    });

    const [newSkill, setNewSkill] = useState('');
    const [newBenefit, setNewBenefit] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPreview, setShowPreview] = useState(false);

    const steps = [
        { id: 1, title: 'Basic Info', icon: Briefcase },
        { id: 2, title: 'Details', icon: FileText },
        { id: 3, title: 'Skills', icon: Code },
        { id: 4, title: 'Review', icon: Rocket }
    ];

    // Skill suggestions with categories
    const skillCategories = {
        'Frontend': ['React', 'TypeScript', 'Vue.js', 'Angular', 'Next.js', 'CSS', 'Tailwind'],
        'Backend': ['Node.js', 'Python', 'Java', 'Go', 'Ruby', 'PHP', '.NET'],
        'Database': ['PostgreSQL', 'MongoDB', 'MySQL', 'Redis', 'Firebase'],
        'Cloud': ['AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes']
    };

    const benefitSuggestions = [
        '🏥 Health Insurance', '💰 401k Matching', '🏠 Remote Work',
        '📚 Learning Budget', '🏖️ Unlimited PTO', '💪 Gym Membership',
        '🍔 Free Lunch', '📱 Tech Allowance', '✈️ Travel Perks'
    ];

    const handleInputChange = (field: keyof JobFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSalaryChange = (type: 'min' | 'max', value: string) => {
        setFormData(prev => ({
            ...prev,
            salary: { ...prev.salary, [type]: value }
        }));
    };

    const addRequirement = () => {
        setFormData(prev => ({
            ...prev,
            requirements: [...prev.requirements, '']
        }));
    };

    const updateRequirement = (index: number, value: string) => {
        const updated = [...formData.requirements];
        updated[index] = value;
        setFormData(prev => ({ ...prev, requirements: updated }));
    };

    const removeRequirement = (index: number) => {
        setFormData(prev => ({
            ...prev,
            requirements: prev.requirements.filter((_, i) => i !== index)
        }));
    };

    const addSkill = (skill: string) => {
        if (skill && !formData.skills.includes(skill)) {
            setFormData(prev => ({
                ...prev,
                skills: [...prev.skills, skill]
            }));
            setNewSkill('');
        }
    };

    const removeSkill = (skill: string) => {
        setFormData(prev => ({
            ...prev,
            skills: prev.skills.filter(s => s !== skill)
        }));
    };

    const addBenefit = (benefit: string) => {
        if (benefit && !formData.benefits.includes(benefit)) {
            setFormData(prev => ({
                ...prev,
                benefits: [...prev.benefits, benefit]
            }));
            setNewBenefit('');
        }
    };

    const removeBenefit = (benefit: string) => {
        setFormData(prev => ({
            ...prev,
            benefits: prev.benefits.filter(b => b !== benefit)
        }));
    };

    const handleSubmit = async (isDraft: boolean = false) => {
        setIsSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log('Submitting job:', { ...formData, isDraft });
        setIsSubmitting(false);
        alert(isDraft ? 'Job saved as draft!' : 'Job posted successfully!');
    };

    const canProceed = () => {
        switch (currentStep) {
            case 1: return formData.title && formData.company && formData.location;
            case 2: return formData.description && formData.requirements.some(r => r);
            case 3: return formData.skills.length >= 3;
            case 4: return true;
            default: return true;
        }
    };

    return (
        <div className="post-job-page">
            {/* Header with Gradient */}
            <div className="post-job-header">
                <div className="header-content">
                    <div className="header-icon">
                        <Briefcase size={32} />
                    </div>
                    <div className="header-text">
                        <h1>Create a New Job Posting</h1>
                        <p>Attract top talent with a compelling job listing</p>
                    </div>
                </div>
                <div className="header-actions">
                    <button
                        className="btn-preview"
                        onClick={() => setShowPreview(!showPreview)}
                    >
                        <Eye size={18} />
                        {showPreview ? 'Edit' : 'Preview'}
                    </button>
                </div>
            </div>

            {!showPreview ? (
                <>
                    {/* Progress Steps */}
                    <div className="steps-container">
                        <div className="steps-progress">
                            {steps.map((step, index) => (
                                <React.Fragment key={step.id}>
                                    <div
                                        className={`step ${currentStep >= step.id ? 'active' : ''} ${currentStep === step.id ? 'current' : ''}`}
                                        onClick={() => currentStep > step.id && setCurrentStep(step.id)}
                                    >
                                        <div className="step-icon">
                                            {currentStep > step.id ? (
                                                <CheckCircle size={20} />
                                            ) : (
                                                <step.icon size={20} />
                                            )}
                                        </div>
                                        <span className="step-title">{step.title}</span>
                                    </div>
                                    {index < steps.length - 1 && (
                                        <div className={`step-connector ${currentStep > step.id ? 'active' : ''}`} />
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>

                    {/* Form Content */}
                    <div className="form-container">
                        {/* Step 1: Basic Information */}
                        {currentStep === 1 && (
                            <div className="step-content">
                                <div className="step-header">
                                    <Briefcase size={24} />
                                    <div>
                                        <h2>Basic Information</h2>
                                        <p>Let's start with the essentials</p>
                                    </div>
                                </div>

                                <div className="form-card">
                                    <div className="input-group featured">
                                        <label>
                                            <Target size={16} />
                                            Job Title
                                            <span className="required">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className="input-featured"
                                            placeholder="e.g. Senior Frontend Developer"
                                            value={formData.title}
                                            onChange={(e) => handleInputChange('title', e.target.value)}
                                        />
                                        <span className="input-hint">Be specific to attract the right candidates</span>
                                    </div>

                                    <div className="input-row">
                                        <div className="input-group">
                                            <label>
                                                <Building2 size={16} />
                                                Company Name
                                                <span className="required">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="e.g. TechCorp Inc."
                                                value={formData.company}
                                                onChange={(e) => handleInputChange('company', e.target.value)}
                                            />
                                        </div>
                                        <div className="input-group">
                                            <label>
                                                <MapPin size={16} />
                                                Location
                                                <span className="required">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="e.g. San Francisco, CA or Remote"
                                                value={formData.location}
                                                onChange={(e) => handleInputChange('location', e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="input-row">
                                        <div className="input-group">
                                            <label>
                                                <Clock size={16} />
                                                Employment Type
                                            </label>
                                            <div className="select-cards">
                                                {['full-time', 'part-time', 'contract', 'remote'].map(type => (
                                                    <button
                                                        key={type}
                                                        className={`select-card ${formData.type === type ? 'selected' : ''}`}
                                                        onClick={() => handleInputChange('type', type)}
                                                    >
                                                        {type === 'full-time' && <Clock size={18} />}
                                                        {type === 'part-time' && <Clock size={18} />}
                                                        {type === 'contract' && <FileText size={18} />}
                                                        {type === 'remote' && <MapPin size={18} />}
                                                        <span>{type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="input-row">
                                        <div className="input-group">
                                            <label>
                                                <GraduationCap size={16} />
                                                Experience Level
                                            </label>
                                            <div className="experience-slider">
                                                {[
                                                    { id: 'entry', label: 'Entry', years: '0-2 years' },
                                                    { id: 'mid', label: 'Mid', years: '3-5 years' },
                                                    { id: 'senior', label: 'Senior', years: '5-8 years' },
                                                    { id: 'lead', label: 'Lead', years: '8+ years' }
                                                ].map(level => (
                                                    <button
                                                        key={level.id}
                                                        className={`exp-option ${formData.experience === level.id ? 'selected' : ''}`}
                                                        onClick={() => handleInputChange('experience', level.id)}
                                                    >
                                                        <span className="exp-label">{level.label}</span>
                                                        <span className="exp-years">{level.years}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="salary-section">
                                        <label>
                                            <DollarSign size={16} />
                                            Salary Range (Annual)
                                        </label>
                                        <div className="salary-inputs">
                                            <div className="salary-input">
                                                <span className="currency">$</span>
                                                <input
                                                    type="number"
                                                    placeholder="80,000"
                                                    value={formData.salary.min}
                                                    onChange={(e) => handleSalaryChange('min', e.target.value)}
                                                />
                                            </div>
                                            <span className="salary-to">to</span>
                                            <div className="salary-input">
                                                <span className="currency">$</span>
                                                <input
                                                    type="number"
                                                    placeholder="120,000"
                                                    value={formData.salary.max}
                                                    onChange={(e) => handleSalaryChange('max', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Job Details */}
                        {currentStep === 2 && (
                            <div className="step-content">
                                <div className="step-header">
                                    <FileText size={24} />
                                    <div>
                                        <h2>Job Details</h2>
                                        <p>Describe the role and requirements</p>
                                    </div>
                                </div>

                                <div className="form-card">
                                    <div className="input-group">
                                        <label>
                                            <FileText size={16} />
                                            Job Description
                                            <span className="required">*</span>
                                        </label>
                                        <textarea
                                            className="textarea-rich"
                                            rows={8}
                                            placeholder="Describe the role, responsibilities, team culture, and what makes this opportunity exciting...

Example:
We're looking for a passionate developer to join our growing team. You'll work on cutting-edge projects, collaborate with talented engineers, and have a direct impact on our product..."
                                            value={formData.description}
                                            onChange={(e) => handleInputChange('description', e.target.value)}
                                        />
                                        <div className="textarea-footer">
                                            <span className="char-count">{formData.description.length} characters</span>
                                            <span className="ai-assist">
                                                <Sparkles size={14} /> AI will help optimize for ATS
                                            </span>
                                        </div>
                                    </div>

                                    <div className="requirements-section">
                                        <div className="section-header">
                                            <label>
                                                <Users size={16} />
                                                Requirements
                                                <span className="required">*</span>
                                            </label>
                                            <button className="btn-add" onClick={addRequirement}>
                                                <Plus size={16} /> Add
                                            </button>
                                        </div>
                                        <div className="requirements-list">
                                            {formData.requirements.map((req, index) => (
                                                <div key={index} className="requirement-item">
                                                    <span className="req-number">{index + 1}</span>
                                                    <input
                                                        type="text"
                                                        placeholder="e.g. 5+ years of experience with React"
                                                        value={req}
                                                        onChange={(e) => updateRequirement(index, e.target.value)}
                                                    />
                                                    {formData.requirements.length > 1 && (
                                                        <button
                                                            className="btn-remove"
                                                            onClick={() => removeRequirement(index)}
                                                        >
                                                            <X size={16} />
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Skills & Benefits */}
                        {currentStep === 3 && (
                            <div className="step-content">
                                <div className="step-header">
                                    <Code size={24} />
                                    <div>
                                        <h2>Skills & Benefits</h2>
                                        <p>What skills are needed and what do you offer?</p>
                                    </div>
                                </div>

                                <div className="dual-cards">
                                    {/* Skills Card */}
                                    <div className="form-card skills-card">
                                        <div className="card-title">
                                            <Code size={20} />
                                            <span>Required Skills</span>
                                            <span className="badge">{formData.skills.length}/10</span>
                                        </div>

                                        <div className="skill-input-container">
                                            <input
                                                type="text"
                                                placeholder="Add a skill..."
                                                value={newSkill}
                                                onChange={(e) => setNewSkill(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && addSkill(newSkill)}
                                            />
                                            <button onClick={() => addSkill(newSkill)}>
                                                <Plus size={18} />
                                            </button>
                                        </div>

                                        {formData.skills.length > 0 && (
                                            <div className="selected-items">
                                                {formData.skills.map(skill => (
                                                    <span key={skill} className="item-tag skill">
                                                        {skill}
                                                        <button onClick={() => removeSkill(skill)}>
                                                            <X size={12} />
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        <div className="skill-categories">
                                            {Object.entries(skillCategories).map(([category, skills]) => (
                                                <div key={category} className="skill-category">
                                                    <h4>{category}</h4>
                                                    <div className="skill-options">
                                                        {skills.filter(s => !formData.skills.includes(s)).map(skill => (
                                                            <button
                                                                key={skill}
                                                                className="skill-option"
                                                                onClick={() => addSkill(skill)}
                                                            >
                                                                + {skill}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Benefits Card */}
                                    <div className="form-card benefits-card">
                                        <div className="card-title">
                                            <Gift size={20} />
                                            <span>Benefits & Perks</span>
                                            <span className="badge">{formData.benefits.length}</span>
                                        </div>

                                        <div className="skill-input-container">
                                            <input
                                                type="text"
                                                placeholder="Add a benefit..."
                                                value={newBenefit}
                                                onChange={(e) => setNewBenefit(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && addBenefit(newBenefit)}
                                            />
                                            <button onClick={() => addBenefit(newBenefit)}>
                                                <Plus size={18} />
                                            </button>
                                        </div>

                                        {formData.benefits.length > 0 && (
                                            <div className="selected-items">
                                                {formData.benefits.map(benefit => (
                                                    <span key={benefit} className="item-tag benefit">
                                                        {benefit}
                                                        <button onClick={() => removeBenefit(benefit)}>
                                                            <X size={12} />
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        <div className="benefit-suggestions">
                                            <h4>Popular Benefits</h4>
                                            <div className="benefit-options">
                                                {benefitSuggestions.filter(b => !formData.benefits.includes(b)).map(benefit => (
                                                    <button
                                                        key={benefit}
                                                        className="benefit-option"
                                                        onClick={() => addBenefit(benefit)}
                                                    >
                                                        {benefit}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 4: Review */}
                        {currentStep === 4 && (
                            <div className="step-content">
                                <div className="step-header">
                                    <Rocket size={24} />
                                    <div>
                                        <h2>Review & Publish</h2>
                                        <p>Make sure everything looks perfect</p>
                                    </div>
                                </div>

                                <div className="review-container">
                                    <div className="review-card main">
                                        <div className="review-header">
                                            <h2>{formData.title || 'Job Title'}</h2>
                                            <span className="company-badge">
                                                <Building2 size={14} />
                                                {formData.company || 'Company Name'}
                                            </span>
                                        </div>

                                        <div className="review-meta">
                                            <span><MapPin size={14} /> {formData.location || 'Location'}</span>
                                            <span><Clock size={14} /> {formData.type}</span>
                                            <span><GraduationCap size={14} /> {formData.experience} level</span>
                                            {formData.salary.min && formData.salary.max && (
                                                <span className="salary-badge">
                                                    <DollarSign size={14} />
                                                    ${Number(formData.salary.min).toLocaleString()} - ${Number(formData.salary.max).toLocaleString()}
                                                </span>
                                            )}
                                        </div>

                                        {formData.description && (
                                            <div className="review-section">
                                                <h4><FileText size={16} /> About the Role</h4>
                                                <p>{formData.description}</p>
                                            </div>
                                        )}

                                        {formData.requirements.filter(r => r).length > 0 && (
                                            <div className="review-section">
                                                <h4><Users size={16} /> Requirements</h4>
                                                <ul>
                                                    {formData.requirements.filter(r => r).map((req, i) => (
                                                        <li key={i}>{req}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {formData.skills.length > 0 && (
                                            <div className="review-section">
                                                <h4><Code size={16} /> Required Skills</h4>
                                                <div className="review-tags">
                                                    {formData.skills.map(skill => (
                                                        <span key={skill} className="tag skill">{skill}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {formData.benefits.length > 0 && (
                                            <div className="review-section">
                                                <h4><Gift size={16} /> Benefits</h4>
                                                <div className="review-tags">
                                                    {formData.benefits.map(benefit => (
                                                        <span key={benefit} className="tag benefit">{benefit}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="publish-sidebar">
                                        <div className="ai-score-card">
                                            <Zap size={24} />
                                            <h4>ATS Readiness</h4>
                                            <div className="score-circle">
                                                <span className="score">85</span>
                                                <span className="label">/ 100</span>
                                            </div>
                                            <p>Your job posting is well-optimized for applicant tracking systems</p>
                                        </div>

                                        <div className="checklist-card">
                                            <h4>Quick Checklist</h4>
                                            <div className="checklist">
                                                <div className={`check-item ${formData.title ? 'done' : ''}`}>
                                                    <CheckCircle size={16} /> Job title
                                                </div>
                                                <div className={`check-item ${formData.description ? 'done' : ''}`}>
                                                    <CheckCircle size={16} /> Description
                                                </div>
                                                <div className={`check-item ${formData.skills.length >= 3 ? 'done' : ''}`}>
                                                    <CheckCircle size={16} /> 3+ skills
                                                </div>
                                                <div className={`check-item ${formData.salary.min ? 'done' : ''}`}>
                                                    <CheckCircle size={16} /> Salary range
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Navigation */}
                        <div className="form-navigation">
                            {currentStep > 1 && (
                                <button
                                    className="btn-nav prev"
                                    onClick={() => setCurrentStep(prev => prev - 1)}
                                >
                                    <ChevronLeft size={18} />
                                    Previous
                                </button>
                            )}

                            <div className="nav-right">
                                <button
                                    className="btn-draft"
                                    onClick={() => handleSubmit(true)}
                                    disabled={isSubmitting}
                                >
                                    <Save size={18} />
                                    Save Draft
                                </button>

                                {currentStep < 4 ? (
                                    <button
                                        className="btn-nav next"
                                        onClick={() => setCurrentStep(prev => prev + 1)}
                                        disabled={!canProceed()}
                                    >
                                        Next Step
                                        <ChevronRight size={18} />
                                    </button>
                                ) : (
                                    <button
                                        className="btn-publish"
                                        onClick={() => handleSubmit(false)}
                                        disabled={isSubmitting}
                                    >
                                        <Rocket size={18} />
                                        {isSubmitting ? 'Publishing...' : 'Publish Job'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                /* Full Preview */
                <div className="full-preview">
                    <div className="preview-card">
                        {/* Same as review but full width */}
                        <div className="preview-header">
                            <h1>{formData.title || 'Job Title'}</h1>
                            <p className="company">{formData.company || 'Company Name'}</p>
                            <div className="preview-meta">
                                <span><MapPin size={16} /> {formData.location}</span>
                                <span><Clock size={16} /> {formData.type}</span>
                                <span><GraduationCap size={16} /> {formData.experience}</span>
                                {formData.salary.min && (
                                    <span><DollarSign size={16} /> ${formData.salary.min}k - ${formData.salary.max}k</span>
                                )}
                            </div>
                        </div>
                        <div className="preview-body">
                            {formData.description && (
                                <section>
                                    <h3>About the Role</h3>
                                    <p>{formData.description}</p>
                                </section>
                            )}
                            {formData.requirements.filter(r => r).length > 0 && (
                                <section>
                                    <h3>Requirements</h3>
                                    <ul>
                                        {formData.requirements.filter(r => r).map((r, i) => <li key={i}>{r}</li>)}
                                    </ul>
                                </section>
                            )}
                            {formData.skills.length > 0 && (
                                <section>
                                    <h3>Skills</h3>
                                    <div className="tags">{formData.skills.map(s => <span key={s} className="tag">{s}</span>)}</div>
                                </section>
                            )}
                            {formData.benefits.length > 0 && (
                                <section>
                                    <h3>Benefits</h3>
                                    <div className="tags benefits">{formData.benefits.map(b => <span key={b} className="tag">{b}</span>)}</div>
                                </section>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PostJobPage;
