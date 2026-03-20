// ============================================
// Jobs API Service
// CRUD operations for job postings
// ============================================

import api from './api';

export interface JobData {
    id?: string;
    _id?: string;
    title: string;
    company: string;
    location: string;
    type: 'full-time' | 'part-time' | 'contract' | 'internship' | 'remote';
    experienceLevel: 'entry' | 'mid' | 'senior' | 'lead' | 'executive';
    salary: {
        min: number;
        max: number;
        currency?: string;
        isVisible?: boolean;
    };
    description: string;
    requirements: string[];
    skills: string[];
    benefits?: string[];
    status?: 'draft' | 'pending' | 'active' | 'closed' | 'rejected';
    recruiter?: {
        _id: string;
        name: string;
        company?: string;
    };
    applicationsCount?: number;
    viewsCount?: number;
    createdAt?: string;
    updatedAt?: string;
    deadline?: string;
}

export interface JobFilters {
    search?: string;
    type?: string;
    experienceLevel?: string;
    minSalary?: number;
    maxSalary?: number;
    skills?: string;
    page?: number;
    limit?: number;
}

export interface JobsResponse {
    jobs: JobData[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

// Get all jobs with optional filters
export async function getJobs(filters?: JobFilters): Promise<JobData[]> {
    try {
        const params = new URLSearchParams();

        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== '') {
                    params.append(key, String(value));
                }
            });
        }

        const queryString = params.toString();
        const endpoint = `/jobs${queryString ? `?${queryString}` : ''}`;

        const response = await api.get<JobData[]>(endpoint);
        return response.data || [];
    } catch (error) {
        console.error('Error fetching jobs:', error);
        return [];
    }
}

// Get single job by ID
export async function getJob(id: string): Promise<JobData | null> {
    try {
        const response = await api.get<JobData>(`/jobs/${id}`);
        return response.data || null;
    } catch (error) {
        console.error('Error fetching job:', error);
        return null;
    }
}

// Create a new job (Recruiter only)
export async function createJob(jobData: Partial<JobData>): Promise<JobData | null> {
    try {
        const response = await api.post<JobData>('/jobs', jobData);
        return response.data || null;
    } catch (error) {
        console.error('Error creating job:', error);
        throw error;
    }
}

// Update a job (Recruiter - owner only)
export async function updateJob(id: string, jobData: Partial<JobData>): Promise<JobData | null> {
    try {
        const response = await api.put<JobData>(`/jobs/${id}`, jobData);
        return response.data || null;
    } catch (error) {
        console.error('Error updating job:', error);
        throw error;
    }
}

// Delete a job (Recruiter - owner only)
export async function deleteJob(id: string): Promise<boolean> {
    try {
        await api.delete(`/jobs/${id}`);
        return true;
    } catch (error) {
        console.error('Error deleting job:', error);
        throw error;
    }
}

// Get recruiter's own jobs
export async function getMyJobs(): Promise<JobData[]> {
    try {
        const response = await api.get<JobData[]>('/jobs/my-jobs');
        return response.data || [];
    } catch (error) {
        console.error('Error fetching my jobs:', error);
        return [];
    }
}

export default {
    getJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob,
    getMyJobs,
};
