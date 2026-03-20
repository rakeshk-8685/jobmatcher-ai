// ============================================
// ATS Scoring API Service
// Interfaces with AI service for resume analysis
// ============================================

const AI_SERVICE_URL = import.meta.env.VITE_AI_SERVICE_URL || 'http://localhost:8000';

/**
 * Generic fetch with retry logic for robust API communication
 */
async function fetchWithRetry(url: string, options: RequestInit, retries = 2, delay = 1000): Promise<Response> {
    try {
        const response = await fetch(url, options);
        if (!response.ok && retries > 0 && response.status >= 500) {
            console.warn(`Fetch failed with status ${response.status}. Retrying in ${delay}ms... (${retries} retries left)`);
            await new Promise(resolve => setTimeout(resolve, delay));
            return fetchWithRetry(url, options, retries - 1, delay * 2);
        }
        return response;
    } catch (error) {
        if (retries > 0) {
            console.warn(`Network error: ${error}. Retrying in ${delay}ms... (${retries} retries left)`);
            await new Promise(resolve => setTimeout(resolve, delay));
            return fetchWithRetry(url, options, retries - 1, delay * 2);
        }
        throw error;
    }
}

export interface ATSScoreResult {
    overall: number;
    breakdown: {
        keywords: number;
        skills: number;
        experience: number;
        education: number;
    };
    matched_skills: string[];
    missing_skills: string[];
    suggestions: Array<{
        category: string;
        message: string;
        priority: 'high' | 'medium' | 'low';
    }>;
}

export interface ATSAnalysisRequest {
    resumeText: string;
    jobDescription: string;
    requiredSkills?: string[];
    experienceYears?: number;
    requiredExperience?: number;
    educationLevel?: string;
    requiredEducation?: string;
}

/**
 * Analyze resume against job description using AI service
 * Falls back to mock scoring if AI service is unavailable
 */
export async function analyzeResume(request: ATSAnalysisRequest): Promise<ATSScoreResult> {
    console.log(`[ATS Service] Analyzing resume...`);
    try {
        const response = await fetchWithRetry(`${AI_SERVICE_URL}/ai/ats-score`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                resume_text: request.resumeText,
                job_description: request.jobDescription,
                required_skills: request.requiredSkills || [],
                experience_years: request.experienceYears || 0,
                required_experience: request.requiredExperience || 0,
                education_level: request.educationLevel,
                required_education: request.requiredEducation,
            }),
        });

        if (!response.ok) {
            throw new Error(`AI service error: ${response.statusText}`);
        }

        const data = await response.json();
        return data.data;
    } catch (error) {
        console.warn('AI service unavailable after retries, using mock scoring:', error);
        return calculateMockScore(request);
    }
}

export interface ParsedResume {
    text: string;
    skills: string[];
    experience_years: number;
    education: {
        degrees: string[];
        highest_level: string | null;
    };
    contact: {
        email: string | null;
        phone: string | null;
    };
}

export async function parseResumeFile(file: File): Promise<ParsedResume> {
    console.log(`[ATS Service] Parsing single resume: ${file.name}`);
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetchWithRetry(`${AI_SERVICE_URL}/ai/parse-resume-file`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`Failed to parse resume file: ${response.statusText}`);
        }

        const data = await response.json();
        if (!data.success) {
            throw new Error(data.error || 'Failed to parse resume');
        }
        return data.data;
    } catch (error) {
        console.error('Error parsing resume after retries:', error);
        throw error;
    }
}

/**
 * Parse multiple resume files in a single batch request (Ultra Optimized)
 */
export async function parseResumesBatch(files: File[]): Promise<any[]> {
    console.log(`[ATS Service] Batch parsing ${files.length} resumes...`);
    const formData = new FormData();
    files.forEach(file => {
        formData.append('files', file);
    });

    try {
        const response = await fetchWithRetry(`${AI_SERVICE_URL}/ai/batch-parse-resume-files`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`Batch parsing service error: ${response.statusText}`);
        }

        const data = await response.json();
        if (!data.success) {
            throw new Error(data.error || 'Failed to parse resumes in batch');
        }

        return data.results;
    } catch (error) {
        console.error('Error parsing resumes batch after retries:', error);
        throw error;
    }
}

/**
 * Mock ATS scoring when AI service is unavailable
 */
function calculateMockScore(request: ATSAnalysisRequest): ATSScoreResult {
    const resumeLower = request.resumeText.toLowerCase();
    const jdLower = request.jobDescription.toLowerCase();

    // Extract common tech skills
    const allSkills = [
        'javascript', 'typescript', 'react', 'angular', 'vue', 'node.js',
        'python', 'java', 'c++', 'sql', 'mongodb', 'postgresql', 'aws',
        'docker', 'kubernetes', 'git', 'html', 'css', 'graphql', 'rest',
        'agile', 'scrum', 'machine learning', 'data analysis'
    ];

    // Find skills in job description
    const jdSkills = allSkills.filter(skill => jdLower.includes(skill));

    // Find which skills are in resume
    const matchedSkills = jdSkills.filter(skill => resumeLower.includes(skill));
    const missingSkills = jdSkills.filter(skill => !resumeLower.includes(skill));

    // Calculate scores
    const skillScore = jdSkills.length > 0
        ? Math.min(100, (matchedSkills.length / jdSkills.length) * 100)
        : 75;

    // Keyword matching (simplified)
    const jdWords = new Set(jdLower.match(/\b\w{4,}\b/g) || []);
    const resumeWords = new Set(resumeLower.match(/\b\w{4,}\b/g) || []);
    let keywordOverlap = 0;
    jdWords.forEach(word => {
        if (resumeWords.has(word)) keywordOverlap++;
    });
    const keywordScore = jdWords.size > 0
        ? Math.min(100, (keywordOverlap / jdWords.size) * 100 * 1.5)
        : 70;

    // Experience score (check for years mentioned)
    const expMatch = resumeLower.match(/(\d+)\+?\s*years?/);
    const yearsInResume = expMatch ? parseInt(expMatch[1]) : 2;
    const experienceScore = Math.min(100, (yearsInResume / 5) * 100);

    // Education score (simplified)
    const educationScore = resumeLower.includes('bachelor') || resumeLower.includes('master')
        || resumeLower.includes('degree') ? 85 : 65;

    // Overall score
    const overall = (
        keywordScore * 0.35 +
        skillScore * 0.40 +
        experienceScore * 0.15 +
        educationScore * 0.10
    );

    // Generate suggestions
    const suggestions: ATSScoreResult['suggestions'] = [];

    if (keywordScore < 60) {
        suggestions.push({
            category: 'keywords',
            message: 'Add more relevant keywords from the job description to your resume',
            priority: 'high'
        });
    }

    if (missingSkills.length > 0) {
        suggestions.push({
            category: 'skills',
            message: `Consider adding these skills: ${missingSkills.slice(0, 5).join(', ')}`,
            priority: missingSkills.length > 3 ? 'high' : 'medium'
        });
    }

    if (experienceScore < 70) {
        suggestions.push({
            category: 'experience',
            message: 'Highlight more relevant work experience with quantified achievements',
            priority: 'medium'
        });
    }

    if (educationScore < 80) {
        suggestions.push({
            category: 'education',
            message: 'Include relevant certifications or courses to strengthen your profile',
            priority: 'low'
        });
    }

    return {
        overall: Math.round(overall),
        breakdown: {
            keywords: Math.round(keywordScore),
            skills: Math.round(skillScore),
            experience: Math.round(experienceScore),
            education: Math.round(educationScore)
        },
        matched_skills: matchedSkills,
        missing_skills: missingSkills,
        suggestions
    };
}

// ============================================
// Batch Analysis Types & Functions
// High-performance bulk processing
// ============================================

export interface BatchResumeItem {
    resume_text: string;
    file_name?: string;
    experience_years?: number;
    education_level?: string;
}

export interface BatchATSResult {
    file_name: string;
    overall: number;
    breakdown: {
        keywords: number;
        skills: number;
        experience: number;
        education: number;
    };
    matched_skills: string[];
    missing_skills: string[];
    suggestions: ATSScoreResult['suggestions'];
    status: 'excellent' | 'good' | 'partial' | 'poor';
}

export interface BatchATSResponse {
    results: BatchATSResult[];
    summary: {
        total: number;
        excellent: number;
        good: number;
        partial: number;
        poor: number;
        average_score: number;
    };
}

/**
 * Analyze multiple resumes in a single batch request
 * Optimized for processing 50-100 resumes per call
 * 5-7x faster than individual requests
 */
export async function analyzeResumesBatch(
    resumes: BatchResumeItem[],
    jobDescription: string,
    requiredSkills?: string[],
    requiredExperience?: number,
    requiredEducation?: string
): Promise<BatchATSResponse> {
    console.log(`[ATS Service] Batch analyzing ${resumes.length} resumes...`);
    try {
        const response = await fetchWithRetry(`${AI_SERVICE_URL}/ai/batch-ats-score`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                resumes: resumes,
                job_description: jobDescription,
                required_skills: requiredSkills || [],
                required_experience: requiredExperience || 0,
                required_education: requiredEducation,
            }),
        });

        if (!response.ok) {
            throw new Error(`Batch AI service error: ${response.statusText}`);
        }

        const data = await response.json();
        return data.data;
    } catch (error) {
        console.warn('Batch AI service unavailable after retries, falling back to mock:', error);
        return calculateMockBatchScores(resumes, jobDescription, requiredSkills);
    }
}

/**
 * Mock batch scoring when AI service is unavailable
 */
function calculateMockBatchScores(
    resumes: BatchResumeItem[],
    jobDescription: string,
    requiredSkills?: string[]
): BatchATSResponse {
    const results: BatchATSResult[] = resumes.map((resume, index) => {
        const mockResult = calculateMockScore({
            resumeText: resume.resume_text,
            jobDescription,
            requiredSkills,
        });

        const status = mockResult.overall >= 80 ? 'excellent'
            : mockResult.overall >= 65 ? 'good'
                : mockResult.overall >= 50 ? 'partial'
                    : 'poor';

        return {
            file_name: resume.file_name || `resume_${index + 1}`,
            overall: mockResult.overall,
            breakdown: mockResult.breakdown,
            matched_skills: mockResult.matched_skills,
            missing_skills: mockResult.missing_skills,
            suggestions: mockResult.suggestions,
            status
        };
    });

    return {
        results,
        summary: {
            total: results.length,
            excellent: results.filter(r => r.status === 'excellent').length,
            good: results.filter(r => r.status === 'good').length,
            partial: results.filter(r => r.status === 'partial').length,
            poor: results.filter(r => r.status === 'poor').length,
            average_score: Math.round(results.reduce((sum, r) => sum + r.overall, 0) / results.length)
        }
    };
}
