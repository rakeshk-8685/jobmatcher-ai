// ============================================
// Application Model
// ============================================

const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    candidate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'reviewing', 'shortlisted', 'interview', 'rejected', 'hired'],
        default: 'pending'
    },
    coverLetter: {
        type: String,
        maxlength: [2000, 'Cover letter cannot exceed 2000 characters']
    },
    resume: {
        url: String,
        filename: String
    },
    // AI Matching Scores
    matchScores: {
        ats: {
            overall: { type: Number, default: 0 },
            keywords: { type: Number, default: 0 },
            skills: { type: Number, default: 0 },
            experience: { type: Number, default: 0 },
            education: { type: Number, default: 0 }
        },
        aiSimilarity: { type: Number, default: 0 },
        finalScore: { type: Number, default: 0 }
    },
    suggestions: [{
        category: String,
        message: String,
        priority: { type: String, enum: ['low', 'medium', 'high'] }
    }],
    notes: [{
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        content: String,
        createdAt: { type: Date, default: Date.now }
    }],
    interviewDate: Date,
    rejectionReason: String
}, {
    timestamps: true
});

// Ensure a candidate can only apply once per job
applicationSchema.index({ job: 1, candidate: 1 }, { unique: true });
applicationSchema.index({ candidate: 1, status: 1 });
applicationSchema.index({ job: 1, status: 1 });

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;
