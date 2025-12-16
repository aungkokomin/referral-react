import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

function Dashboard() {
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { isAdmin } = useAuth();
    console.log('Is Admin:', isAdmin());
    // Fetch dashboard stats on component mount
    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await api.getDashboardStats();
            setStats(data);
        } catch (err) {
            setError('Failed to fetch dashboard stats. Please try again later.');
            console.error('Error fetching dashboard stats:', err);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h2>
        
        {loading ? (
            <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {isAdmin() && (
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 text-sm">Total Users</p>
                        <p className="text-2xl font-bold text-gray-800">{stats.userCount ?? 0}</p>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-full">
                        <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    </div>
                    </div>
                </div>
            )}

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 text-sm">Total Referrals</p>
                        <p className="text-2xl font-bold text-gray-800">{stats.refereeCount ?? 0}</p>
                    </div>
                    <div className="bg-green-100 p-3 rounded-full">
                        <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 text-sm">Active Referrals</p>
                        <p className="text-2xl font-bold text-gray-800">{stats.activeReferralsCount ?? 0}</p>
                    </div>
                    <div className="bg-yellow-100 p-3 rounded-full">
                        <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                    </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 text-sm">Revenue</p>
                        <p className="text-2xl font-bold text-gray-800">${stats.totalCommissions ?? 0}</p>
                    </div>
                    <div className="bg-purple-100 p-3 rounded-full">
                        <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    </div>
                </div>
            </div>
        )}
        </div>
    );
    }

export default Dashboard;