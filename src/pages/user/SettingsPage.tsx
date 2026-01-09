// ============================================
// Settings Page
// User preferences and account settings
// ============================================

import React, { useState } from 'react';
import {
    Settings,
    Bell,
    Lock,
    Eye,
    Moon,
    Sun,
    Monitor,
    Mail,
    Shield,
    Trash2,
    Save,
    LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import '../user/Dashboard.css';

const SettingsPage: React.FC = () => {
    const { user, logout } = useAuth();
    const { mode, setMode } = useTheme();

    const [settings, setSettings] = useState({
        emailNotifications: true,
        pushNotifications: false,
        jobAlerts: true,
        applicationUpdates: true,
        marketingEmails: false,
        profileVisibility: 'public',
        showSalary: true,
        showLocation: true,
    });

    const handleToggle = (key: keyof typeof settings) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="dashboard-page">
            <div className="page-header">
                <div>
                    <h1 className="dashboard-title">
                        <Settings size={28} /> Settings
                    </h1>
                    <p className="dashboard-subtitle">
                        Manage your account preferences and privacy settings
                    </p>
                </div>
            </div>

            <div className="settings-grid">
                {/* Appearance */}
                <div className="card settings-card">
                    <div className="settings-header">
                        <Moon size={20} />
                        <h3>Appearance</h3>
                    </div>
                    <p className="settings-description">Customize how JobMatcher looks on your device</p>

                    <div className="theme-selector">
                        <button
                            className={`theme-option ${mode === 'light' ? 'active' : ''}`}
                            onClick={() => setMode('light')}
                        >
                            <Sun size={20} />
                            <span>Light</span>
                        </button>
                        <button
                            className={`theme-option ${mode === 'dark' ? 'active' : ''}`}
                            onClick={() => setMode('dark')}
                        >
                            <Moon size={20} />
                            <span>Dark</span>
                        </button>
                        <button
                            className={`theme-option ${mode === 'system' ? 'active' : ''}`}
                            onClick={() => setMode('system')}
                        >
                            <Monitor size={20} />
                            <span>System</span>
                        </button>
                    </div>
                </div>

                {/* Notifications */}
                <div className="card settings-card">
                    <div className="settings-header">
                        <Bell size={20} />
                        <h3>Notifications</h3>
                    </div>
                    <p className="settings-description">Choose what notifications you receive</p>

                    <div className="settings-options">
                        <div className="settings-option">
                            <div>
                                <span className="option-label">Email Notifications</span>
                                <span className="option-description">Receive updates via email</span>
                            </div>
                            <label className="toggle">
                                <input
                                    type="checkbox"
                                    checked={settings.emailNotifications}
                                    onChange={() => handleToggle('emailNotifications')}
                                />
                                <span className="toggle-slider"></span>
                            </label>
                        </div>

                        <div className="settings-option">
                            <div>
                                <span className="option-label">Job Alerts</span>
                                <span className="option-description">Get notified about new matching jobs</span>
                            </div>
                            <label className="toggle">
                                <input
                                    type="checkbox"
                                    checked={settings.jobAlerts}
                                    onChange={() => handleToggle('jobAlerts')}
                                />
                                <span className="toggle-slider"></span>
                            </label>
                        </div>

                        <div className="settings-option">
                            <div>
                                <span className="option-label">Application Updates</span>
                                <span className="option-description">Status changes on your applications</span>
                            </div>
                            <label className="toggle">
                                <input
                                    type="checkbox"
                                    checked={settings.applicationUpdates}
                                    onChange={() => handleToggle('applicationUpdates')}
                                />
                                <span className="toggle-slider"></span>
                            </label>
                        </div>

                        <div className="settings-option">
                            <div>
                                <span className="option-label">Marketing Emails</span>
                                <span className="option-description">Tips, news, and special offers</span>
                            </div>
                            <label className="toggle">
                                <input
                                    type="checkbox"
                                    checked={settings.marketingEmails}
                                    onChange={() => handleToggle('marketingEmails')}
                                />
                                <span className="toggle-slider"></span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Privacy */}
                <div className="card settings-card">
                    <div className="settings-header">
                        <Eye size={20} />
                        <h3>Privacy</h3>
                    </div>
                    <p className="settings-description">Control your profile visibility</p>

                    <div className="settings-options">
                        <div className="settings-option">
                            <div>
                                <span className="option-label">Profile Visibility</span>
                                <span className="option-description">Who can see your profile</span>
                            </div>
                            <select
                                className="input select-sm"
                                value={settings.profileVisibility}
                                onChange={(e) => setSettings({ ...settings, profileVisibility: e.target.value })}
                            >
                                <option value="public">Public</option>
                                <option value="recruiters">Recruiters Only</option>
                                <option value="private">Private</option>
                            </select>
                        </div>

                        <div className="settings-option">
                            <div>
                                <span className="option-label">Show Salary Expectations</span>
                                <span className="option-description">Display your salary range to recruiters</span>
                            </div>
                            <label className="toggle">
                                <input
                                    type="checkbox"
                                    checked={settings.showSalary}
                                    onChange={() => handleToggle('showSalary')}
                                />
                                <span className="toggle-slider"></span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Security */}
                <div className="card settings-card">
                    <div className="settings-header">
                        <Lock size={20} />
                        <h3>Security</h3>
                    </div>
                    <p className="settings-description">Manage your account security</p>

                    <div className="settings-actions">
                        <button className="btn btn-secondary">
                            <Lock size={16} /> Change Password
                        </button>
                        <button className="btn btn-secondary">
                            <Shield size={16} /> Two-Factor Authentication
                        </button>
                    </div>
                </div>

                {/* Account */}
                <div className="card settings-card">
                    <div className="settings-header">
                        <Mail size={20} />
                        <h3>Account</h3>
                    </div>
                    <p className="settings-description">Manage your account</p>

                    <div className="account-info">
                        <div className="account-item">
                            <span>Email</span>
                            <span>{user?.email}</span>
                        </div>
                        <div className="account-item">
                            <span>Account ID</span>
                            <span>{user?.id}</span>
                        </div>
                        <div className="account-item">
                            <span>Role</span>
                            <span className="role-badge">{user?.role}</span>
                        </div>
                    </div>

                    <div className="settings-actions danger-zone">
                        <button className="btn btn-secondary" onClick={logout}>
                            <LogOut size={16} /> Sign Out
                        </button>
                        <button className="btn btn-danger">
                            <Trash2 size={16} /> Delete Account
                        </button>
                    </div>
                </div>
            </div>

            <div className="settings-footer">
                <button className="btn btn-primary">
                    <Save size={18} /> Save All Changes
                </button>
            </div>
        </div>
    );
};

export default SettingsPage;
