// Base API URL - update this to your backend API URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// Generic API call function
const apiCall = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    const defaultHeaders = {
        'Content-Type': 'application/json',
    };

    // Add Authorization header if token exists
    if (token) {
        defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    };

    try {
        const response = await fetch(url, config);
        
        // Get response text first
        const text = await response.text();
        
        if (!response.ok) {
            console.error('API Error Response:', text);
            
            // If unauthorized, redirect to login
            if (response.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
            }
            
            throw new Error(`HTTP error! status: ${response.status}, message: ${text}`);
        }
        
        // Try to parse as JSON
        try {
            const data = JSON.parse(text);
            return data;
        } catch (parseError) {
            console.error('Response is not valid JSON:', text);
            throw new Error(`Invalid JSON response: ${text.substring(0, 100)}`);
        }
    } catch (error) {
        console.error('API call failed:', error);
        throw error;
    }
};

// API methods
export const api = {
  // Get all users
  getUsers: () => apiCall('/users'),
  
  // Get single user by ID
  getUser: (id) => apiCall(`/users/${id}`),
  
  // Create new user
  createUser: (userData) => apiCall('/users', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  
  // Update user
  updateUser: (id, userData) => apiCall(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(userData),
  }),
  
  // Delete user
  deleteUser: (id) => apiCall(`/users/${id}`, {
    method: 'DELETE',
  }),

  // Get dashboard stats
  getDashboardStats: () => apiCall('/dashboard'),
  
  // Get commission logs
  getCommissionLogs: () => apiCall('/commission-logs'),
  
  // Get user referrals
  validateReferralCode: (referralCode) => apiCall(`/auth/check-referral-valid?ref=${referralCode}`),
};

export default api;