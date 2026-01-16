// ============================================
// Job Controller
// ============================================

const Job = require('./job.model');

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
exports.getJobs = async (req, res) => {
    try {
        const {
            search,
            type,
            experienceLevel,
            minSalary,
            maxSalary,
            skills,
            page = 1,
            limit = 10
        } = req.query;

        // Build query
        const query = { status: 'active' };

        if (search) {
            query.$text = { $search: search };
        }

        if (type) {
            query.type = type;
        }

        if (experienceLevel) {
            query.experienceLevel = experienceLevel;
        }

        if (minSalary) {
            query['salary.min'] = { $gte: parseInt(minSalary) };
        }

        if (maxSalary) {
            query['salary.max'] = { $lte: parseInt(maxSalary) };
        }

        if (skills) {
            const skillsList = skills.split(',').map(s => s.trim());
            query.skills = { $in: skillsList };
        }

        // Pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const jobs = await Job.find(query)
            .populate('recruiter', 'name company')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Job.countDocuments(query);

        res.json({
            success: true,
            data: jobs,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        console.error('Get jobs error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching jobs'
        });
    }
};

// @desc    Get recruiter's own jobs
// @route   GET /api/jobs/my-jobs
// @access  Private (Recruiter)
exports.getMyJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ recruiter: req.user._id })
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: jobs
        });
    } catch (error) {
        console.error('Get my jobs error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching your jobs'
        });
    }
};


// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
exports.getJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id)
            .populate('recruiter', 'name company');

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        // Increment view count
        job.viewsCount += 1;
        await job.save();

        res.json({
            success: true,
            data: job
        });
    } catch (error) {
        console.error('Get job error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching job'
        });
    }
};

// @desc    Create job
// @route   POST /api/jobs
// @access  Private (Recruiter)
exports.createJob = async (req, res) => {
    try {
        const jobData = {
            ...req.body,
            recruiter: req.user._id,
            company: req.user.company?.name || req.body.company
        };

        const job = await Job.create(jobData);

        res.status(201).json({
            success: true,
            data: job
        });
    } catch (error) {
        console.error('Create job error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating job'
        });
    }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private (Recruiter - owner only)
exports.updateJob = async (req, res) => {
    try {
        let job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        // Check ownership
        if (job.recruiter.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this job'
            });
        }

        job = await Job.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.json({
            success: true,
            data: job
        });
    } catch (error) {
        console.error('Update job error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating job'
        });
    }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private (Recruiter - owner only)
exports.deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        // Check ownership
        if (job.recruiter.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this job'
            });
        }

        await job.deleteOne();

        res.json({
            success: true,
            message: 'Job deleted successfully'
        });
    } catch (error) {
        console.error('Delete job error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting job'
        });
    }
};
