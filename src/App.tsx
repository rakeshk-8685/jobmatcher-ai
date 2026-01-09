// ============================================
// Main App - Routing Configuration
// ============================================

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';

// Public Pages
import LandingPage from './pages/LandingPage';
import JobsPage from './pages/JobsPage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Dashboard Pages
import UserDashboard from './pages/user/UserDashboard';
import RecruiterDashboard from './pages/recruiter/RecruiterDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';

// Styles
import './pages/PagesStyles.css';

// Placeholder pages for additional routes
const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => (
  <div className="dashboard-page">
    <h1 className="dashboard-title">{title}</h1>
    <p className="dashboard-subtitle">This page is under construction.</p>
    <div className="card" style={{ marginTop: '2rem', padding: '3rem', textAlign: 'center' }}>
      <p style={{ color: 'var(--color-text-tertiary)' }}>Coming soon...</p>
    </div>
  </div>
);

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/jobs" element={<JobsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* User Routes */}
            <Route path="/user" element={
              <ProtectedRoute allowedRoles={['user']}>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<UserDashboard />} />
              <Route path="profile" element={<PlaceholderPage title="My Profile" />} />
              <Route path="jobs" element={<PlaceholderPage title="Job Matches" />} />
              <Route path="applications" element={<PlaceholderPage title="My Applications" />} />
              <Route path="ats-score" element={<PlaceholderPage title="ATS Score Analysis" />} />
            </Route>

            {/* Recruiter Routes */}
            <Route path="/recruiter" element={
              <ProtectedRoute allowedRoles={['recruiter']}>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<RecruiterDashboard />} />
              <Route path="post-job" element={<PlaceholderPage title="Post a New Job" />} />
              <Route path="candidates" element={<PlaceholderPage title="AI-Matched Candidates" />} />
              <Route path="jobs" element={<PlaceholderPage title="My Job Postings" />} />
              <Route path="applicants" element={<PlaceholderPage title="All Applicants" />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users" element={<PlaceholderPage title="User Management" />} />
              <Route path="jobs" element={<PlaceholderPage title="Job Moderation" />} />
              <Route path="analytics" element={<PlaceholderPage title="Platform Analytics" />} />
              <Route path="settings" element={<PlaceholderPage title="System Settings" />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
