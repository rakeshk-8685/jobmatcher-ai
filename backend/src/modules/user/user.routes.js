// ============================================
// User Routes
// ============================================

const express = require('express');
const router = express.Router();
const userController = require('./user.controller');
const { protect } = require('../../middlewares/auth');

// Protect all routes
router.use(protect);

router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);

module.exports = router;
