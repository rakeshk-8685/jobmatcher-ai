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

// User Dashboard Pages
import UserDashboard from './pages/user/UserDashboard';
import ProfilePage from './pages/user/ProfilePage';
import JobMatchesPage from './pages/user/JobMatchesPage';
import ApplicationsPage from './pages/user/ApplicationsPage';
import SettingsPage from './pages/user/SettingsPage';
import ATSScorePage from './pages/user/ATSScorePage';

// Recruiter Dashboard Pages
import RecruiterDashboard from './pages/recruiter/RecruiterDashboard';
import RecruiterATSPage from './pages/recruiter/RecruiterATSPage';
import BulkATSAnalyzer from './pages/recruiter/BulkATSAnalyzer';
import PostJobPage from './pages/recruiter/PostJobPage';
import AIMatchingPage from './pages/recruiter/AIMatchingPage';
import MyJobsPage from './pages/recruiter/MyJobsPage';

// Admin Dashboard Pages
import AdminDashboard from './pages/admin/AdminDashboard';

// Styles
import './pages/PagesStyles.css';
import './pages/user/DashboardPages.css';

// Placeholder for pages not yet implemented
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
              <Route path="profile" element={<ProfilePage />} />
              <Route path="jobs" element={<JobMatchesPage />} />
              <Route path="applications" element={<ApplicationsPage />} />
              <Route path="ats-score" element={<ATSScorePage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>

            {/* Recruiter Routes */}
            <Route path="/recruiter" element={
              <ProtectedRoute allowedRoles={['recruiter']}>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<RecruiterDashboard />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="post-job" element={<PostJobPage />} />
              <Route path="candidates" element={<AIMatchingPage />} />
              <Route path="jobs" element={<MyJobsPage />} />
              <Route path="applicants" element={<ApplicationsPage />} />
              <Route path="ats-analyzer" element={<RecruiterATSPage />} />
              <Route path="bulk-ats-analyzer" element={<BulkATSAnalyzer />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="users" element={<PlaceholderPage title="User Management" />} />
              <Route path="jobs" element={<PlaceholderPage title="Job Moderation" />} />
              <Route path="analytics" element={<PlaceholderPage title="Platform Analytics" />} />
              <Route path="settings" element={<SettingsPage />} />
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

