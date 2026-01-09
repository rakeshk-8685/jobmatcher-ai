// ============================================
// Seed Data for Development
// ============================================

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../modules/user/user.model');
const Job = require('../modules/job/job.model');

const seedData = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing data
        await User.deleteMany({});
        await Job.deleteMany({});
        console.log('Cleared existing data');

        // Create users
        const hashedPassword = await bcrypt.hash('password123', 12);

        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@jobmatcher.com',
            password: hashedPassword,
            role: 'admin',
            isVerified: true
        });

        const recruiter = await User.create({
            name: 'Sarah Recruiter',
            email: 'recruiter@techcorp.com',
            password: hashedPassword,
            role: 'recruiter',
            isVerified: true,
            company: {
                name: 'TechCorp Inc.',
                website: 'https://techcorp.example.com',
                industry: 'Technology',
                size: '500-1000'
            }
        });

        const candidate = await User.create({
            name: 'John Developer',
            email: 'john@email.com',
            password: hashedPassword,
            role: 'user',
            isVerified: true,
            profile: {
                title: 'Full Stack Developer',
                bio: 'Passionate developer with 5 years of experience',
                location: 'San Francisco, CA',
                skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'TypeScript', 'Python'],
                experience: [{
                    title: 'Senior Developer',
                    company: 'StartupXYZ',
                    location: 'San Francisco, CA',
                    startDate: new Date('2021-01-01'),
                    current: true,
                    description: 'Building scalable web applications'
                }],
                education: [{
                    degree: 'Bachelor of Science',
                    institution: 'Stanford University',
                    field: 'Computer Science',
                    endDate: new Date('2019-05-01')
                }]
            }
        });

        console.log('✅ Users created');

        // Create jobs
        const jobs = await Job.insertMany([
            {
                title: 'Senior Frontend Developer',
                description: 'We are looking for an experienced Frontend Developer to join our team. You will be responsible for building user interfaces using React and TypeScript.',
                company: 'TechCorp Inc.',
                location: 'San Francisco, CA',
                type: 'full-time',
                experienceLevel: 'senior',
                salary: { min: 150000, max: 200000, currency: 'USD' },
                skills: ['React', 'TypeScript', 'CSS', 'Redux', 'GraphQL'],
                requirements: [
                    '5+ years of frontend development experience',
                    'Strong React and TypeScript skills',
                    'Experience with state management'
                ],
                benefits: ['Health insurance', '401k', 'Remote work', 'Unlimited PTO'],
                recruiter: recruiter._id,
                status: 'active'
            },
            {
                title: 'Full Stack Engineer',
                description: 'Join our engineering team to build end-to-end features. You will work with React, Node.js, and PostgreSQL.',
                company: 'TechCorp Inc.',
                location: 'Remote',
                type: 'remote',
                experienceLevel: 'mid',
                salary: { min: 120000, max: 160000, currency: 'USD' },
                skills: ['React', 'Node.js', 'PostgreSQL', 'Docker', 'AWS'],
                requirements: [
                    '3+ years of full stack development',
                    'Experience with cloud platforms',
                    'Strong problem-solving skills'
                ],
                benefits: ['Health insurance', 'Stock options', 'Learning budget'],
                recruiter: recruiter._id,
                status: 'active'
            },
            {
                title: 'Junior React Developer',
                description: 'Great opportunity for junior developers to grow their skills in a supportive environment.',
                company: 'TechCorp Inc.',
                location: 'New York, NY',
                type: 'full-time',
                experienceLevel: 'entry',
                salary: { min: 70000, max: 90000, currency: 'USD' },
                skills: ['React', 'JavaScript', 'HTML', 'CSS', 'Git'],
                requirements: [
                    'Bachelor\'s degree in CS or related field',
                    'Basic understanding of React',
                    'Eagerness to learn'
                ],
                benefits: ['Mentorship program', 'Health insurance', 'Training'],
                recruiter: recruiter._id,
                status: 'active'
            }
        ]);

        console.log('✅ Jobs created');

        console.log(`
╔═══════════════════════════════════════════════╗
║         Seed Data Created Successfully         ║
╠═══════════════════════════════════════════════╣
║  Users:                                        ║
║  - admin@jobmatcher.com (Admin)               ║
║  - recruiter@techcorp.com (Recruiter)         ║
║  - john@email.com (Candidate)                 ║
║                                                ║
║  Password for all: password123                 ║
║                                                ║
║  Jobs: ${jobs.length} job postings created               ║
╚═══════════════════════════════════════════════╝
    `);

        process.exit(0);
    } catch (error) {
        console.error('Seed error:', error);
        process.exit(1);
    }
};

seedData();
