// ============================================
// User Controller
// ============================================

const User = require('./user.model');

// @desc    Get current user profile
// @route   GET /api/users/profile
// @access  Private
exports.getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            data: user.toPublicJSON()
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
    try {
        // Prevent password update via this route
        if (req.body.password) {
            delete req.body.password;
        }

        // Prevent role update via this route
        if (req.body.role) {
            delete req.body.role;
        }

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Update basic fields
        if (req.body.name) user.name = req.body.name;
        if (req.body.avatar) user.avatar = req.body.avatar;

        // Update profile fields for ALL users (everyone has personal details)
        if (req.body.profile) {
            user.profile = {
                ...user.profile,
                ...req.body.profile
            };
        }

        // Map flat fields to profile for convenience
        if (!user.profile) user.profile = {};
        if (req.body.headline) user.profile.title = req.body.headline;
        if (req.body.summary) user.profile.bio = req.body.summary;
        if (req.body.phone) user.profile.phone = req.body.phone;
        if (req.body.location) user.profile.location = req.body.location;

        if (req.body.linkedIn) user.profile.linkedIn = req.body.linkedIn;
        if (req.body.github) user.profile.github = req.body.github;
        if (req.body.portfolio) user.profile.portfolio = req.body.portfolio;

        // Specific handling for Recruiter Company info
        if (user.role === 'recruiter' && req.body.company) {
            user.company = {
                ...user.company,
                ...req.body.company
            };
        }

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: user.toPublicJSON()
        });
    } catch (error) {
        next(error);
    }
};
