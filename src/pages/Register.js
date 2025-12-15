import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    referralId: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [referralValidation, setReferralValidation] = useState({
    isValidating: false,
    isValid: false,
    referrerInfo: null,
    error: null
  });
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Validate referral code when it changes
  useEffect(() => {
    const validateReferralCode = async () => {
      const referralId = formData.referralId.trim();
      
      // Reset validation if empty
      if (!referralId) {
        setReferralValidation({
          isValidating: false,
          isValid: false,
          referrerInfo: null,
          error: null
        });
        return;
      }

      // Start validation
      setReferralValidation(prev => ({ ...prev, isValidating: true }));

      try {
        const response = await api.validateReferralCode(referralId);
        if(!response.isValid){
          return setReferralValidation({
            isValidating: false,
            isValid: false,
            referrerInfo: null,
            error: 'Invalid referral code'
          });
        }
        setReferralValidation({
          isValidating: false,
          isValid: response.isValid,
          referrerInfo: response.userName ?? 'N/A',
          error: null
        });
      } catch (err) {
        setReferralValidation({
          isValidating: false,
          isValid: false,
          referrerInfo: null,
          error: 'Invalid referral code'
        });
      }
    };

    // Debounce the validation (wait 500ms after user stops typing)
    const timeoutId = setTimeout(validateReferralCode, 500);
    
    return () => clearTimeout(timeoutId);
  }, [formData.referralId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const registerURL = process.env.REACT_APP_API_URL+'/auth/register';
      const response = await fetch(registerURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          referralId: formData.referralId || null
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      login(data.token, data.user);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-600">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Create Account</h1>
          <p className="text-gray-600 mt-2">Sign up to get started</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Create a password"
              required
              minLength="6"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Confirm your password"
              required
            />
          </div>

          {/* Referral ID field with validation */}
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="referralId">
              Referral ID (optional)
            </label>
            <div className="relative">
              <input
                type="text"
                id="referralId"
                name="referralId"
                value={formData.referralId}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  referralValidation.isValid 
                    ? 'border-green-500 focus:ring-green-500' 
                    : referralValidation.error 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-purple-500'
                }`}
                placeholder="Enter referral ID if you have one"
              />
              
              {/* Validation indicator */}
              {referralValidation.isValidating && (
                <div className="absolute right-3 top-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-500"></div>
                </div>
              )}
              
              {referralValidation.isValid && (
                <div className="absolute right-3 top-3">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
              
              {referralValidation.error && (
                <div className="absolute right-3 top-3">
                  <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            
            {/* Show referrer information if valid */}
            {referralValidation.isValid && referralValidation.referrerInfo && (
              <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  <span className="font-semibold">✓ Valid referral code</span>
                </p>
                <p className="text-sm text-green-700 mt-1">
                  Referred by: <span className="font-semibold">{referralValidation.referrerInfo}</span>
                </p>
                {referralValidation.referrerInfo.email && (
                  <p className="text-xs text-green-600 mt-1">
                    {referralValidation.referrerInfo.email}
                  </p>
                )}
              </div>
            )}
            
            {/* Show error message if invalid */}
            {referralValidation.error && (
              <p className="mt-2 text-sm text-red-600">
                {referralValidation.error}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:bg-gray-400"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-purple-500 hover:text-purple-600 font-semibold">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
