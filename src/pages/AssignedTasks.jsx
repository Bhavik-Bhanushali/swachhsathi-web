import React, { useState, useMemo, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNgoReports } from "../../firebase/hooks/useReport";
import "./AssignedTasks.css";
import { MapPin, CheckCircle, ClipboardList, Zap, Package, AlertCircle, Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AssignedTasks = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("active");
  const [filterStatus, setFilterStatus] = useState("all");
  const navigate = useNavigate();
  // Fetch worker reports from Firebase
  const { data: reports, isLoading, error } = useNgoReports(user?.uid);

  useEffect(() => {
    console.log("Fetched reports:", reports.length);
  }, [reports]);

  // Separate tasks into active and completed
  const activeTasks = useMemo(() => {
    if (!reports) return [];
    return reports.filter(report => 
      report.status === 'assigned' || report.status === 'in-progress' || report.status === 'pending'
    );
  }, [reports]);

  const completedTasks = useMemo(() => {
    if (!reports) return [];
    return reports.filter(report => report.status === 'completed');
  }, [reports]);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "#ef4444";
      case "medium":
        return "#f59e0b";
      case "low":
        return "#10b981";
      default:
        return "#6b7280";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "#3b82f6";
      case "in-progress":
        return "#f59e0b";
      case "completed":
        return "#10b981";
      default:
        return "#6b7280";
    }
  };

  const getStatusLabel = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ");
  };

  const handleTaskClick = (taskId) => {
    console.log("Task clicked:", taskId);
    // Navigate to task details
  };

  const handleMarkComplete = (taskId) => {
    console.log("Mark task complete:", taskId);
    // Update task status
  };

  const handleViewDetails = (taskId) => {
    console.log("View task details:", taskId);
    // Navigate to task details page
    navigate(`/report-details/${taskId}`);
    
  };

  const TaskCard = ({ task, isCompleted }) => {
    // Format date helper
    const formatDate = (timestamp) => {
      if (!timestamp) return 'N/A';
      if (timestamp?.toDate) {
        return timestamp.toDate().toLocaleDateString();
      }
      return new Date(timestamp).toLocaleDateString();
    };

    // Determine priority from status or set default
    const priority = task.priority || 'medium';
    
    return (
      <div
        className="task-card"
        onClick={() => handleTaskClick(task.id)}
      >
        <div className="task-header">
          <div className="task-title-section">
            <h3 className="task-title">{task.description || 'Cleanup Task'}</h3>
            <div className="task-meta">
              <span
                className="task-status"
                style={{ backgroundColor: getStatusColor(task.status) }}
              >
                {getStatusLabel(task.status)}
              </span>
              <span
                className="task-priority"
                style={{ backgroundColor: getPriorityColor(priority) }}
              >
                {priority.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        <div className="task-location">
          <MapPin size={16} className="location-icon" />
          <span>{task.location?.address || 'Location not specified'}</span>
        </div>

        {task.imageUrl && (
          <div className="task-image">
            <img src={task.imageUrl} alt="Report" style={{ width: '100%', borderRadius: '8px', marginTop: '10px' }} />
          </div>
        )}

        <p className="task-description">Reported by: {task.userName || 'Unknown User'}</p>
        {task.workerName && (
          <p className="task-description">Worker: {task.workerName}</p>
        )}

        <div className="task-dates">
          <div className="date-item">
            <span className="date-label">Reported:</span>
            <span className="date-value">{formatDate(task.createdAt)}</span>
          </div>
          {!isCompleted && task.updatedAt && (
            <div className="date-item">
              <span className="date-label">Updated:</span>
              <span className="date-value">{formatDate(task.updatedAt)}</span>
            </div>
          )}
          {isCompleted && task.completedAt && (
            <div className="date-item">
              <span className="date-label">Completed:</span>
              <span className="date-value">{formatDate(task.completedAt)}</span>
            </div>
          )}
        </div>
      {/* </div> */}

      

      {isCompleted && task.rating && (
        <div className="task-rating">
          <span className="rating-label">Rating:</span>
          <div className="stars">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={i < task.rating ? "star filled" : "star"}>
                ⭐
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="task-actions">
        {!isCompleted ? (
          <>
            <button
              className="btn btn-primary"
              onClick={(e) => {
                e.stopPropagation();
                handleViewDetails(task.id);
              }}
            >
              View Details
            </button>
            {/* <button
              className="btn btn-success"
              onClick={(e) => {
                e.stopPropagation();
                handleMarkComplete(task.id);
              }}
            >
              Mark Complete
            </button> */}
          </>
        ) : (
          <button
            className="btn btn-secondary"
            onClick={(e) => {
              e.stopPropagation();
              handleViewDetails(task.id);
            }}
          >
            View Details
          </button>
        )}
      </div>
    </div>
  );
};

  const activeTasksCount = activeTasks.length;
  const completedTasksCount = completedTasks.length;

  // Loading state
  if (isLoading) {
    return (
      <div className="assigned-tasks-container">
        <div className="loading-state">
          <Loader size={48} className="spinner" />
          <p>Loading your tasks...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="assigned-tasks-container">
        <div className="error-state">
          <AlertCircle size={48} color="#ef4444" />
          <h2>Error Loading Tasks</h2>
          <p>{error.message || 'Something went wrong. Please try again later.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="assigned-tasks-container">
      {/* <div className="tasks-header">
        <h1>Assigned Tasks</h1>
        <p className="header-subtitle">Manage your cleanup assignments and track progress</p>
      </div> */}

      <div className="tasks-stats">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "#3b82f6" }}>
            <ClipboardList size={24} color="white" />
          </div>
          <div className="stat-content">
            <p className="stat-value">{activeTasksCount}</p>
            <p className="stat-label">Active Tasks</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "#10b981" }}>
            <Zap size={24} color="white" />
          </div>
          <div className="stat-content">
            <p className="stat-value">{completedTasksCount}</p>
            <p className="stat-label">Completed Tasks</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "#f59e0b" }}>
            <CheckCircle size={24} color="white" />
          </div>
          <div className="stat-content">
            <p className="stat-value">
              {activeTasksCount + completedTasksCount > 0
                ? Math.round(
                    (completedTasksCount / (activeTasksCount + completedTasksCount)) * 100
                  )
                : 0}%
            </p>
            <p className="stat-label">Completion Rate</p>
          </div>
        </div>
      </div>

      <div className="tabs-container">
        <button
          className={`tab-button ${activeTab === "active" ? "active" : ""}`}
          onClick={() => setActiveTab("active")}
        >
          <MapPin size={18} className="tab-icon" />
          Active Tasks
          <span className="tab-count">{activeTasksCount}</span>
        </button>
        <button
          className={`tab-button ${activeTab === "completed" ? "active" : ""}`}
          onClick={() => setActiveTab("completed")}
        >
          <CheckCircle size={18} className="tab-icon" />
          Completed Tasks
          <span className="tab-count">{completedTasksCount}</span>
        </button>
      </div>

      <div className="tasks-content">
        {activeTab === "active" && (
          <div className="tasks-section">
            {activeTasksCount === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📭</div>
                <h2>No Active Tasks</h2>
                <p>You have no active tasks right now. Check back later!</p>
              </div>
            ) : (
              <div className="tasks-grid">
                {activeTasks.map((task) => (
                  <TaskCard key={task.id} task={task} isCompleted={false} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "completed" && (
          <div className="tasks-section">
            {completedTasksCount === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📭</div>
                <h2>No Completed Tasks</h2>
                <p>You haven't completed any tasks yet.</p>
              </div>
            ) : (
              <div className="tasks-grid">
                {completedTasks.map((task) => (
                  <TaskCard key={task.id} task={task} isCompleted={true} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignedTasks;
