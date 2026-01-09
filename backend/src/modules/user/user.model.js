// ============================================
// User Model
// ============================================

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters'],
        maxlength: [50, 'Name cannot exceed 50 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false // Don't include password in queries by default
    },
    role: {
        type: String,
        enum: ['user', 'recruiter', 'admin'],
        default: 'user'
    },
    avatar: {
        type: String,
        default: null
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    // Candidate-specific fields
    profile: {
        title: String,
        bio: String,
        location: String,
        phone: String,
        skills: [String],
        experience: [{
            title: String,
            company: String,
            location: String,
            startDate: Date,
            endDate: Date,
            current: Boolean,
            description: String
        }],
        education: [{
            degree: String,
            institution: String,
            field: String,
            startDate: Date,
            endDate: Date,
            gpa: Number
        }],
        resume: {
            url: String,
            filename: String,
            uploadedAt: Date,
            parsedData: Object
        },
        linkedIn: String,
        github: String,
        portfolio: String
    },
    // Recruiter-specific fields
    company: {
        name: String,
        website: String,
        logo: String,
        description: String,
        size: String,
        industry: String
    },
    refreshToken: {
        type: String,
        select: false
    }
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Get public profile (exclude sensitive fields)
userSchema.methods.toPublicJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    delete obj.refreshToken;
    delete obj.__v;
    return obj;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
