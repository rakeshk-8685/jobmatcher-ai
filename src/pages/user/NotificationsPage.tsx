// ============================================
// Notifications Page Component
// Complete notification management interface
// ============================================

import React, { useState } from 'react';
import {
    Bell,
    BellOff,
    CheckCheck,
    Trash2,
    Filter,
    Search,
    Briefcase,
    UserCheck,
    Info,
    CheckCircle,
    Clock,
    MoreVertical,
    Mail,
    MailOpen,
    Settings,
} from 'lucide-react';
import './NotificationsPage.css';

// Notification types
type NotificationType = 'application' | 'interview' | 'offer' | 'message' | 'system' | 'reminder';
type NotificationPriority = 'high' | 'medium' | 'low';

interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    timestamp: Date;
    read: boolean;
    priority: NotificationPriority;
    actionUrl?: string;
    sender?: {
        name: string;
        avatar?: string;
        company?: string;
    };
}

// Mock notifications data
const mockNotifications: Notification[] = [
    {
        id: '1',
        type: 'application',
        title: 'Application Received',
        message: 'Your application for Senior React Developer at TechCorp has been received and is under review.',
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
        read: false,
        priority: 'high',
        actionUrl: '/user/applications',
        sender: { name: 'TechCorp', company: 'TechCorp Inc.' },
    },
    {
        id: '2',
        type: 'interview',
        title: 'Interview Scheduled',
        message: 'Congratulations! You have been scheduled for an interview with Google on Jan 20, 2026 at 2:00 PM.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        read: false,
        priority: 'high',
        actionUrl: '/user/applications',
        sender: { name: 'Google', company: 'Google LLC' },
    },
    {
        id: '3',
        type: 'offer',
        title: 'Job Offer Received! 🎉',
        message: 'Amazon has extended a job offer for the Full Stack Developer position. Review the offer details.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
        read: false,
        priority: 'high',
        actionUrl: '/user/applications',
        sender: { name: 'Amazon', company: 'Amazon Web Services' },
    },
    {
        id: '4',
        type: 'message',
        title: 'New Message from Recruiter',
        message: 'Hi! I came across your profile and think you would be a great fit for our team. Would you be interested in discussing?',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        read: true,
        priority: 'medium',
        sender: { name: 'Sarah Johnson', company: 'Microsoft' },
    },
    {
        id: '5',
        type: 'system',
        title: 'Profile Optimization Tips',
        message: 'Your ATS score is 72%. Add more relevant keywords to improve your chances by 25%.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
        read: true,
        priority: 'low',
        actionUrl: '/user/ats-score',
    },
    {
        id: '6',
        type: 'reminder',
        title: 'Application Deadline Reminder',
        message: 'The application deadline for Frontend Engineer at Netflix is in 2 days. Complete your application now!',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
        read: true,
        priority: 'medium',
        actionUrl: '/jobs',
    },
    {
        id: '7',
        type: 'application',
        title: 'Application Status Updated',
        message: 'Your application for UI/UX Designer at Spotify has moved to the shortlist stage.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4), // 4 days ago
        read: true,
        priority: 'medium',
        actionUrl: '/user/applications',
        sender: { name: 'Spotify', company: 'Spotify AB' },
    },
    {
        id: '8',
        type: 'system',
        title: 'Welcome to JobMatcher AI',
        message: 'Your account has been created successfully. Complete your profile to start matching with the best opportunities.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 7 days ago
        read: true,
        priority: 'low',
        actionUrl: '/user/profile',
    },
];

const NotificationsPage: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
    const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
    const [typeFilter, setTypeFilter] = useState<NotificationType | 'all'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilterMenu, setShowFilterMenu] = useState(false);
    const [selectedNotification, setSelectedNotification] = useState<string | null>(null);

    // Get notification icon based on type
    const getNotificationIcon = (type: NotificationType) => {
        switch (type) {
            case 'application': return <Briefcase size={20} />;
            case 'interview': return <UserCheck size={20} />;
            case 'offer': return <CheckCircle size={20} />;
            case 'message': return <Mail size={20} />;
            case 'system': return <Info size={20} />;
            case 'reminder': return <Clock size={20} />;
            default: return <Bell size={20} />;
        }
    };

    // Get notification color class based on type
    const getNotificationColor = (type: NotificationType) => {
        switch (type) {
            case 'application': return 'notification-blue';
            case 'interview': return 'notification-purple';
            case 'offer': return 'notification-green';
            case 'message': return 'notification-cyan';
            case 'system': return 'notification-gray';
            case 'reminder': return 'notification-orange';
            default: return 'notification-gray';
        }
    };

    // Format timestamp
    const formatTime = (date: Date) => {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        return date.toLocaleDateString();
    };

    // Filter notifications
    const filteredNotifications = notifications.filter(n => {
        if (filter === 'unread' && n.read) return false;
        if (filter === 'read' && !n.read) return false;
        if (typeFilter !== 'all' && n.type !== typeFilter) return false;
        if (searchQuery && !n.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !n.message.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
    });

    // Actions
    const markAsRead = (id: string) => {
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, read: true } : n)
        );
    };

    const markAsUnread = (id: string) => {
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, read: false } : n)
        );
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const deleteNotification = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
        setSelectedNotification(null);
    };

    const deleteAllRead = () => {
        setNotifications(prev => prev.filter(n => !n.read));
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="notifications-page">
            {/* Header */}
            <div className="notifications-header">
                <div className="notifications-header-left">
                    <div className="notifications-icon-wrapper">
                        <Bell size={28} />
                        {unreadCount > 0 && (
                            <span className="notifications-badge">{unreadCount}</span>
                        )}
                    </div>
                    <div>
                        <h1 className="notifications-title">Notifications</h1>
                        <p className="notifications-subtitle">
                            {unreadCount > 0
                                ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
                                : 'All caught up! No unread notifications'}
                        </p>
                    </div>
                </div>
                <div className="notifications-header-actions">
                    <button
                        className="btn btn-secondary"
                        onClick={markAllAsRead}
                        disabled={unreadCount === 0}
                    >
                        <CheckCheck size={18} />
                        Mark All Read
                    </button>
                    <button
                        className="btn btn-ghost"
                        onClick={deleteAllRead}
                        disabled={notifications.filter(n => n.read).length === 0}
                    >
                        <Trash2 size={18} />
                        Clear Read
                    </button>
                    <button className="btn btn-ghost btn-icon">
                        <Settings size={18} />
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="notifications-filters">
                <div className="notifications-search">
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Search notifications..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="notifications-filter-tabs">
                    <button
                        className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        All
                        <span className="filter-count">{notifications.length}</span>
                    </button>
                    <button
                        className={`filter-tab ${filter === 'unread' ? 'active' : ''}`}
                        onClick={() => setFilter('unread')}
                    >
                        Unread
                        <span className="filter-count">{unreadCount}</span>
                    </button>
                    <button
                        className={`filter-tab ${filter === 'read' ? 'active' : ''}`}
                        onClick={() => setFilter('read')}
                    >
                        Read
                        <span className="filter-count">{notifications.length - unreadCount}</span>
                    </button>
                </div>
                <div className="notifications-type-filter">
                    <button
                        className="btn btn-ghost btn-icon"
                        onClick={() => setShowFilterMenu(!showFilterMenu)}
                    >
                        <Filter size={18} />
                    </button>
                    {showFilterMenu && (
                        <div className="filter-dropdown">
                            <button
                                className={typeFilter === 'all' ? 'active' : ''}
                                onClick={() => { setTypeFilter('all'); setShowFilterMenu(false); }}
                            >
                                All Types
                            </button>
                            <button
                                className={typeFilter === 'application' ? 'active' : ''}
                                onClick={() => { setTypeFilter('application'); setShowFilterMenu(false); }}
                            >
                                <Briefcase size={16} /> Applications
                            </button>
                            <button
                                className={typeFilter === 'interview' ? 'active' : ''}
                                onClick={() => { setTypeFilter('interview'); setShowFilterMenu(false); }}
                            >
                                <UserCheck size={16} /> Interviews
                            </button>
                            <button
                                className={typeFilter === 'offer' ? 'active' : ''}
                                onClick={() => { setTypeFilter('offer'); setShowFilterMenu(false); }}
                            >
                                <CheckCircle size={16} /> Offers
                            </button>
                            <button
                                className={typeFilter === 'message' ? 'active' : ''}
                                onClick={() => { setTypeFilter('message'); setShowFilterMenu(false); }}
                            >
                                <Mail size={16} /> Messages
                            </button>
                            <button
                                className={typeFilter === 'system' ? 'active' : ''}
                                onClick={() => { setTypeFilter('system'); setShowFilterMenu(false); }}
                            >
                                <Info size={16} /> System
                            </button>
                            <button
                                className={typeFilter === 'reminder' ? 'active' : ''}
                                onClick={() => { setTypeFilter('reminder'); setShowFilterMenu(false); }}
                            >
                                <Clock size={16} /> Reminders
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Notifications List */}
            <div className="notifications-list">
                {filteredNotifications.length === 0 ? (
                    <div className="notifications-empty">
                        <BellOff size={64} />
                        <h3>No notifications</h3>
                        <p>
                            {filter === 'unread'
                                ? 'You\'ve read all your notifications!'
                                : 'No notifications match your filters'}
                        </p>
                    </div>
                ) : (
                    filteredNotifications.map((notification) => (
                        <div
                            key={notification.id}
                            className={`notification-item ${!notification.read ? 'unread' : ''} ${selectedNotification === notification.id ? 'selected' : ''
                                } ${notification.priority === 'high' ? 'priority-high' : ''}`}
                            onClick={() => {
                                markAsRead(notification.id);
                                setSelectedNotification(
                                    selectedNotification === notification.id ? null : notification.id
                                );
                            }}
                        >
                            <div className={`notification-icon ${getNotificationColor(notification.type)}`}>
                                {getNotificationIcon(notification.type)}
                            </div>
                            <div className="notification-content">
                                <div className="notification-header">
                                    <h4 className="notification-item-title">{notification.title}</h4>
                                    <span className="notification-time">{formatTime(notification.timestamp)}</span>
                                </div>
                                <p className="notification-message">{notification.message}</p>
                                {notification.sender && (
                                    <div className="notification-sender">
                                        <div className="sender-avatar">
                                            {notification.sender.name.charAt(0)}
                                        </div>
                                        <span>{notification.sender.company || notification.sender.name}</span>
                                    </div>
                                )}
                                {selectedNotification === notification.id && (
                                    <div className="notification-actions">
                                        {notification.actionUrl && (
                                            <a href={notification.actionUrl} className="btn btn-primary btn-sm">
                                                View Details
                                            </a>
                                        )}
                                        <button
                                            className="btn btn-ghost btn-sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                notification.read
                                                    ? markAsUnread(notification.id)
                                                    : markAsRead(notification.id);
                                            }}
                                        >
                                            {notification.read ? (
                                                <><Mail size={14} /> Mark Unread</>
                                            ) : (
                                                <><MailOpen size={14} /> Mark Read</>
                                            )}
                                        </button>
                                        <button
                                            className="btn btn-ghost btn-sm btn-danger"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                deleteNotification(notification.id);
                                            }}
                                        >
                                            <Trash2 size={14} /> Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                            {!notification.read && <div className="notification-unread-dot" />}
                            <button
                                className="notification-more-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedNotification(
                                        selectedNotification === notification.id ? null : notification.id
                                    );
                                }}
                            >
                                <MoreVertical size={16} />
                            </button>
                        </div>
                    ))
                )}
            </div>

            {/* Quick Stats */}
            <div className="notifications-stats">
                <div className="stat-card">
                    <div className="stat-icon notification-blue">
                        <Briefcase size={20} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">{notifications.filter(n => n.type === 'application').length}</span>
                        <span className="stat-label">Applications</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon notification-purple">
                        <UserCheck size={20} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">{notifications.filter(n => n.type === 'interview').length}</span>
                        <span className="stat-label">Interviews</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon notification-green">
                        <CheckCircle size={20} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">{notifications.filter(n => n.type === 'offer').length}</span>
                        <span className="stat-label">Offers</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon notification-cyan">
                        <Mail size={20} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">{notifications.filter(n => n.type === 'message').length}</span>
                        <span className="stat-label">Messages</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotificationsPage;
