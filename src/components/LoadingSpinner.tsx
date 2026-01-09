// ============================================
// Loading Spinner Component
// ============================================

import React from 'react';
import './LoadingSpinner.css';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    fullScreen?: boolean;
    text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = 'md',
    fullScreen = false,
    text,
}) => {
    const spinner = (
        <div className={`loading-spinner-container ${fullScreen ? 'fullscreen' : ''}`}>
            <div className={`loading-spinner ${size}`}>
                <div className="spinner-ring"></div>
                <div className="spinner-ring"></div>
                <div className="spinner-ring"></div>
                <div className="spinner-core"></div>
            </div>
            {text && <p className="loading-text">{text}</p>}
        </div>
    );

    return spinner;
};

export default LoadingSpinner;
