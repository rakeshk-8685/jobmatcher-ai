// ============================================
// Express App Configuration
// ============================================

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

// Import routes
const authRoutes = require('./modules/auth/auth.routes');
const jobRoutes = require('./modules/job/job.routes');
const userRoutes = require('./modules/user/user.routes');

// Import middleware
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// CORS configuration
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        service: 'jobmatcher-backend'
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/users', userRoutes);

// 404 handler
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`
    });
});

// Error handler
app.use(errorHandler);

module.exports = app;
