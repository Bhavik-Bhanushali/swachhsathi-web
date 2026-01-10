import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWorkers } from '../../firebase/hooks/useWorker';
import CreateWorkerForm from '../components/CreateWorkerForm';
import './Dashboard.css';

const Dashboard = () => {
    const { user, signOut, isLoading: isAuthLoading } = useAuth();
    const navigate = useNavigate();
    const { data: workers, isLoading: isLoadingWorkers } = useWorkers(user?.uid);

    // Mock data for the dashboard
    const stats = [
        {
            title: 'Total Tasks Assigned',
            value: '127',
            icon: '📋',
            color: '#3b82f6'
        },
        {
            title: 'Tasks In Progress',
            value: '34',
            icon: '⚡',
            color: '#f59e0b'
        },
        {
            title: 'Tasks Completed',
            value: '89',
            icon: '✓',
            color: '#10b981'
        },
        {
            title: 'Active Workers',
            value: workers?.length || '12',
            icon: '👥',
            color: '#8b5cf6'
        },
    ];

    const nearbyRequests = [
        { id: 1, location: 'MG Road Junction', distance: '1.2 km away', priority: 'High', image: '🗑️' },
        { id: 2, location: 'Park Street Corner', distance: '2.4 km away', priority: 'Medium', image: '🗑️' },
        { id: 3, location: 'Bus Stand Area', distance: '0.8 km away', priority: 'Low', image: '🗑️' },
        { id: 4, location: 'Market Complex', distance: '3.1 km away', priority: 'Medium', image: '🗑️' },
    ];

    const activeTasks = [
        {
            id: 'RGR-2847',
            location: 'Gandhi Nagar Sector 4',
            worker: { name: 'Rajesh Kumar', avatar: '👨' },
            status: 'In Progress',
            timeRemaining: '40 mins'
        },
        {
            id: 'DS-2845',
            location: 'Laxmi Nagar Main Road',
            worker: { name: 'Amit Singh', avatar: '👨' },
            status: 'In Progress',
            timeRemaining: '1 hr 20 mins'
        },
        {
            id: 'RGR-2841',
            location: 'Katwaria Station Area',
            worker: { name: 'Priya Sharma', avatar: '👩' },
            status: 'Assigned',
            timeRemaining: '2 hrs'
        },
        {
            id: 'DS-2838',
            location: 'City Centre Mall',
            worker: { name: 'Vikram Patel', avatar: '👨' },
            status: 'In Progress',
            timeRemaining: '30 mins'
        },
    ];

    const activeWorkersList = [
        { name: 'Rajesh Kumar', lastActive: '2 mins ago', status: 'Online' },
        { name: 'Amit Singh', lastActive: '1 task active', status: 'Online' },
        { name: 'Priya Sharma', lastActive: '1 task active', status: 'Online' },
        { name: 'Vikram Patel', lastActive: '1 task active', status: 'Online' },
        { name: 'Sunesh Yadav', lastActive: '5 hours', status: 'Offline' },
    ];

    const tasksPerDay = [
        { day: 'Mon', count: 8 },
        { day: 'Tue', count: 12 },
        { day: 'Wed', count: 13 },
        { day: 'Thu', count: 11 },
        { day: 'Fri', count: 12 },
        { day: 'Sat', count: 9 },
        { day: 'Sun', count: 11 },
    ];

    const taskCategories = [
        { name: 'Street Cleaning', percentage: 35, color: '#3b82f6' },
        { name: 'Waste Collection', percentage: 28, color: '#10b981' },
        { name: 'Drain Cleaning', percentage: 25, color: '#f59e0b' },
        { name: 'Illegal Dumping', percentage: 12, color: '#ef4444' },
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

    const maxTaskCount = Math.max(...tasksPerDay.map(d => d.count));

    return (
        <div className="dashboard-container">
            {/* Stats Cards */}
            <div className="stats-grid">
                {stats.map((stat, index) => (
                    <div key={index} className="stat-card" style={{ borderLeftColor: stat.color }}>
                        <div className="stat-icon" style={{ backgroundColor: `${stat.color}15` }}>
                            <span style={{ fontSize: '2rem' }}>{stat.icon}</span>
                        </div>
                        <div className="stat-content">
                            <div className="stat-value">{stat.value}</div>
                            <div className="stat-title">{stat.title}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="main-grid">
                {/* Left Column */}
                <div className="left-column">
                    {/* Map Section */}
                    <div className="dashboard-card map-card">
                        <div className="card-header">
                            <h2 className="card-title">Nearby Garbage Reports</h2>
                            <p className="card-subtitle">Active tasks within service radius</p>
                        </div>
                        <div className="map-container">
                            <div className="map-placeholder">
                                <div className="map-legend">
                                    <span className="legend-item high">● High Priority</span>
                                    <span className="legend-item medium">● Medium</span>
                                    <span className="legend-item low">● Low</span>
                                </div>
                                <div className="map-markers">
                                    <div className="marker marker-high" style={{ top: '30%', left: '45%' }}>📍</div>
                                    <div className="marker marker-medium" style={{ top: '50%', left: '60%' }}>📍</div>
                                    <div className="marker marker-low" style={{ top: '65%', left: '35%' }}>📍</div>
                                    <div className="marker marker-medium" style={{ top: '40%', left: '70%' }}>📍</div>
                                    <div className="marker marker-low" style={{ top: '75%', left: '55%' }}>📍</div>
                                </div>
                                <div className="map-overlay">
                                    🗺️ Interactive Map View
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Active Tasks Table */}
                    <div className="dashboard-card">
                        <div className="card-header">
                            <h2 className="card-title">Active Tasks</h2>
                            <p className="card-subtitle">Currently assigned and in progress</p>
                            <button className="filter-btn">📋 Filter</button>
                        </div>
                        <div className="table-container">
                            <table className="tasks-table">
                                <thead>
                                    <tr>
                                        <th>REPORT ID</th>
                                        <th>LOCATION</th>
                                        <th>ASSIGNED WORKER</th>
                                        <th>STATUS</th>
                                        <th>TIME REMAINING</th>
                                        <th>ACTION</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {activeTasks.map((task) => (
                                        <tr key={task.id}>
                                            <td className="task-id">{task.id}</td>
                                            <td>{task.location}</td>
                                            <td>
                                                <div className="worker-cell">
                                                    <span className="worker-avatar">{task.worker.avatar}</span>
                                                    <span>{task.worker.name}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`status-badge ${task.status.toLowerCase().replace(' ', '-')}`}>
                                                    {task.status}
                                                </span>
                                            </td>
                                            <td>{task.timeRemaining}</td>
                                            <td>
                                                <button className="action-btn view">View</button>
                                                <button className="action-btn update">Update</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Bottom Row - Charts */}
                    <div className="charts-row">
                        {/* Active Workers */}
                        <div className="dashboard-card">
                            <div className="card-header">
                                <h2 className="card-title">Active Workers</h2>
                                <p className="card-subtitle">Currently available team</p>
                            </div>
                            <div className="workers-list">
                                {activeWorkersList.map((worker, idx) => (
                                    <div key={idx} className="worker-item">
                                        <div className="worker-info">
                                            <div className="worker-avatar-circle">
                                                {worker.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="worker-name">{worker.name}</div>
                                                <div className="worker-status-text">{worker.lastActive}</div>
                                            </div>
                                        </div>
                                        <span className={`status-dot ${worker.status.toLowerCase()}`}></span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Tasks Per Day Chart */}
                        <div className="dashboard-card">
                            <div className="card-header">
                                <h2 className="card-title">Tasks Completed Per Day</h2>
                                <p className="card-subtitle">Last 7 days performance</p>
                            </div>
                            <div className="chart-container">
                                <div className="bar-chart">
                                    {tasksPerDay.map((day, idx) => (
                                        <div key={idx} className="bar-wrapper">
                                            <div className="bar-column">
                                                <div
                                                    className="bar"
                                                    style={{ height: `${(day.count / maxTaskCount) * 100}%` }}
                                                >
                                                    <span className="bar-value">{day.count}</span>
                                                </div>
                                            </div>
                                            <div className="bar-label">{day.day}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Row 2 - More Charts */}
                    <div className="charts-row">
                        {/* Task Categories */}
                        <div className="dashboard-card">
                            <div className="card-header">
                                <h2 className="card-title">Task Categories</h2>
                                <p className="card-subtitle">Distribution by type</p>
                            </div>
                            <div className="pie-chart-container">
                                <div className="pie-chart">
                                    <svg viewBox="0 0 200 200" className="pie-svg">
                                        {(() => {
                                            let currentAngle = 0;
                                            return taskCategories.map((category, idx) => {
                                                const angle = (category.percentage / 100) * 360;
                                                const startAngle = currentAngle;
                                                currentAngle += angle;

                                                const x1 = 100 + 80 * Math.cos((startAngle - 90) * Math.PI / 180);
                                                const y1 = 100 + 80 * Math.sin((startAngle - 90) * Math.PI / 180);
                                                const x2 = 100 + 80 * Math.cos((currentAngle - 90) * Math.PI / 180);
                                                const y2 = 100 + 80 * Math.sin((currentAngle - 90) * Math.PI / 180);

                                                const largeArc = angle > 180 ? 1 : 0;

                                                return (
                                                    <path
                                                        key={idx}
                                                        d={`M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`}
                                                        fill={category.color}
                                                        className="pie-slice"
                                                    />
                                                );
                                            });
                                        })()}
                                    </svg>
                                </div>
                                <div className="pie-legend">
                                    {taskCategories.map((category, idx) => (
                                        <div key={idx} className="legend-row">
                                            <div className="legend-color" style={{ backgroundColor: category.color }}></div>
                                            <span className="legend-text">{category.name}</span>
                                            <span className="legend-percentage">{category.percentage}%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* KPIs */}
                        <div className="dashboard-card">
                            <div className="card-header">
                                <h2 className="card-title">Key Performance Indicators</h2>
                                <p className="card-subtitle">This month's metrics</p>
                            </div>
                            <div className="kpi-container">
                                <div className="kpi-item">
                                    <div className="kpi-icon" style={{ backgroundColor: '#3b82f615' }}>⏱️</div>
                                    <div className="kpi-content">
                                        <div className="kpi-label">Average Resolution Time</div>
                                        <div className="kpi-value" style={{ color: '#3b82f6' }}>2.4 hrs</div>
                                    </div>
                                </div>
                                <div className="kpi-item">
                                    <div className="kpi-icon" style={{ backgroundColor: '#10b98115' }}>📈</div>
                                    <div className="kpi-content">
                                        <div className="kpi-label">Success Rate</div>
                                        <div className="kpi-value" style={{ color: '#10b981' }}>94.5%</div>
                                    </div>
                                </div>
                                <div className="kpi-item">
                                    <div className="kpi-icon" style={{ backgroundColor: '#8b5cf615' }}>⚡</div>
                                    <div className="kpi-content">
                                        <div className="kpi-label">Worker Efficiency</div>
                                        <div className="kpi-value" style={{ color: '#8b5cf6' }}>7.4/10</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Nearby Requests */}
                <div className="right-column">
                    <div className="dashboard-card requests-card">
                        <div className="card-header">
                            <h2 className="card-title">Nearby Requests</h2>
                            <p className="card-subtitle">Unassigned reports</p>
                        </div>
                        <div className="requests-list">
                            {nearbyRequests.map((request) => (
                                <div key={request.id} className="request-item">
                                    <div className="request-image">
                                        <span style={{ fontSize: '2rem' }}>{request.image}</span>
                                    </div>
                                    <div className="request-details">
                                        <div className="request-location">{request.location}</div>
                                        <div className="request-distance">{request.distance}</div>
                                        <span className={`priority-badge ${request.priority.toLowerCase()}`}>
                                            {request.priority}
                                        </span>
                                    </div>
                                    <button className="accept-btn">Accept</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
