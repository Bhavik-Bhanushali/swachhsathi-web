import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./AssignedTasks.css";

const AssignedTasks = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("active");
  const [filterStatus, setFilterStatus] = useState("all");

  // Mock data - In production, this should come from Firebase
  const activeTasks = [
    {
      id: 1,
      title: "Garbage Collection - Downtown Park",
      location: "Downtown Park, Main Street",
      assignedDate: "2026-01-11",
      dueDate: "2026-01-12",
      priority: "high",
      status: "in-progress",
      description: "Clear garbage accumulation near park entrance",
      image: null,
    },
    {
      id: 2,
      title: "Street Cleaning - Market Area",
      location: "Market Street, District 5",
      assignedDate: "2026-01-10",
      dueDate: "2026-01-13",
      priority: "medium",
      status: "pending",
      description: "Clean entire market street area",
      image: null,
    },
    {
      id: 3,
      title: "Drain Cleaning - Residential Zone",
      location: "Green Valley Apartments",
      assignedDate: "2026-01-09",
      dueDate: "2026-01-11",
      priority: "high",
      status: "in-progress",
      description: "Clear blocked drainage system",
      image: null,
    },
  ];

  const completedTasks = [
    {
      id: 4,
      title: "Park Maintenance - Eastern Zone",
      location: "Eastern Park, Elm Street",
      assignedDate: "2026-01-05",
      completedDate: "2026-01-08",
      priority: "medium",
      status: "completed",
      description: "Full park cleanup and maintenance",
      image: null,
      rating: 5,
    },
    {
      id: 5,
      title: "Waste Bin Replacement",
      location: "Central Business District",
      assignedDate: "2026-01-06",
      completedDate: "2026-01-09",
      priority: "low",
      status: "completed",
      description: "Replace old waste bins with new ones",
      image: null,
      rating: 4,
    },
    {
      id: 6,
      title: "Road Side Cleaning",
      location: "Highway Junction",
      assignedDate: "2026-01-04",
      completedDate: "2026-01-07",
      priority: "high",
      status: "completed",
      description: "Remove debris from roadsides",
      image: null,
      rating: 5,
    },
  ];

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
  };

  const TaskCard = ({ task, isCompleted }) => (
    <div
      className="task-card"
      onClick={() => handleTaskClick(task.id)}
    >
      <div className="task-header">
        <div className="task-title-section">
          <h3 className="task-title">{task.title}</h3>
          <div className="task-meta">
            <span
              className="task-status"
              style={{ backgroundColor: getStatusColor(task.status) }}
            >
              {getStatusLabel(task.status)}
            </span>
            <span
              className="task-priority"
              style={{ backgroundColor: getPriorityColor(task.priority) }}
            >
              {task.priority.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      <div className="task-location">
        <span className="location-icon">📍</span>
        <span>{task.location}</span>
      </div>

      <p className="task-description">{task.description}</p>
      <p className="task-description">Worker: add later</p>

      <div className="task-dates">
        <div className="date-item">
          <span className="date-label">Assigned:</span>
          <span className="date-value">{task.assignedDate}</span>
        </div>
        {!isCompleted && (
          <div className="date-item">
            <span className="date-label">Due:</span>
            <span className="date-value">{task.dueDate}</span>
          </div>
        )}
        {isCompleted && (
          <div className="date-item">
            <span className="date-label">Completed:</span>
            <span className="date-value">{task.completedDate}</span>
          </div>
        )}
      </div>

      {/* {!isCompleted && (
        <div className="completion-bar">
          <div className="completion-label">
            <span>Progress</span>
            <span className="completion-percentage">
              {task.completionPercentage}%
            </span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${task.completionPercentage}%` }}
            ></div>
          </div>
        </div>
      )} */}

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
            <button
              className="btn btn-success"
              onClick={(e) => {
                e.stopPropagation();
                handleMarkComplete(task.id);
              }}
            >
              Mark Complete
            </button>
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

  const activeTasksCount = activeTasks.length;
  const completedTasksCount = completedTasks.length;

  return (
    <div className="assigned-tasks-container">
      {/* <div className="tasks-header">
        <h1>Assigned Tasks</h1>
        <p className="header-subtitle">Manage your cleanup assignments and track progress</p>
      </div> */}

      <div className="tasks-stats">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "#3b82f6" }}>
            📋
          </div>
          <div className="stat-content">
            <p className="stat-value">{activeTasksCount}</p>
            <p className="stat-label">Active Tasks</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "#10b981" }}>
            ✓
          </div>
          <div className="stat-content">
            <p className="stat-value">{completedTasksCount}</p>
            <p className="stat-label">Completed Tasks</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "#f59e0b" }}>
            🎯
          </div>
          <div className="stat-content">
            <p className="stat-value">
              {Math.round(
                (completedTasksCount / (activeTasksCount + completedTasksCount)) *
                  100
              )}%
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
          <span className="tab-icon">📍</span>
          Active Tasks
          <span className="tab-count">{activeTasksCount}</span>
        </button>
        <button
          className={`tab-button ${activeTab === "completed" ? "active" : ""}`}
          onClick={() => setActiveTab("completed")}
        >
          <span className="tab-icon">✅</span>
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
