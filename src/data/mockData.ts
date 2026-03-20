// ============================================
// Mock Data for Development
// Production: Replace with API calls
// ============================================

import type {
    User,
    Job,
    CandidateProfile,
    Application,
    ATSScore,
    RecruiterProfile,
    AdminStats,
    Notification,
} from '../types';

// Demo Account Credentials - UNIQUE for each role
// Use these exact credentials to log in
export const demoCredentials = {
    user: {
        email: 'candidate@demo.com',
        password: 'candidate123',
        id: 'USR-001-CAND'
    },
    recruiter: {
        email: 'recruiter@demo.com',
        password: 'recruiter123',
        id: 'USR-002-RECR'
    },
    admin: {
        email: 'admin@demo.com',
        password: 'admin123',
        id: 'USR-003-ADMN'
    }
};

// Mock Users with hashed passwords (in production, these would be hashed)
export const mockUsers: (User & { password: string })[] = [
    {
        id: demoCredentials.user.id,
        email: demoCredentials.user.email,
        password: demoCredentials.user.password,
        name: 'John Developer',
        role: 'user',
        avatar: undefined,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-12-01'),
    },
    {
        id: demoCredentials.recruiter.id,
        email: demoCredentials.recruiter.email,
        password: demoCredentials.recruiter.password,
        name: 'Sarah Wilson',
        role: 'recruiter',
        avatar: undefined,
        createdAt: new Date('2024-02-10'),
        updatedAt: new Date('2024-11-28'),
    },
    {
        id: demoCredentials.admin.id,
        email: demoCredentials.admin.email,
        password: demoCredentials.admin.password,
        name: 'Admin User',
        role: 'admin',
        avatar: undefined,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-12-10'),
    },
];

// Mock Jobs
export const mockJobs: Job[] = [
    {
        id: 'job-1',
        title: 'Senior Frontend Developer',
        company: 'TechCorp Inc.',
        location: 'San Francisco, CA',
        type: 'full-time',
        experience: 'senior',
        salary: { min: 1200000, max: 1800000, currency: 'INR', period: 'yearly' },
        description: 'We are looking for a Senior Frontend Developer to join our team and help build amazing user experiences.',
        requirements: [
            '5+ years of experience with React',
            'Strong TypeScript skills',
            'Experience with state management',
            'Excellent communication skills',
        ],
        skills: ['React', 'TypeScript', 'Next.js', 'CSS', 'GraphQL'],
        benefits: ['Health Insurance', 'Remote Work', '401k', 'Unlimited PTO'],
        postedBy: 'recruiter-1',
        postedAt: new Date('2024-12-01'),
        deadline: new Date('2025-01-31'),
        status: 'active',
        applicationsCount: 45,
        matchScore: 92,
    },
    {
        id: 'job-2',
        title: 'Full Stack Engineer',
        company: 'StartupXYZ',
        location: 'New York, NY',
        type: 'full-time',
        experience: 'mid',
        salary: { min: 1200000, max: 1600000, currency: 'INR', period: 'yearly' },
        description: 'Join our backend team to build scalable services using Node.js and MongoDB.',
        requirements: [
            '3+ years of backend development',
            'Strong knowledge of Node.js and Express',
            'Experience with MongoDB and Redis',
            'Knowledge of RESTful API design',
            'Familiarity with Docker and Kubernetes'
        ],
        skills: ['Node.js', 'MongoDB', 'Redis', 'Docker', 'AWS'],
        benefits: ['Remote Work', 'Competitive Salary', 'Health Insurance'],
        postedBy: 'recruiter-1',
        postedAt: new Date('2024-12-05'),
        deadline: new Date('2025-02-15'),
        status: 'active',
        applicationsCount: 8,
        matchScore: 85,
    },
    {
        id: 'job-3',
        title: 'Full Stack Engineer',
        company: 'Innovate Solutions',
        location: 'Remote',
        type: 'contract',
        experience: 'mid',
        salary: { min: 1400000, max: 1800000, currency: 'INR', period: 'yearly' },
        description: 'We need a versatile engineer who can handle both frontend and backend tasks.',
        requirements: [
            'Proficiency in React and Node.js',
            'Experience with SQL databases',
            'Understanding of CI/CD pipelines',
            'Ability to work independently'
        ],
        skills: ['React', 'Node.js', 'PostgreSQL', 'Git', 'CI/CD'],
        benefits: ['Flexible Hours', 'Project Bonus'],
        postedBy: 'recruiter-1',
        postedAt: new Date('2024-12-08'),
        deadline: new Date('2025-01-20'),
        status: 'active',
        applicationsCount: 15,
        matchScore: 78,
    },
    {
        id: 'job-4',
        title: 'Product Designer',
        company: 'Design Studio',
        location: 'New York, NY',
        type: 'full-time',
        experience: 'entry',
        salary: { min: 800000, max: 1200000, currency: 'INR', period: 'yearly' },
        description: 'Looking for a creative product designer to join our award-winning design team.',
        requirements: [
            'Portfolio showcasing UI/UX design skills',
            'Proficiency in Figma and Adobe XD',
            'Understanding of design systems',
            'Good communication skills'
        ],
        skills: ['Figma', 'UI/UX', 'Prototyping', 'User Research'],
        benefits: ['Creative Freedom', 'Health Insurance', 'Gym Membership', 'Flexible Hours'],
        postedBy: 'recruiter-1',
        postedAt: new Date('2024-12-10'),
        deadline: new Date('2025-02-01'),
        status: 'closed',
        applicationsCount: 25,
        matchScore: 65,
    },
    {
        id: 'job-5',
        title: 'DevOps Engineer',
        company: 'Cloud Systems',
        location: 'Austin, TX',
        type: 'full-time',
        experience: 'senior',
        salary: { min: 1800000, max: 2500000, currency: 'INR', period: 'yearly' },
        description: 'Help us scale our infrastructure and improve our deployment processes.',
        requirements: [
            'Strong experience with AWS',
            'Expertise in Terraform and Ansible',
            'Experience with Kubernetes in production',
            'Scripting skills in Python or Bash'
        ],
        skills: ['AWS', 'Terraform', 'Kubernetes', 'Python', 'CI/CD'],
        benefits: ['Stock Options', 'Relocation Assistance', 'Comprehensive Benefits'],
        postedBy: 'recruiter-1',
        postedAt: new Date('2024-12-03'),
        deadline: new Date('2025-01-25'),
        status: 'active',
        applicationsCount: 5,
        matchScore: 72,
    },
];

// Mock ATS Score
export const mockATSScore: ATSScore = {
    overall: 78,
    breakdown: {
        keywords: 82,
        formatting: 90,
        experience: 75,
        education: 85,
        skills: 65,
    },
    suggestions: [
        {
            category: 'skills',
            priority: 'high',
            message: 'Add more technical skills mentioned in your target job descriptions',
            action: 'Include skills like TypeScript, GraphQL, and CI/CD in your resume',
        },
        {
            category: 'keywords',
            priority: 'medium',
            message: 'Optimize for ATS by using exact job title keywords',
            action: 'Use "Senior Frontend Developer" instead of "Lead UI Engineer"',
        },
        {
            category: 'experience',
            priority: 'medium',
            message: 'Quantify your achievements with numbers',
            action: 'Add metrics like "Improved performance by 40%" to your work experience',
        },
    ],
    lastUpdated: new Date(),
};

// Mock Candidate Profile
export const mockCandidateProfile: CandidateProfile = {
    userId: 'user-1',
    headline: 'Senior Frontend Developer | React & TypeScript Expert',
    summary: 'Passionate frontend developer with 6+ years of experience building scalable web applications. Specialized in React ecosystem and modern JavaScript.',
    experience: [
        {
            id: 'exp-1',
            title: 'Senior Frontend Developer',
            company: 'WebTech Solutions',
            location: 'San Francisco, CA',
            startDate: new Date('2021-03-01'),
            endDate: null,
            current: true,
            description: 'Leading frontend development for enterprise SaaS platform. Improved performance by 40% and reduced bundle size by 60%.',
        },
        {
            id: 'exp-2',
            title: 'Frontend Developer',
            company: 'Digital Agency Co',
            location: 'New York, NY',
            startDate: new Date('2018-06-01'),
            endDate: new Date('2021-02-28'),
            current: false,
            description: 'Developed responsive web applications for clients across various industries using React and Vue.js.',
        },
    ],
    education: [
        {
            id: 'edu-1',
            degree: 'Bachelor of Science',
            field: 'Computer Science',
            institution: 'University of California, Berkeley',
            startDate: new Date('2014-09-01'),
            endDate: new Date('2018-05-31'),
            grade: '3.8 GPA',
        },
    ],
    skills: [
        { name: 'React', level: 'expert', yearsOfExperience: 5 },
        { name: 'TypeScript', level: 'expert', yearsOfExperience: 4 },
        { name: 'JavaScript', level: 'expert', yearsOfExperience: 6 },
        { name: 'CSS/SCSS', level: 'advanced', yearsOfExperience: 6 },
        { name: 'Node.js', level: 'intermediate', yearsOfExperience: 3 },
        { name: 'GraphQL', level: 'intermediate', yearsOfExperience: 2 },
    ],
    certifications: [
        {
            id: 'cert-1',
            name: 'AWS Certified Developer',
            issuer: 'Amazon Web Services',
            issueDate: new Date('2023-06-15'),
            expiryDate: new Date('2026-06-15'),
            credentialId: 'AWS-DEV-12345',
        },
    ],
    resume: {
        id: 'resume-1',
        fileName: 'john_doe_resume.pdf',
        fileUrl: '/resumes/john_doe_resume.pdf',
        uploadedAt: new Date('2024-11-15'),
        parsedData: {
            extractedSkills: ['React', 'TypeScript', 'JavaScript', 'Node.js', 'CSS'],
            extractedExperience: 6,
            extractedEducation: ['BS Computer Science'],
            keywords: ['frontend', 'react', 'typescript', 'web development'],
        },
    },
    atsScore: mockATSScore,
    preferences: {
        roles: ['Senior Frontend Developer', 'Lead Engineer', 'Tech Lead'],
        locations: ['San Francisco', 'New York', 'Remote'],
        jobTypes: ['full-time', 'remote'],
        salaryExpectation: { min: 150000, max: 200000, currency: 'INR', period: 'yearly' },
        remotePreference: 'hybrid',
    },
};

// Mock Applications
export const mockApplications: Application[] = [
    {
        id: 'app-1',
        jobId: 'job-1',
        job: mockJobs[0],
        candidateId: 'user-1',
        status: 'interview',
        appliedAt: new Date('2024-12-05'),
        updatedAt: new Date('2024-12-10'),
        matchScore: 92,
        coverLetter: 'I am excited to apply for this position...',
    },
    {
        id: 'app-2',
        jobId: 'job-2',
        job: mockJobs[1],
        candidateId: 'user-1',
        status: 'reviewing',
        appliedAt: new Date('2024-12-08'),
        updatedAt: new Date('2024-12-08'),
        matchScore: 85,
    },
    {
        id: 'app-3',
        jobId: 'job-3',
        job: mockJobs[2],
        candidateId: 'user-1',
        status: 'pending',
        appliedAt: new Date('2024-12-10'),
        updatedAt: new Date('2024-12-10'),
        matchScore: 78,
    },
];

// Mock Recruiter Profile
export const mockRecruiterProfile: RecruiterProfile = {
    userId: 'recruiter-1',
    company: 'TechCorp Inc.',
    position: 'Senior Technical Recruiter',
    department: 'Engineering',
    companyLogo: undefined,
    totalJobsPosted: 24,
    totalHires: 18,
};

// Mock Admin Stats
export const mockAdminStats: AdminStats = {
    totalUsers: 15420,
    totalRecruiters: 892,
    totalJobs: 3456,
    totalApplications: 87654,
    activeJobs: 1234,
    pendingApprovals: 45,
};

// Mock Notifications
export const mockNotifications: Notification[] = [
    {
        id: 'notif-1',
        type: 'success',
        title: 'Application Viewed',
        message: 'TechCorp Inc. viewed your application for Senior Frontend Developer',
        timestamp: new Date('2024-12-10T14:30:00'),
        read: false,
        actionUrl: '/user/applications',
    },
    {
        id: 'notif-2',
        type: 'info',
        title: 'New Job Match',
        message: '5 new jobs match your profile with 80%+ compatibility',
        timestamp: new Date('2024-12-10T10:00:00'),
        read: false,
        actionUrl: '/user/jobs',
    },
    {
        id: 'notif-3',
        type: 'warning',
        title: 'Profile Incomplete',
        message: 'Complete your profile to improve your match score',
        timestamp: new Date('2024-12-09T16:00:00'),
        read: true,
        actionUrl: '/user/profile',
    },
];

// Mock Chart Data
export const mockApplicationsChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
        {
            label: 'Applications',
            data: [120, 190, 300, 500, 420, 380, 450, 520, 600, 780, 890, 950],
            backgroundColor: 'rgba(99, 102, 241, 0.5)',
            borderColor: 'rgb(99, 102, 241)',
        },
    ],
};

export const mockHiresChartData = {
    labels: ['Engineering', 'Design', 'Marketing', 'Sales', 'Operations'],
    datasets: [
        {
            label: 'Hires by Department',
            data: [45, 25, 20, 30, 15],
            backgroundColor: [
                'rgba(99, 102, 241, 0.8)',
                'rgba(244, 114, 182, 0.8)',
                'rgba(6, 182, 212, 0.8)',
                'rgba(16, 185, 129, 0.8)',
                'rgba(245, 158, 11, 0.8)',
            ],
        },
    ],
};
