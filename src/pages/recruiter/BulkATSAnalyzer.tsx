// ============================================
// Bulk ATS Resume Analyzer Page
// Analyze 1000+ resumes at once for recruiters
// ============================================

import React, { useState, useRef, useCallback } from 'react';
import {
    FileText,
    Briefcase,
    Sparkles,
    TrendingUp,
    CheckCircle,
    AlertTriangle,
    X,
    Download,
    Filter,
    SortAsc,
    SortDesc,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    Loader2,
    FolderOpen,
    BarChart3,
    Users,
    Zap,
    Eye,
    Archive
} from 'lucide-react';
import JSZip from 'jszip';
import { analyzeResumesBatch, parseResumesBatch, type BatchResumeItem } from '../../services/ats';
import { mockJobs } from '../../data/mockData';
import './BulkATSAnalyzer.css';

// Types
interface ResumeFile {
    id: string;
    file: File;
    name: string;
    status: 'pending' | 'processing' | 'completed' | 'error';
    result?: BulkAnalysisResult;
    error?: string;
}

interface BulkAnalysisResult {
    fileName: string;
    candidateName: string;
    email: string;
    overallScore: number;
    status: 'excellent' | 'good' | 'partial' | 'poor';
    matchedSkills: string[];
    missingSkills: string[];
    breakdown: {
        keywords: number;
        skills: number;
        experience: number;
        education: number;
    };
    analyzedAt: Date;
}

type SortField = 'name' | 'score' | 'status';
type SortDirection = 'asc' | 'desc';

const BulkATSAnalyzer: React.FC = () => {
    // State
    const [files, setFiles] = useState<ResumeFile[]>([]);
    const [selectedJobId, setSelectedJobId] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [progress, setProgress] = useState({ processed: 0, total: 0 });
    const [isDragOver, setIsDragOver] = useState(false);
    const [selectedResult, setSelectedResult] = useState<BulkAnalysisResult | null>(null);
    const [isExtractingZip, setIsExtractingZip] = useState(false);
    const [zipProgress, setZipProgress] = useState({ extracted: 0, total: 0 });

    // Filter & Sort
    const [scoreFilter, setScoreFilter] = useState<'all' | 'excellent' | 'good' | 'partial' | 'poor'>('all');
    const [sortField, setSortField] = useState<SortField>('score');
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Extract candidate info from resume text
    const extractCandidateInfo = (text: string, fileName: string): { name: string; email: string } => {
        // Try to extract email
        const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/);
        const email = emailMatch ? emailMatch[0] : '';

        // Try to extract name (first line that looks like a name)
        const lines = text.split('\n').filter(l => l.trim());
        let name = fileName.replace(/\.(txt|pdf|docx?)$/i, '');

        for (const line of lines.slice(0, 5)) {
            const trimmed = line.trim();
            // Check if it looks like a name (2-4 words, no special chars except spaces)
            if (/^[A-Za-z\s]{3,50}$/.test(trimmed) && trimmed.split(/\s+/).length <= 4) {
                name = trimmed;
                break;
            }
        }

        return { name, email };
    };



    // Extract files from ZIP archive
    const extractZipFiles = async (zipFile: File): Promise<File[]> => {
        const zip = new JSZip();
        const extractedFiles: File[] = [];

        try {
            const zipContent = await zip.loadAsync(zipFile);
            const fileEntries = Object.entries(zipContent.files).filter(
                ([name, file]) => !file.dir && /\.(txt|pdf|docx?)$/i.test(name)
            );

            setZipProgress({ extracted: 0, total: fileEntries.length });

            let processed = 0;
            for (const [fileName, zipEntry] of fileEntries) {
                try {
                    const blob = await zipEntry.async('blob');
                    // Extract just the filename without folder path
                    const baseName = fileName.split('/').pop() || fileName;
                    const file = new File([blob], baseName, { type: blob.type });
                    extractedFiles.push(file);
                    processed++;
                    setZipProgress({ extracted: processed, total: fileEntries.length });
                } catch (err) {
                    console.error(`Error extracting ${fileName}:`, err);
                }
            }
        } catch (err) {
            console.error('Error reading ZIP file:', err);
        }

        return extractedFiles;
    };

    // Handle file selection (including ZIP files)
    const handleFilesSelected = useCallback(async (selectedFiles: FileList | File[]) => {
        const filesArray = Array.from(selectedFiles);
        const regularFiles: File[] = [];
        const zipFiles: File[] = [];

        // Separate ZIP files from regular files
        for (const file of filesArray) {
            const ext = file.name.split('.').pop()?.toLowerCase();
            if (ext === 'zip') {
                zipFiles.push(file);
            } else if (['txt', 'pdf', 'doc', 'docx'].includes(ext || '')) {
                regularFiles.push(file);
            }
        }

        // Extract files from ZIP archives
        if (zipFiles.length > 0) {
            setIsExtractingZip(true);
            for (const zipFile of zipFiles) {
                const extracted = await extractZipFiles(zipFile);
                regularFiles.push(...extracted);
            }
            setIsExtractingZip(false);
        }

        // Create ResumeFile objects
        const newFiles: ResumeFile[] = regularFiles.map(file => ({
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            file,
            name: file.name,
            status: 'pending' as const
        }));

        setFiles(prev => [...prev, ...newFiles]);
    }, []);

    // Drag and drop handlers
    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        handleFilesSelected(e.dataTransfer.files);
    }, [handleFilesSelected]);

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

    // Analyze all resumes using ultra-optimized multi-stage batching
    const handleBulkAnalyze = async () => {
        if (files.length === 0 || !jobDescription.trim()) return;

        setIsAnalyzing(true);
        setProgress({ processed: 0, total: files.length });

        // ULTRA-OPTIMIZED: 100 resumes per batch + Multi-Batch Concurrency
        const batchSize = 100;
        const pendingFiles = files.filter(f => f.status === 'pending' || f.status === 'error');
        const skillsFromJD = mockJobs.find(j => j.id === selectedJobId)?.skills || [];

        // Split into chunks/batches
        const chunks: ResumeFile[][] = [];
        for (let i = 0; i < pendingFiles.length; i += batchSize) {
            chunks.push(pendingFiles.slice(i, i + batchSize));
        }

        let processedCount = 0;

        // Worker function to process a single chunk
        const processChunk = async (batch: ResumeFile[]) => {
            // Mark batch as processing
            setFiles(prev => prev.map(f =>
                batch.find(b => b.id === f.id) ? { ...f, status: 'processing' as const } : f
            ));

            try {
                // 1. STAGE 1: BATCH PARSING
                // Use file extension instead of MIME type (ZIP-extracted files often have empty MIME)
                const isTextFile = (f: ResumeFile) => {
                    const ext = f.name.split('.').pop()?.toLowerCase();
                    return ext === 'txt';
                };
                const txtFiles = batch.filter(f => isTextFile(f));
                const binaryFiles = batch.filter(f => !isTextFile(f));

                let parsedResults: { text: string; name: string }[] = [];

                // Handle text files locally (fast)
                const txtResults = await Promise.all(
                    txtFiles.map(async f => ({ text: await f.file.text(), name: f.name }))
                );
                parsedResults.push(...txtResults);

                // Handle PDF/Docx via batch parse API (with fallback)
                if (binaryFiles.length > 0) {
                    try {
                        const binaryFilesToParse = binaryFiles.map(f => f.file);
                        const batchParseResults = await parseResumesBatch(binaryFilesToParse);

                        // Match results back by index (preserved by backend)
                        binaryFiles.forEach((f, idx) => {
                            const result = batchParseResults[idx];
                            if (result && result.success) {
                                parsedResults.push({
                                    text: result.data.text,
                                    name: f.name
                                });
                            } else {
                                // Mark this specific file as error immediately
                                setFiles(prev => prev.map(file =>
                                    file.id === f.id ? { ...file, status: 'error' as const, error: result?.error || 'Extraction failed' } : file
                                ));
                            }
                        });
                    } catch (parseError) {
                        console.warn('Batch parse API unavailable, attempting to read binary files as text:', parseError);
                        // Fallback: try to read binary files as raw text
                        for (const f of binaryFiles) {
                            try {
                                const text = await f.file.text();
                                if (text && text.trim().length > 20) {
                                    parsedResults.push({ text, name: f.name });
                                } else {
                                    setFiles(prev => prev.map(file =>
                                        file.id === f.id ? { ...file, status: 'error' as const, error: 'AI service unavailable for PDF/DOCX parsing' } : file
                                    ));
                                }
                            } catch {
                                setFiles(prev => prev.map(file =>
                                    file.id === f.id ? { ...file, status: 'error' as const, error: 'Could not read file' } : file
                                ));
                            }
                        }
                    }
                }

                // If no files in this batch were successfully parsed, we're done with this chunk
                if (parsedResults.length === 0) return;

                // 2. STAGE 2: BATCH SCORING (Only for successfully parsed files)
                const batchItems: BatchResumeItem[] = parsedResults.map(pr => ({
                    resume_text: pr.text,
                    file_name: pr.name,
                }));

                const batchResponse = await analyzeResumesBatch(
                    batchItems,
                    jobDescription,
                    skillsFromJD
                );

                const newlyCompleted: any[] = [];
                const updatedFilesMap = new Map();

                batch.forEach(f => {
                    const parsedData = parsedResults.find(pr => pr.name.toLowerCase() === f.name.toLowerCase());
                    if (!parsedData) return;

                    const apiResult = batchResponse.results.find(r => r.file_name.toLowerCase() === f.name.toLowerCase());
                    if (apiResult) {
                        const { name, email } = extractCandidateInfo(parsedData.text, f.name);
                        
                        const jobTitle = mockJobs.find(j => j.id === selectedJobId)?.title || 'Unknown Job';
                        newlyCompleted.push({
                            id: f.id,
                            name: name || f.name,
                            email: email || 'No Email',
                            phone: 'N/A',
                            role: jobTitle,
                            location: 'Remote',
                            experience: 'N/A',
                            matchScore: apiResult.overall,
                            skills: apiResult.matched_skills,
                            status: 'new',
                            appliedFor: jobTitle
                        });

                        updatedFilesMap.set(f.id, {
                            ...f,
                            status: 'completed' as const,
                            result: {
                                fileName: apiResult.file_name,
                                candidateName: name, email,
                                overallScore: apiResult.overall,
                                status: apiResult.status,
                                matchedSkills: apiResult.matched_skills,
                                missingSkills: apiResult.missing_skills,
                                breakdown: apiResult.breakdown,
                                analyzedAt: new Date()
                            }
                        });
                    }
                });

                // Map results back to state
                setFiles(prev => prev.map(f => updatedFilesMap.has(f.id) ? updatedFilesMap.get(f.id) : f));

                if (newlyCompleted.length > 0) {
                    try {
                        const existingStr = localStorage.getItem('jobmatcher_saved_candidates');
                        const existing = existingStr ? JSON.parse(existingStr) : [];
                        localStorage.setItem('jobmatcher_saved_candidates', JSON.stringify([...existing, ...newlyCompleted]));
                    } catch (e) {
                        console.error('Failed to save to localStorage', e);
                    }
                }

            } catch (error) {
                console.error("Batch error:", error);
                setFiles(prev => prev.map(f =>
                    batch.find(b => b.id === f.id)
                        ? { ...f, status: 'error' as const, error: String(error) }
                        : f
                ));
            } finally {
                processedCount += batch.length;
                setProgress({ processed: processedCount, total: pendingFiles.length });
            }
        };

        // PARALLEL BATCH PROCESSING: Run up to 4 batches at once
        // This pipelines I/O (uploading/parsing) with CPU (scoring)
        const concurrencyLimit = 4;
        const queue = [...chunks];
        const activeWorkers: Promise<void>[] = [];

        while (queue.length > 0 || activeWorkers.length > 0) {
            while (queue.length > 0 && activeWorkers.length < concurrencyLimit) {
                const chunk = queue.shift()!;
                const worker = processChunk(chunk).then(() => {
                    activeWorkers.splice(activeWorkers.indexOf(worker), 1);
                });
                activeWorkers.push(worker);
            }
            if (activeWorkers.length > 0) {
                await Promise.race(activeWorkers);
            }
        }

        setIsAnalyzing(false);
    };

    // Remove file
    const removeFile = (id: string) => {
        setFiles(prev => prev.filter(f => f.id !== id));
    };

    // Clear all files
    const clearAllFiles = () => {
        setFiles([]);
        setProgress({ processed: 0, total: 0 });
    };

    // Export to CSV
    const exportToCSV = () => {
        const completedResults = files
            .filter(f => f.status === 'completed' && f.result)
            .map(f => f.result!);

        if (completedResults.length === 0) return;

        const headers = ['Candidate Name', 'Email', 'File Name', 'Overall Score', 'Status', 'Matched Skills', 'Missing Skills', 'Keywords', 'Skills', 'Experience', 'Education', 'Analyzed At'];
        const rows = completedResults.map(r => [
            r.candidateName,
            r.email,
            r.fileName,
            r.overallScore,
            r.status,
            r.matchedSkills.join('; '),
            r.missingSkills.join('; '),
            r.breakdown.keywords,
            r.breakdown.skills,
            r.breakdown.experience,
            r.breakdown.education,
            r.analyzedAt.toISOString()
        ]);

        const csvContent = [headers, ...rows]
            .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
            .join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `bulk_ats_analysis_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    };

    // Get filtered and sorted results
    const getFilteredResults = () => {
        let results = files.filter(f => f.status === 'completed' && f.result);

        // Apply score filter
        if (scoreFilter !== 'all') {
            results = results.filter(f => f.result?.status === scoreFilter);
        }

        // Apply sorting
        results.sort((a, b) => {
            let comparison = 0;
            switch (sortField) {
                case 'name':
                    comparison = (a.result?.candidateName || '').localeCompare(b.result?.candidateName || '');
                    break;
                case 'score':
                    comparison = (a.result?.overallScore || 0) - (b.result?.overallScore || 0);
                    break;
                case 'status':
                    comparison = (a.result?.status || '').localeCompare(b.result?.status || '');
                    break;
            }
            return sortDirection === 'asc' ? comparison : -comparison;
        });

        return results;
    };

    // Pagination
    const filteredResults = getFilteredResults();
    const totalPages = Math.ceil(filteredResults.length / itemsPerPage);
    const paginatedResults = filteredResults.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Stats
    const completedCount = files.filter(f => f.status === 'completed').length;
    const excellentCount = files.filter(f => f.result?.status === 'excellent').length;
    const goodCount = files.filter(f => f.result?.status === 'good').length;
    const partialCount = files.filter(f => f.result?.status === 'partial').length;
    const poorCount = files.filter(f => f.result?.status === 'poor').length;

    return (
        <div className="bulk-ats-page dashboard-page">
            {/* Header */}
            <div className="bulk-ats-header">
                <div className="bulk-ats-title">
                    <h1><Zap size={28} /> Bulk Resume Analyzer</h1>
                    <p>Analyze 1000+ resumes at once to find the best candidates faster</p>
                </div>
                {completedCount > 0 && (
                    <button className="btn-export" onClick={exportToCSV}>
                        <Download size={18} />
                        Export CSV ({completedCount})
                    </button>
                )}
            </div>

            {/* Job Selection */}
            <div className="bulk-ats-job-section">
                <div className="section-header">
                    <Briefcase size={20} />
                    <h3>Select Job Posting</h3>
                </div>
                <div className="ats-select-wrapper">
                    <select
                        className="ats-select"
                        value={selectedJobId}
                        onChange={(e) => handleJobSelect(e.target.value)}
                    >
                        <option value="">-- Select a job posting to analyze against --</option>
                        {mockJobs.map(job => (
                            <option key={job.id} value={job.id}>
                                {job.title} at {job.company}
                            </option>
                        ))}
                    </select>
                    <ChevronDown className="ats-select-arrow" size={16} />
                </div>
                {jobDescription && (
                    <div className="job-preview">
                        <strong>Selected:</strong> {mockJobs.find(j => j.id === selectedJobId)?.title}
                    </div>
                )}
            </div>

            {/* Upload Zone */}
            <div className="bulk-ats-upload-section">
                <div
                    className={`upload-zone ${isDragOver ? 'drag-over' : ''} ${files.length > 0 ? 'has-files' : ''} ${isExtractingZip ? 'extracting' : ''}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => !isExtractingZip && fileInputRef.current?.click()}
                >
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={(e) => e.target.files && handleFilesSelected(e.target.files)}
                        accept=".txt,.pdf,.doc,.docx,.zip"
                        multiple
                        style={{ display: 'none' }}
                    />
                    <div className="upload-zone-content">
                        {isExtractingZip ? (
                            <>
                                <Loader2 size={48} className="upload-icon animate-spin" />
                                <h3>Extracting ZIP File...</h3>
                                <p>Extracting {zipProgress.extracted} of {zipProgress.total} files</p>
                                <span className="upload-limit">Please wait</span>
                            </>
                        ) : (
                            <>
                                <FolderOpen size={48} className="upload-icon" />
                                <h3>Drag & Drop Resumes Here</h3>
                                <p>or click to browse • Supports .txt, .pdf, .doc, .docx, <strong>.zip</strong></p>
                                <div className="upload-badges">
                                    <span className="upload-limit">Upload 1000+ files</span>
                                    <span className="upload-limit zip-badge"><Archive size={14} /> ZIP folders supported</span>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* File List Preview */}
                {files.length > 0 && (
                    <div className="files-preview">
                        <div className="files-preview-header">
                            <span className="files-count">
                                <FileText size={16} />
                                {files.length} file{files.length !== 1 ? 's' : ''} selected
                            </span>
                            <button className="btn-clear-all" onClick={clearAllFiles}>
                                <X size={14} /> Clear All
                            </button>
                        </div>
                        <div className="files-list">
                            {files.slice(0, 10).map(file => (
                                <div key={file.id} className={`file-item ${file.status}`}>
                                    <FileText size={14} />
                                    <span className="file-name">{file.name}</span>
                                    <span className={`file-status ${file.status}`}>
                                        {file.status === 'pending' && 'Pending'}
                                        {file.status === 'processing' && <Loader2 size={12} className="animate-spin" />}
                                        {file.status === 'completed' && <CheckCircle size={12} />}
                                        {file.status === 'error' && <AlertTriangle size={12} />}
                                    </span>
                                    <button className="btn-remove-file" onClick={() => removeFile(file.id)}>
                                        <X size={12} />
                                    </button>
                                </div>
                            ))}
                            {files.length > 10 && (
                                <div className="files-more">+ {files.length - 10} more files</div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Analyze Button */}
            <div className="bulk-ats-actions">
                <button
                    className={`btn-analyze-bulk ${isAnalyzing ? 'analyzing' : ''}`}
                    onClick={handleBulkAnalyze}
                    disabled={files.length === 0 || !jobDescription.trim() || isAnalyzing}
                >
                    {isAnalyzing ? (
                        <>
                            <Loader2 size={20} className="animate-spin" />
                            Analyzing {progress.processed}/{progress.total}...
                        </>
                    ) : (
                        <>
                            <Sparkles size={20} />
                            Analyze All Resumes ({files.filter(f => f.status === 'pending').length})
                        </>
                    )}
                </button>
            </div>

            {/* Progress Bar */}
            {isAnalyzing && (
                <div className="bulk-progress">
                    <div className="progress-bar-container">
                        <div
                            className="progress-bar-fill"
                            style={{ width: `${(progress.processed / progress.total) * 100}%` }}
                        />
                    </div>
                    <span className="progress-text">
                        {Math.round((progress.processed / progress.total) * 100)}% Complete
                    </span>
                </div>
            )}

            {/* Results Section */}
            {completedCount > 0 && (
                <div className="bulk-results-section">
                    {/* Stats Cards */}
                    <div className="results-stats">
                        <div className="stat-card total">
                            <Users size={24} />
                            <div className="stat-info">
                                <span className="stat-value">{completedCount}</span>
                                <span className="stat-label">Analyzed</span>
                            </div>
                        </div>
                        <div className="stat-card excellent">
                            <TrendingUp size={24} />
                            <div className="stat-info">
                                <span className="stat-value">{excellentCount}</span>
                                <span className="stat-label">Excellent</span>
                            </div>
                        </div>
                        <div className="stat-card good">
                            <CheckCircle size={24} />
                            <div className="stat-info">
                                <span className="stat-value">{goodCount}</span>
                                <span className="stat-label">Good</span>
                            </div>
                        </div>
                        <div className="stat-card partial">
                            <BarChart3 size={24} />
                            <div className="stat-info">
                                <span className="stat-value">{partialCount}</span>
                                <span className="stat-label">Partial</span>
                            </div>
                        </div>
                        <div className="stat-card poor">
                            <AlertTriangle size={24} />
                            <div className="stat-info">
                                <span className="stat-value">{poorCount}</span>
                                <span className="stat-label">Poor</span>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="results-filters">
                        <div className="filter-group">
                            <Filter size={16} />
                            <div className="ats-select-wrapper">
                                <select
                                    className="ats-select"
                                    value={scoreFilter}
                                    onChange={(e) => {
                                        setScoreFilter(e.target.value as typeof scoreFilter);
                                        setCurrentPage(1);
                                    }}
                                    style={{ paddingRight: '32px' }}
                                >
                                    <option value="all">All Results</option>
                                    <option value="excellent">Excellent (80+)</option>
                                    <option value="good">Good (65-79)</option>
                                    <option value="partial">Partial (50-64)</option>
                                    <option value="poor">Poor (&lt;50)</option>
                                </select>
                                <ChevronDown className="ats-select-arrow" size={14} />
                            </div>
                        </div>
                        <div className="sort-group">
                            <button
                                className={`btn-sort ${sortField === 'score' ? 'active' : ''}`}
                                onClick={() => {
                                    if (sortField === 'score') {
                                        setSortDirection(d => d === 'asc' ? 'desc' : 'asc');
                                    } else {
                                        setSortField('score');
                                        setSortDirection('desc');
                                    }
                                }}
                            >
                                Score {sortField === 'score' && (sortDirection === 'desc' ? <SortDesc size={14} /> : <SortAsc size={14} />)}
                            </button>
                            <button
                                className={`btn-sort ${sortField === 'name' ? 'active' : ''}`}
                                onClick={() => {
                                    if (sortField === 'name') {
                                        setSortDirection(d => d === 'asc' ? 'desc' : 'asc');
                                    } else {
                                        setSortField('name');
                                        setSortDirection('asc');
                                    }
                                }}
                            >
                                Name {sortField === 'name' && (sortDirection === 'desc' ? <SortDesc size={14} /> : <SortAsc size={14} />)}
                            </button>
                        </div>
                    </div>

                    {/* Results Table */}
                    <div className="results-table-container">
                        <table className="results-table">
                            <thead>
                                <tr>
                                    <th>Candidate</th>
                                    <th>Score</th>
                                    <th>Status</th>
                                    <th>Matched Skills</th>
                                    <th>Missing Skills</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedResults.map(file => (
                                    <tr key={file.id} className={`result-row ${file.result?.status}`}>
                                        <td className="candidate-cell">
                                            <div className="candidate-info">
                                                <span className="candidate-name">{file.result?.candidateName}</span>
                                                <span className="candidate-email">{file.result?.email || file.name}</span>
                                            </div>
                                        </td>
                                        <td className="score-cell">
                                            <div className={`score-badge ${file.result?.status}`}>
                                                {file.result?.overallScore}%
                                            </div>
                                        </td>
                                        <td className="status-cell">
                                            <span className={`status-tag ${file.result?.status}`}>
                                                {file.result?.status === 'excellent' && <TrendingUp size={12} />}
                                                {file.result?.status === 'good' && <CheckCircle size={12} />}
                                                {file.result?.status === 'partial' && <BarChart3 size={12} />}
                                                {file.result?.status === 'poor' && <AlertTriangle size={12} />}
                                                {file.result?.status}
                                            </span>
                                        </td>
                                        <td className="skills-cell">
                                            <div className="skills-preview">
                                                {file.result?.matchedSkills.slice(0, 3).map((skill, i) => (
                                                    <span key={i} className="skill-chip matched">{skill}</span>
                                                ))}
                                                {(file.result?.matchedSkills.length || 0) > 3 && (
                                                    <span className="skill-more">+{file.result!.matchedSkills.length - 3}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="skills-cell">
                                            <div className="skills-preview">
                                                {file.result?.missingSkills.slice(0, 3).map((skill, i) => (
                                                    <span key={i} className="skill-chip missing">{skill}</span>
                                                ))}
                                                {(file.result?.missingSkills.length || 0) > 3 && (
                                                    <span className="skill-more">+{file.result!.missingSkills.length - 3}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="actions-cell">
                                            <button
                                                className="btn-view-details"
                                                onClick={() => setSelectedResult(file.result || null)}
                                            >
                                                <Eye size={14} /> View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="pagination">
                            <button
                                className="btn-page"
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <span className="page-info">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                className="btn-page"
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Detail Modal */}
            {selectedResult && (
                <div className="detail-modal-overlay" onClick={() => setSelectedResult(null)}>
                    <div className="detail-modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{selectedResult.candidateName}</h3>
                            <button className="btn-close" onClick={() => setSelectedResult(null)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="modal-score-section">
                                <div className={`modal-score ${selectedResult.status}`}>
                                    <span className="score-value">{selectedResult.overallScore}%</span>
                                    <span className="score-label">{selectedResult.status} match</span>
                                </div>
                            </div>

                            <div className="modal-breakdown">
                                <h4>Score Breakdown</h4>
                                <div className="breakdown-grid">
                                    <div className="breakdown-item">
                                        <span className="label">Keywords</span>
                                        <span className="value">{selectedResult.breakdown.keywords}%</span>
                                    </div>
                                    <div className="breakdown-item">
                                        <span className="label">Skills</span>
                                        <span className="value">{selectedResult.breakdown.skills}%</span>
                                    </div>
                                    <div className="breakdown-item">
                                        <span className="label">Experience</span>
                                        <span className="value">{selectedResult.breakdown.experience}%</span>
                                    </div>
                                    <div className="breakdown-item">
                                        <span className="label">Education</span>
                                        <span className="value">{selectedResult.breakdown.education}%</span>
                                    </div>
                                </div>
                            </div>

                            <div className="modal-skills">
                                <div className="skills-section matched">
                                    <h4><CheckCircle size={16} /> Matched Skills</h4>
                                    <div className="skills-list">
                                        {selectedResult.matchedSkills.map((skill, i) => (
                                            <span key={i} className="skill-chip">{skill}</span>
                                        ))}
                                        {selectedResult.matchedSkills.length === 0 && (
                                            <span className="no-skills">No matched skills</span>
                                        )}
                                    </div>
                                </div>
                                <div className="skills-section missing">
                                    <h4><AlertTriangle size={16} /> Missing Skills</h4>
                                    <div className="skills-list">
                                        {selectedResult.missingSkills.map((skill, i) => (
                                            <span key={i} className="skill-chip">{skill}</span>
                                        ))}
                                        {selectedResult.missingSkills.length === 0 && (
                                            <span className="no-skills">No missing skills!</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BulkATSAnalyzer;
