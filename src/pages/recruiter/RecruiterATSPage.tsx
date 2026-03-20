// ============================================
// Recruiter ATS Score Checker Page
// AI-powered candidate resume analysis tool
// ============================================

import React, { useState } from 'react';
import {
    FileText,
    Briefcase,
    Sparkles,
    TrendingUp,
    CheckCircle,
    AlertTriangle,
    Lightbulb,
    Target,
    GraduationCap,
    Clock,
    Loader2,
    FileSearch,
    Upload,
    X,
    Users,
    ChevronDown
} from 'lucide-react';
import { analyzeResume } from '../../services/ats';
import type { ATSScoreResult } from '../../services/ats';
import { mockJobs } from '../../data/mockData';
import '../user/ATSScorePage.css';

// Mock candidates for recruiter
const mockCandidates = [
    { id: '1', name: 'John Doe', email: 'john@email.com', role: 'Senior Frontend Developer' },
    { id: '2', name: 'Jane Smith', email: 'jane@email.com', role: 'Full Stack Engineer' },
    { id: '3', name: 'Mike Johnson', email: 'mike@email.com', role: 'React Developer' },
    { id: '4', name: 'Sarah Wilson', email: 'sarah@email.com', role: 'Backend Developer' },
    { id: '5', name: 'David Brown', email: 'david@email.com', role: 'DevOps Engineer' },
];

const RecruiterATSPage: React.FC = () => {
    const [resumeText, setResumeText] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [selectedJobId, setSelectedJobId] = useState('');
    const [selectedCandidateId, setSelectedCandidateId] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<ATSScoreResult | null>(null);
    const [resumeFileName, setResumeFileName] = useState<string | null>(null);

    // File input ref
    const resumeFileRef = React.useRef<HTMLInputElement>(null);

    // Handle resume file upload
    const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setResumeFileName(file.name);
        setIsAnalyzing(true);

        try {
            if (file.type === 'text/plain') {
                const text = await file.text();
                setResumeText(text);
            } else {
                const parsed = await import('../../services/ats').then(m => m.parseResumeFile(file));
                setResumeText(parsed.text);
            }
        } catch (error) {
            console.error('Error reading resume file:', error);
            alert(`Error parsing file: ${error instanceof Error ? error.message : String(error)}`);
        } finally {
            setIsAnalyzing(false);
        }
    };

    // Clear resume file
    const clearResumeFile = () => {
        setResumeFileName(null);
        setResumeText('');
        if (resumeFileRef.current) resumeFileRef.current.value = '';
    };

    // Handle job selection
    const handleJobSelect = (jobId: string) => {
        setSelectedJobId(jobId);
        if (jobId) {
            const job = mockJobs.find(j => j.id === jobId);
            if (job) {
                setJobDescription(`
Job Title: ${job.title}
Company: ${job.company}
Location: ${job.location}

Description:
${job.description}

Requirements:
${job.requirements.join('\n')}

Required Skills:
${job.skills.join(', ')}

Experience: ${job.experience} level
                `.trim());
            }
        }
    };

    // Handle candidate selection (mock)
    const handleCandidateSelect = (candidateId: string) => {
        setSelectedCandidateId(candidateId);
        if (candidateId) {
            const candidate = mockCandidates.find(c => c.id === candidateId);
            if (candidate) {
                // Mock resume data for demonstration
                setResumeText(`
${candidate.name}
${candidate.role}

${candidate.email}

Professional Summary:
Experienced ${candidate.role} with 5+ years of experience in software development. 
Skilled in React, TypeScript, Node.js, and modern web technologies.

Experience:
- Senior Developer at TechCorp (2021-Present)
  Led development of scalable web applications
- Developer at StartupXYZ (2019-2021)
  Built and maintained production applications

Skills: React, TypeScript, JavaScript, Node.js, Python, AWS, Docker, GraphQL, CSS, HTML

Education: BS Computer Science, State University (2019)
                `.trim());
                setResumeFileName(null);
            }
        }
    };

    // Analyze resume
    const handleAnalyze = async () => {
        if (!resumeText.trim() || !jobDescription.trim()) return;

        setIsAnalyzing(true);
        setResult(null);

        // Extract skills from job description for better matching
        const skillsFromJD = mockJobs
            .find(j => j.id === selectedJobId)?.skills || [];

        try {
            const analysisResult = await analyzeResume({
                resumeText,
                jobDescription,
                requiredSkills: skillsFromJD,
            });
            setResult(analysisResult);
        } catch (error) {
            console.error('Analysis failed:', error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    // Get score status
    const getScoreStatus = (score: number) => {
        if (score >= 80) return { label: 'Excellent Match', class: 'excellent', recommendation: 'Highly Recommended' };
        if (score >= 65) return { label: 'Good Match', class: 'good', recommendation: 'Consider for Interview' };
        if (score >= 50) return { label: 'Partial Match', class: 'needs-work', recommendation: 'May Need Further Review' };
        return { label: 'Poor Match', class: 'poor', recommendation: 'Not Recommended' };
    };

    // Get progress bar class
    const getProgressClass = (score: number) => {
        if (score >= 80) return 'high';
        if (score >= 65) return 'medium';
        if (score >= 50) return 'low';
        return 'critical';
    };

    // Breakdown icons
    const breakdownIcons: Record<string, React.ReactNode> = {
        keywords: <Target size={18} />,
        skills: <Sparkles size={18} />,
        experience: <Clock size={18} />,
        education: <GraduationCap size={18} />
    };

    return (
        <div className="ats-checker-page dashboard-page">
            <div className="ats-checker-header">
                <h1><FileSearch size={28} /> Candidate ATS Analyzer</h1>
                <p>Analyze candidate resumes against your job postings using AI to find the best matches</p>
            </div>

            {/* Input Section */}
            <div className="ats-input-section">
                {/* Candidate Resume Section */}
                <div className="ats-input-card">
                    <div className="ats-input-header">
                        <h3><Users size={20} /> Candidate Resume</h3>
                        <div className="ats-upload-actions">
                            <input
                                type="file"
                                ref={resumeFileRef}
                                onChange={handleResumeUpload}
                                accept=".txt,.pdf,.doc,.docx"
                                style={{ display: 'none' }}
                                id="resume-upload-recruiter"
                            />
                            <label htmlFor="resume-upload-recruiter" className="btn-upload">
                                <Upload size={16} />
                                Upload Resume
                            </label>
                        </div>
                    </div>
                    {resumeFileName && (
                        <div className="ats-file-badge">
                            <FileText size={14} />
                            <span>{resumeFileName}</span>
                            <button onClick={clearResumeFile} className="btn-clear-file">
                                <X size={14} />
                            </button>
                        </div>
                    )}
                    <div style={{ marginBottom: 'var(--spacing-3)' }}>
                        <div className="ats-select-wrapper">
                            <select
                                className="ats-select"
                                value={selectedCandidateId}
                                onChange={(e) => handleCandidateSelect(e.target.value)}
                            >
                                <option value="">-- Or select from applicants --</option>
                                {mockCandidates.map(candidate => (
                                    <option key={candidate.id} value={candidate.id}>
                                        {candidate.name} - {candidate.role}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="ats-select-arrow" size={16} />
                        </div>
                    </div>
                    <textarea
                        className="ats-textarea"
                        placeholder="Paste candidate resume here or upload a file...

Supported formats: .txt, .pdf, .doc, .docx"
                        value={resumeText}
                        onChange={(e) => {
                            setResumeText(e.target.value);
                            if (!e.target.value) {
                                setResumeFileName(null);
                                setSelectedCandidateId('');
                            }
                        }}
                        style={{ minHeight: '200px' }}
                    />
                </div>

                {/* Job Description Section */}
                <div className="ats-input-card">
                    <div className="ats-input-header">
                        <h3><Briefcase size={20} /> Your Job Posting</h3>
                    </div>
                    <div style={{ marginBottom: 'var(--spacing-3)' }}>
                        <div className="ats-select-wrapper">
                            <select
                                className="ats-select"
                                value={selectedJobId}
                                onChange={(e) => handleJobSelect(e.target.value)}
                            >
                                <option value="">-- Select from your job postings --</option>
                                {mockJobs.map(job => (
                                    <option key={job.id} value={job.id}>
                                        {job.title} at {job.company}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="ats-select-arrow" size={16} />
                        </div>
                    </div>
                    <textarea
                        className="ats-textarea"
                        placeholder="Select a job posting above or paste job requirements here..."
                        value={jobDescription}
                        onChange={(e) => {
                            setJobDescription(e.target.value);
                            setSelectedJobId('');
                        }}
                        style={{ minHeight: '200px' }}
                    />
                </div>
            </div>

            {/* Analyze Button */}
            <div className="ats-analyze-section">
                <button
                    className={`btn-analyze ${isAnalyzing ? 'analyzing' : ''}`}
                    onClick={handleAnalyze}
                    disabled={!resumeText.trim() || !jobDescription.trim() || isAnalyzing}
                >
                    {isAnalyzing ? (
                        <>
                            <Loader2 size={24} className="animate-spin" />
                            Analyzing Candidate...
                        </>
                    ) : (
                        <>
                            <Sparkles size={24} />
                            Analyze with AI
                        </>
                    )}
                </button>
            </div>

            {/* Results Section */}
            {result ? (
                <div className="ats-results-section">
                    <div className="ats-results-grid">
                        {/* Overall Score */}
                        <div className="ats-score-card-main">
                            <h3>Candidate Match Score</h3>
                            <div className="ats-main-circle">
                                <svg viewBox="0 0 100 100">
                                    <defs>
                                        <linearGradient id="scoreGradientRecruiter" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#6366f1" />
                                            <stop offset="100%" stopColor="#ec4899" />
                                        </linearGradient>
                                    </defs>
                                    <circle cx="50" cy="50" r="42" className="ats-main-circle-bg" />
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r="42"
                                        className="ats-main-circle-progress"
                                        style={{
                                            strokeDasharray: `${result.overall * 2.64} 264`,
                                            stroke: 'url(#scoreGradientRecruiter)'
                                        }}
                                    />
                                </svg>
                                <div className="ats-main-circle-value">
                                    <span className="ats-main-score-number">{result.overall}</span>
                                    <span className="ats-main-score-label">out of 100</span>
                                </div>
                            </div>
                            <div className={`ats-score-status ${getScoreStatus(result.overall).class}`}>
                                {result.overall >= 65 ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
                                {getScoreStatus(result.overall).label}
                            </div>
                            <p style={{ marginTop: 'var(--spacing-3)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                                {getScoreStatus(result.overall).recommendation}
                            </p>
                        </div>

                        {/* Score Breakdown */}
                        <div className="ats-breakdown-card">
                            <h3>Score Breakdown</h3>
                            <div className="ats-breakdown-list">
                                {Object.entries(result.breakdown).map(([key, value]) => (
                                    <div key={key} className="ats-breakdown-row">
                                        <div className="ats-breakdown-header">
                                            <span className="ats-breakdown-name">
                                                {breakdownIcons[key]}
                                                {key}
                                            </span>
                                            <span className="ats-breakdown-percent">{value}%</span>
                                        </div>
                                        <div className="ats-progress-bar">
                                            <div
                                                className={`ats-progress-fill ${getProgressClass(value)}`}
                                                style={{ width: `${value}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Skills Section */}
                    <div className="ats-skills-section">
                        <div className="ats-skills-card matched">
                            <h4><CheckCircle size={18} /> Matching Skills ({result.matched_skills.length})</h4>
                            <div className="ats-skills-list">
                                {result.matched_skills.length > 0 ? (
                                    result.matched_skills.map((skill, idx) => (
                                        <span key={idx} className="ats-skill-chip matched">
                                            <CheckCircle size={14} />
                                            {skill}
                                        </span>
                                    ))
                                ) : (
                                    <span className="ats-skills-empty">No matching skills found.</span>
                                )}
                            </div>
                        </div>

                        <div className="ats-skills-card missing">
                            <h4><AlertTriangle size={18} /> Missing Skills ({result.missing_skills.length})</h4>
                            <div className="ats-skills-list">
                                {result.missing_skills.length > 0 ? (
                                    result.missing_skills.map((skill, idx) => (
                                        <span key={idx} className="ats-skill-chip missing">
                                            {skill}
                                        </span>
                                    ))
                                ) : (
                                    <span className="ats-skills-empty">Candidate has all required skills!</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Hiring Recommendations */}
                    {result.suggestions.length > 0 && (
                        <div className="ats-suggestions-section">
                            <div className="ats-suggestions-card">
                                <h3><Lightbulb size={20} /> Hiring Insights</h3>
                                <div className="ats-suggestions-list">
                                    {result.suggestions.map((suggestion, idx) => (
                                        <div key={idx} className={`ats-suggestion-item ${suggestion.priority}`}>
                                            <div className="ats-suggestion-icon">
                                                <TrendingUp size={18} />
                                            </div>
                                            <div className="ats-suggestion-content">
                                                <div className="ats-suggestion-category">{suggestion.category}</div>
                                                <div className="ats-suggestion-message">{suggestion.message}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                !isAnalyzing && (
                    <div className="ats-empty-state">
                        <div className="ats-empty-icon">
                            <FileSearch size={40} />
                        </div>
                        <h3>Ready to Analyze Candidates</h3>
                        <p>Select or upload a candidate resume and choose a job posting, then click "Analyze with AI" to see the match score.</p>
                    </div>
                )
            )}
        </div>
    );
};

export default RecruiterATSPage;
