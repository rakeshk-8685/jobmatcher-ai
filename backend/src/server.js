// ============================================
// Server Entry Point
// ============================================

require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

// Connect to database and start server
const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`
╔═══════════════════════════════════════════╗
║     JobMatcher Backend API Server         ║
╠═══════════════════════════════════════════╣
║  🚀 Server running on port ${PORT}            ║
║  📦 Environment: ${process.env.NODE_ENV || 'development'}        ║
║  🔗 API: http://localhost:${PORT}/api        ║
║  ❤️  Health: http://localhost:${PORT}/health  ║
╚═══════════════════════════════════════════╝
      `);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
    process.exit(1);
});

startServer();
