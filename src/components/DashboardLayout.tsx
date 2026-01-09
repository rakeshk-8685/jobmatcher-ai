// ============================================
// Dashboard Layout Component
// Wrapper for all dashboard pages
// ============================================

import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu, Bell, Search } from 'lucide-react';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';
import './DashboardLayout.css';

const DashboardLayout: React.FC = () => {
    const { user } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="dashboard-layout">
            {/* Sidebar */}
            <Sidebar />

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="dashboard-overlay"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <main className="dashboard-main">
                {/* Top Bar */}
                <header className="dashboard-topbar">
                    <div className="dashboard-topbar-left">
                        <button
                            className="dashboard-menu-btn"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                        >
                            <Menu size={24} />
                        </button>
                        <div className="dashboard-search">
                            <Search size={18} className="dashboard-search-icon" />
                            <input
                                type="text"
                                placeholder="Search jobs, candidates..."
                                className="dashboard-search-input"
                            />
                        </div>
                    </div>

                    <div className="dashboard-topbar-right">
                        <button className="dashboard-icon-btn">
                            <Bell size={20} />
                            <span className="dashboard-notification-badge">3</span>
                        </button>
                        <div className="dashboard-user-info">
                            <span className="dashboard-user-greeting">
                                Welcome back, <strong>{user?.name.split(' ')[0]}</strong>
                            </span>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="dashboard-content">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
