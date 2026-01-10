import React from 'react';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
    const { user } = useAuth();

    // Mock data for the dashboard
    const stats = [
        { title: 'Total Reports', value: '12' },
        { title: 'Resolved', value: '8' },
        { title: 'Pending', value: '4' },
        { title: 'Earned Points', value: '450' },
    ];

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <div className="container">
                    <h1 className="welcome-text">
                        Welcome back, {user?.email?.split('@')[0] || 'User'}!
                    </h1>
                    <p className="text-gray-600">Here's an overview of your impact.</p>
                </div>
            </div>

            <div className="container">
                <div className="dashboard-grid">
                    {stats.map((stat, index) => (
                        <div key={index} className="dashboard-card">
                            <h3 className="card-title">{stat.title}</h3>
                            <p className="card-value">{stat.value}</p>
                        </div>
                    ))}
                </div>

                <div className="recent-activity-section">
                    <h2 className="section-title" style={{ marginBottom: '1rem', fontSize: '1.5rem', fontWeight: '600' }}>Recent Activity</h2>
                    <div className="dashboard-card" style={{ minHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                        No recent activity to show.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
