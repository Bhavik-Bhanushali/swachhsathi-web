import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWorkerReports } from '../../firebase/hooks/useReport';
import { useWorkerById } from '../../firebase/hooks/useWorker';
import { 
  ArrowLeft, 
  Mail, 
  User, 
  ClipboardList, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  MapPin,
  Calendar,
  Loader
} from 'lucide-react';
import './WorkerDetailPage.css';

const WorkerDetailPage = () => {
  const { workerId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('assigned');

  // Fetch worker information
  const { data: worker, isLoading: workerLoading, error: workerError } = useWorkerById(workerId);

  // Fetch all reports assigned to this worker
  const { data: reports, isLoading: reportsLoading, error: reportsError } = useWorkerReports(workerId);

  const isLoading = workerLoading || reportsLoading;
  const error = workerError || reportsError;

  // Get worker info
  const workerInfo = useMemo(() => {
    if (worker) {
      return {
        name: worker.name || 'Unknown Worker',
        email: worker.email || 'No email available',
      };
    }
    return { name: 'Unknown Worker', email: 'No email available' };
  }, [worker]);

  // Categorize tasks
  const assignedTasks = useMemo(() => {
    if (!reports) return [];
    return reports.filter(report => 
      report.status === 'assigned' || report.status === 'pending'
    );
  }, [reports]);

  const inProgressTasks = useMemo(() => {
    if (!reports) return [];
    return reports.filter(report => report.status === 'in-progress');
  }, [reports]);

  const completedTasks = useMemo(() => {
    if (!reports) return [];
    return reports.filter(report => report.status === 'completed');
  }, [reports]);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return '#ef4444';
      case 'medium':
        return '#f59e0b';
      case 'low':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
        return 'status-badge status-pending';
      case 'assigned':
        return 'status-badge status-assigned';
      case 'in-progress':
        return 'status-badge status-in-progress';
      case 'completed':
        return 'status-badge status-completed';
      default:
        return 'status-badge';
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleTaskClick = (reportId) => {
    navigate(`/report-details/${reportId}`);
  };

  const getLocationDisplay = (location) => {
    if (!location) return 'Location not specified';
    if (typeof location === 'string') return location;
    if (typeof location === 'object' && location.address) return location.address;
    return 'Location not specified';
  };

  if (isLoading) {
    return (
      <div className="worker-detail-page">
        <div className="loading-container">
          <Loader className="spinner" size={40} />
          <p>Loading worker details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="worker-detail-page">
        <div className="error-container">
          <AlertCircle size={40} color="#ef4444" />
          <p>Error loading worker details: {error.message}</p>
          <button onClick={() => navigate(-1)} className="back-btn">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const renderTaskList = (tasks, emptyMessage) => {
    if (tasks.length === 0) {
      return (
        <div className="empty-state">
          <ClipboardList size={48} color="#9ca3af" />
          <p>{emptyMessage}</p>
        </div>
      );
    }

    return (
      <div className="task-list">
        {tasks.map((task) => (
          <div 
            key={task.id} 
            className="task-card"
            onClick={() => handleTaskClick(task.id)}
          >
            <div className="task-header">
              <div className="task-title-section">
                <h3>{task.title || 'Untitled Report'}</h3>
                <span className={getStatusBadgeClass(task.status)}>
                  {task.status}
                </span>
              </div>
              <div 
                className="task-priority-badge"
                style={{ backgroundColor: getPriorityColor(task.priority) }}
              >
                {task.priority || 'medium'}
              </div>
            </div>

            <p className="task-description">
              {task.description || 'No description available'}
            </p>

            <div className="task-meta">
              <div className="meta-item">
                <MapPin size={16} />
                <span>{getLocationDisplay(task.location)}</span>
              </div>
              <div className="meta-item">
                <Calendar size={16} />
                <span>Created: {formatDate(task.createdAt)}</span>
              </div>
              {task.status === 'completed' && task.updatedAt && (
                <div className="meta-item">
                  <CheckCircle size={16} />
                  <span>Completed: {formatDate(task.updatedAt)}</span>
                </div>
              )}
            </div>

            {task.wasteType && (
              <div className="task-waste-type">
                <span>Waste Type: {task.wasteType}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="worker-detail-page">
      {/* Header Section */}
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
          Back
        </button>
        <h1>Worker Details</h1>
      </div>

      {/* Worker Info Card */}
      <div className="worker-info-card">
        <div className="worker-avatar-large">
          <User size={48} />
        </div>
        <div className="worker-details">
          <h2>{workerInfo.name}</h2>
          <div className="worker-contact">
            <Mail size={18} />
            <span>{workerInfo.email}</span>
          </div>
        </div>
        <div className="worker-stats">
          <div className="stat-item">
            <Clock size={24} color="#f59e0b" />
            <div className="stat-content">
              <span className="stat-number">{assignedTasks.length + inProgressTasks.length}</span>
              <span className="stat-label">Active Tasks</span>
            </div>
          </div>
          <div className="stat-item">
            <CheckCircle size={24} color="#10b981" />
            <div className="stat-content">
              <span className="stat-number">{completedTasks.length}</span>
              <span className="stat-label">Completed</span>
            </div>
          </div>
          <div className="stat-item">
            <ClipboardList size={24} color="#3b82f6" />
            <div className="stat-content">
              <span className="stat-number">{reports?.length || 0}</span>
              <span className="stat-label">Total Tasks</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tasks Section */}
      <div className="tasks-section">
        <div className="tabs-container">
          <button
            className={`tab-btn ${activeTab === 'assigned' ? 'active' : ''}`}
            onClick={() => setActiveTab('assigned')}
          >
            <Clock size={18} />
            Assigned Tasks ({assignedTasks.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'inprogress' ? 'active' : ''}`}
            onClick={() => setActiveTab('inprogress')}
          >
            <AlertCircle size={18} />
            In Progress ({inProgressTasks.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'completed' ? 'active' : ''}`}
            onClick={() => setActiveTab('completed')}
          >
            <CheckCircle size={18} />
            Completed ({completedTasks.length})
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'assigned' && renderTaskList(
            assignedTasks, 
            'No assigned tasks at the moment'
          )}
          {activeTab === 'inprogress' && renderTaskList(
            inProgressTasks, 
            'No tasks in progress'
          )}
          {activeTab === 'completed' && renderTaskList(
            completedTasks, 
            'No completed tasks yet'
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkerDetailPage;
