import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWorkers } from '../../firebase/hooks/useWorker';
import CreateWorkerForm from '../components/CreateWorkerForm';
import './Dashboard.css';

const Dashboard = () => {
    const { user, isLoading: isAuthLoading } = useAuth();
    const { data: workers, isLoading: isLoadingWorkers } = useWorkers(user?.uid);

    // Mock data for the dashboard
    const stats = [
        { title: 'Total Reports', value: '12' },
        { title: 'Resolved', value: '8' },
        { title: 'Pending', value: '4' },
        { title: 'Earned Points', value: '450' },
    ];

    useEffect(() => {
        console.log(workers);

    }, [workers]);

    if (isAuthLoading || isLoadingWorkers) {
        return (
            <div className="dashboard-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: '1rem' }}>
                <div className="loading-spinner"></div>
                <p style={{ color: '#64748b', fontSize: '1.1rem' }}>
                    {isAuthLoading ? 'Verifying authentication...' : 'Loading your dashboard...'}
                </p>
                <style>{`
                    .loading-spinner {
                        width: 40px;
                        height: 40px;
                        border: 3px solid #f3f3f3;
                        border-top: 3px solid #0ea5e9;
                        border-radius: 50%;
                        animation: spin 1s linear infinite;
                    }
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        );
    }

    // Compulsory Worker Creation Check
    if (!workers || workers.length === 0) {
        return (
            <div className="dashboard-container">
                <div className="container">
                    <div className="alert-section" style={{ marginBottom: '2rem', textAlign: 'center' }}>
                        <h1>Welcome to SwachhSathi!</h1>
                        <p>To get started, you must add at least one worker to your team.</p>
                    </div>
                    <CreateWorkerForm />
                </div>
            </div>
        );
    }

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

                <div className="workers-section" style={{ marginTop: '2rem' }}>
                    <h2 className="section-title" style={{ marginBottom: '1rem', fontSize: '1.5rem', fontWeight: '600' }}>My Team</h2>
                    <div className="dashboard-grid">
                        {workers.map((worker) => (
                            <div key={worker.id || Math.random()} className="dashboard-card">
                                <h3 className="card-title" style={{ fontSize: '1.2rem' }}>{worker.name}</h3>
                                <p style={{ color: '#64748b', marginTop: '0.5rem', fontSize: '0.9rem' }}>{worker.email}</p>
                                <p style={{ color: '#64748b', fontSize: '0.9rem' }}>{worker.phone}</p>
                            </div>
                        ))}
                    </div>
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
