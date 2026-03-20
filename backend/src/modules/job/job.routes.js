// ============================================
// Job Routes
// ============================================

const express = require('express');
const router = express.Router();
const jobController = require('./job.controller');
const { protect, authorize } = require('../../middlewares/auth');

// Public routes
router.get('/', jobController.getJobs);
router.get('/:id', jobController.getJob);

// Protected routes (Recruiter only)
router.get('/my-jobs', protect, authorize('recruiter', 'admin'), jobController.getMyJobs);
router.post('/', protect, authorize('recruiter', 'admin'), jobController.createJob);
router.put('/:id', protect, authorize('recruiter', 'admin'), jobController.updateJob);
router.delete('/:id', protect, authorize('recruiter', 'admin'), jobController.deleteJob);

module.exports = router;
