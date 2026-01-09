// ============================================
// JobMatcher AI Portal - TypeScript Types
// Production-Ready Type Definitions
// ============================================

// User Roles
export type UserRole = 'admin' | 'user' | 'recruiter';

// Authentication Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
  role: UserRole;
}

export interface RegisterData extends LoginCredentials {
  name: string;
  confirmPassword: string;
}

// Job Related Types
export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: JobType;
  experience: ExperienceLevel;
  salary: SalaryRange;
  description: string;
  requirements: string[];
  skills: string[];
  benefits: string[];
  postedBy: string;
  postedAt: Date;
  deadline: Date;
  status: JobStatus;
  applicationsCount: number;
  matchScore?: number;
}

export type JobType = 'full-time' | 'part-time' | 'contract' | 'internship' | 'remote';
export type ExperienceLevel = 'entry' | 'mid' | 'senior' | 'lead' | 'executive';
export type JobStatus = 'active' | 'paused' | 'closed' | 'draft' | 'pending';

export interface SalaryRange {
  min: number;
  max: number;
  currency: string;
  period: 'hourly' | 'monthly' | 'yearly';
}

// Candidate/User Profile Types
export interface CandidateProfile {
  userId: string;
  headline: string;
  summary: string;
  experience: WorkExperience[];
  education: Education[];
  skills: Skill[];
  certifications: Certification[];
  resume: ResumeData | null;
  atsScore: ATSScore;
  preferences: JobPreferences;
}

export interface WorkExperience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: Date;
  endDate: Date | null;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  degree: string;
  field: string;
  institution: string;
  startDate: Date;
  endDate: Date;
  grade?: string;
}

export interface Skill {
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  yearsOfExperience: number;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: Date;
  expiryDate?: Date;
  credentialId?: string;
}

export interface ResumeData {
  id: string;
  fileName: string;
  fileUrl: string;
  uploadedAt: Date;
  parsedData?: ParsedResumeData;
}

export interface ParsedResumeData {
  extractedSkills: string[];
  extractedExperience: number;
  extractedEducation: string[];
  keywords: string[];
}

export interface ATSScore {
  overall: number;
  breakdown: ATSScoreBreakdown;
  suggestions: ATSSuggestion[];
  lastUpdated: Date;
}

export interface ATSScoreBreakdown {
  keywords: number;
  formatting: number;
  experience: number;
  education: number;
  skills: number;
}

export interface ATSSuggestion {
  category: keyof ATSScoreBreakdown;
  priority: 'high' | 'medium' | 'low';
  message: string;
  action: string;
}

export interface JobPreferences {
  roles: string[];
  locations: string[];
  jobTypes: JobType[];
  salaryExpectation: SalaryRange;
  remotePreference: 'remote' | 'hybrid' | 'onsite' | 'any';
}

// Application Types
export interface Application {
  id: string;
  jobId: string;
  job: Job;
  candidateId: string;
  candidate?: CandidateProfile;
  status: ApplicationStatus;
  appliedAt: Date;
  updatedAt: Date;
  matchScore: number;
  coverLetter?: string;
  notes?: string;
}

export type ApplicationStatus = 
  | 'pending'
  | 'reviewing'
  | 'shortlisted'
  | 'interview'
  | 'offered'
  | 'accepted'
  | 'rejected'
  | 'withdrawn';

// Recruiter Types
export interface RecruiterProfile {
  userId: string;
  company: string;
  position: string;
  department: string;
  companyLogo?: string;
  totalJobsPosted: number;
  totalHires: number;
}

// Admin Types
export interface AdminStats {
  totalUsers: number;
  totalRecruiters: number;
  totalJobs: number;
  totalApplications: number;
  activeJobs: number;
  pendingApprovals: number;
}

export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  details: string;
  timestamp: Date;
  ipAddress?: string;
}

// AI Matching Types
export interface MatchResult {
  jobId: string;
  candidateId: string;
  matchScore: number;
  matchBreakdown: MatchBreakdown;
  recommendations: string[];
}

export interface MatchBreakdown {
  skillsMatch: number;
  experienceMatch: number;
  educationMatch: number;
  keywordsMatch: number;
  locationMatch: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// UI Component Types
export interface NavItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

export interface MenuItem {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
  href?: string;
  divider?: boolean;
}

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string;
}

// Form Types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'file';
  placeholder?: string;
  required?: boolean;
  options?: SelectOption[];
  validation?: ValidationRule[];
}

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface ValidationRule {
  type: 'required' | 'email' | 'minLength' | 'maxLength' | 'pattern' | 'custom';
  value?: string | number | RegExp;
  message: string;
}

// Notification Types
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

// Filter & Sort Types
export interface JobFilters {
  search?: string;
  type?: JobType[];
  experience?: ExperienceLevel[];
  location?: string[];
  salaryMin?: number;
  salaryMax?: number;
  remote?: boolean;
}

export interface SortOption {
  field: string;
  direction: 'asc' | 'desc';
}
