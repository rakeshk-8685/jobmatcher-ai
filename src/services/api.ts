// ============================================
// Base API Service
// Centralized HTTP client for all API calls
// ============================================

const API_BASE_URL = 'http://localhost:5000/api';

interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
    pagination?: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

// Get auth token from localStorage
const getAuthToken = (): string | null => {
    const stored = localStorage.getItem('jobmatcher_auth');
    if (stored) {
        try {
            const parsed = JSON.parse(stored);
            // In AuthContext we store the whole user object. 
            // We need to ensure the token is stored there or accessible.
            // Wait, looking at AuthContext, it stores the 'User' object.
            // The User object in types typically doesn't have the token.
            // We need to check if we are storing the token.
            return parsed.token || parsed.accessToken || null;
        } catch {
            return null;
        }
    }
    return null;
};

// Create headers with auth token
const createHeaders = (includeAuth: boolean = true): HeadersInit => {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };

    if (includeAuth) {
        const token = getAuthToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    }

    return headers;
};

// Generic API request function
async function apiRequest<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<ApiResponse<T>> {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers: {
                ...createHeaders(true),
                ...options.headers,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'API request failed');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// HTTP Methods
export const api = {
    get: <T>(endpoint: string) =>
        apiRequest<T>(endpoint, { method: 'GET' }),

    post: <T>(endpoint: string, body: unknown) =>
        apiRequest<T>(endpoint, {
            method: 'POST',
            body: JSON.stringify(body),
        }),

    put: <T>(endpoint: string, body: unknown) =>
        apiRequest<T>(endpoint, {
            method: 'PUT',
            body: JSON.stringify(body),
        }),

    patch: <T>(endpoint: string, body: unknown) =>
        apiRequest<T>(endpoint, {
            method: 'PATCH',
            body: JSON.stringify(body),
        }),

    delete: <T>(endpoint: string) =>
        apiRequest<T>(endpoint, { method: 'DELETE' }),
};

export default api;
export { API_BASE_URL, getAuthToken };
