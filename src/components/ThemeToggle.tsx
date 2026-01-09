// ============================================
// Theme Toggle Button Component
// ============================================

import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import './ThemeToggle.css';

interface ThemeToggleProps {
    showLabel?: boolean;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ showLabel = false }) => {
    const { mode, setMode } = useTheme();

    const modes = [
        { value: 'light' as const, icon: <Sun size={18} />, label: 'Light' },
        { value: 'dark' as const, icon: <Moon size={18} />, label: 'Dark' },
        { value: 'system' as const, icon: <Monitor size={18} />, label: 'System' },
    ];

    return (
        <div className="theme-toggle">
            <div className="theme-toggle-buttons">
                {modes.map((m) => (
                    <button
                        key={m.value}
                        className={`theme-toggle-btn ${mode === m.value ? 'active' : ''}`}
                        onClick={() => setMode(m.value)}
                        title={m.label}
                        aria-label={`${m.label} theme`}
                    >
                        {m.icon}
                        {showLabel && <span className="theme-toggle-label">{m.label}</span>}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ThemeToggle;
