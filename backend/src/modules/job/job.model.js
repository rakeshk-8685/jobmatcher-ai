// ============================================
// Job Model
// ============================================

const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Job title is required'],
        trim: true,
        maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Job description is required'],
        maxlength: [5000, 'Description cannot exceed 5000 characters']
    },
    company: {
        type: String,
        required: [true, 'Company name is required']
    },
    location: {
        type: String,
        required: [true, 'Location is required']
    },
    type: {
        type: String,
        enum: ['full-time', 'part-time', 'contract', 'internship', 'remote'],
        default: 'full-time'
    },
    experienceLevel: {
        type: String,
        enum: ['entry', 'mid', 'senior', 'lead', 'executive'],
        default: 'mid'
    },
    salary: {
        min: { type: Number, default: 0 },
        max: { type: Number, default: 0 },
        currency: { type: String, default: 'USD' },
        isVisible: { type: Boolean, default: true }
    },
    skills: [{
        type: String,
        trim: true
    }],
    requirements: [{
        type: String
    }],
    benefits: [{
        type: String
    }],
    recruiter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['draft', 'pending', 'active', 'closed', 'rejected'],
        default: 'pending'
    },
    applicationsCount: {
        type: Number,
        default: 0
    },
    viewsCount: {
        type: Number,
        default: 0
    },
    deadline: {
        type: Date
    },
    // For AI matching
    embedding: {
        type: [Number],
        select: false
    }
}, {
    timestamps: true
});

// Index for search
jobSchema.index({ title: 'text', description: 'text', skills: 'text' });
jobSchema.index({ status: 1, createdAt: -1 });
jobSchema.index({ recruiter: 1 });

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
