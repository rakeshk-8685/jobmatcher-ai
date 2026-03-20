// ============================================
// ATS Score Checker Page
// AI-powered resume analysis tool
// ============================================

import React, { useState, useRef } from 'react';
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
    X
} from 'lucide-react';
import { analyzeResume } from '../../services/ats';
import type { ATSScoreResult } from '../../services/ats';
import { mockJobs } from '../../data/mockData';
import './ATSScorePage.css';

const ATSScorePage: React.FC = () => {
    const [resumeText, setResumeText] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [selectedJobId, setSelectedJobId] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<ATSScoreResult | null>(null);
    const [resumeFileName, setResumeFileName] = useState<string | null>(null);
    const [jdFileName, setJdFileName] = useState<string | null>(null);

    // File input refs
    const resumeFileRef = useRef<HTMLInputElement>(null);
    const jdFileRef = useRef<HTMLInputElement>(null);

    // Handle resume file upload
    const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setResumeFileName(file.name);
        setIsAnalyzing(true); // Show some loading state if possible, or just wait

        try {
            // If it's a text file, we can still read it directly, but let's use the backend for consistency
            // especially for PDFs and Docs
            if (file.type === 'text/plain') {
                const text = await file.text();
                setResumeText(text);
            } else {
                // Use backend parser
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

    // Handle JD file upload
    const handleJdUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setJdFileName(file.name);
        setSelectedJobId('');

        try {
            if (file.type === 'text/plain') {
                const text = await file.text();
                setJobDescription(text);
            } else {
                const parsed = await import('../../services/ats').then(m => m.parseResumeFile(file));
                setJobDescription(parsed.text);
            }
        } catch (error) {
            console.error('Error reading JD file:', error);
            alert('Error parsing file. Please try again or paste the job description directly.');
        }
    };

    // Clear resume file
    const clearResumeFile = () => {
        setResumeFileName(null);
        setResumeText('');
        if (resumeFileRef.current) resumeFileRef.current.value = '';
    };

    // Clear JD file
    const clearJdFile = () => {
        setJdFileName(null);
        setJobDescription('');
        if (jdFileRef.current) jdFileRef.current.value = '';
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
        if (score >= 80) return { label: 'Excellent Match', class: 'excellent' };
        if (score >= 65) return { label: 'Good Match', class: 'good' };
        if (score >= 50) return { label: 'Needs Improvement', class: 'needs-work' };
        return { label: 'Significant Gap', class: 'poor' };
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
                <h1><FileSearch size={28} /> ATS Score Checker</h1>
                <p>Analyze your resume against job descriptions using AI to optimize your application success rate</p>
            </div>

            {/* Input Section */}
            <div className="ats-input-section">
                <div className="ats-input-card">
                    <div className="ats-input-header">
                        <h3><FileText size={20} /> Your Resume</h3>
                        <div className="ats-upload-actions">
                            <input
                                type="file"
                                ref={resumeFileRef}
                                onChange={handleResumeUpload}
                                accept=".txt,.pdf,.doc,.docx"
                                style={{ display: 'none' }}
                                id="resume-upload"
                            />
                            <label htmlFor="resume-upload" className="btn-upload">
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
                    <textarea
                        className="ats-textarea"
                        placeholder="Paste your resume text here or upload a file above...

Supported formats: .txt, .pdf, .doc, .docx

Example:
John Doe
Senior Frontend Developer

5+ years of experience building web applications with React, TypeScript, and modern JavaScript frameworks.

Experience:
- Senior Frontend Developer at TechCorp (2021-Present)
  Built scalable React applications serving 1M+ users

Skills: React, TypeScript, JavaScript, Node.js, CSS, HTML, GraphQL

Education: BS Computer Science, University of California"
                        value={resumeText}
                        onChange={(e) => {
                            setResumeText(e.target.value);
                            if (!e.target.value) setResumeFileName(null);
                        }}
                    />
                </div>

                <div className="ats-input-card">
                    <div className="ats-input-header">
                        <h3><Briefcase size={20} /> Job Description</h3>
                        <div className="ats-upload-actions">
                            <input
                                type="file"
                                ref={jdFileRef}
                                onChange={handleJdUpload}
                                accept=".txt,.pdf,.doc,.docx"
                                style={{ display: 'none' }}
                                id="jd-upload"
                            />
                            <label htmlFor="jd-upload" className="btn-upload">
                                <Upload size={16} />
                                Upload JD
                            </label>
                        </div>
                    </div>
                    {jdFileName && (
                        <div className="ats-file-badge">
                            <Briefcase size={14} />
                            <span>{jdFileName}</span>
                            <button onClick={clearJdFile} className="btn-clear-file">
                                <X size={14} />
                            </button>
                        </div>
                    )}
                    <div style={{ marginBottom: 'var(--spacing-3)' }}>
                        <select
                            className="form-input"
                            value={selectedJobId}
                            onChange={(e) => {
                                handleJobSelect(e.target.value);
                                setJdFileName(null);
                            }}
                            style={{ width: '100%' }}
                        >
                            <option value="">-- Or select from existing jobs --</option>
                            {mockJobs.map(job => (
                                <option key={job.id} value={job.id}>
                                    {job.title} at {job.company}
                                </option>
                            ))}
                        </select>
                    </div>
                    <textarea
                        className="ats-textarea"
                        placeholder="Paste the job description here, upload a file, or select from above...

Supported formats: .txt, .pdf, .doc, .docx

Example:
Senior Frontend Developer
TechCorp Inc. - San Francisco, CA

Requirements:
- 5+ years of experience with React
- Strong TypeScript skills

Required Skills: React, TypeScript, Next.js, CSS, GraphQL"
                        value={jobDescription}
                        onChange={(e) => {
                            setJobDescription(e.target.value);
                            setSelectedJobId('');
                            if (!e.target.value) setJdFileName(null);
                        }}
                        style={{ minHeight: '160px' }}
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
                            Analyzing...
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
                            <h3>Overall ATS Score</h3>
                            <div className="ats-main-circle">
                                <svg viewBox="0 0 100 100">
                                    <defs>
                                        <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
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
                                            strokeDasharray: `${result.overall * 2.64} 264`
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
                            <h4><CheckCircle size={18} /> Matched Skills ({result.matched_skills.length})</h4>
                            <div className="ats-skills-list">
                                {result.matched_skills.length > 0 ? (
                                    result.matched_skills.map((skill, idx) => (
                                        <span key={idx} className="ats-skill-chip matched">
                                            <CheckCircle size={14} />
                                            {skill}
                                        </span>
                                    ))
                                ) : (
                                    <span className="ats-skills-empty">No skills matched. Update your resume with relevant skills.</span>
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
                                    <span className="ats-skills-empty">Great! You have all the required skills.</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Suggestions */}
                    {result.suggestions.length > 0 && (
                        <div className="ats-suggestions-section">
                            <div className="ats-suggestions-card">
                                <h3><Lightbulb size={20} /> AI Recommendations</h3>
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
                        <h3>Ready to Analyze</h3>
                        <p>Paste your resume and a job description above, then click "Analyze with AI" to see your ATS compatibility score.</p>
                    </div>
                )
            )}
        </div>
    );
};

export default ATSScorePage;
