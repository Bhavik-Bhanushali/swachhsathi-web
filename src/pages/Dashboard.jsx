import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useWorkers } from "../../firebase/hooks/useWorker";
import {
  useNgoReports,
  useAssignedNgoReports,
} from "../../firebase/hooks/useReport";
import { useNGO } from "../../firebase/hooks/useNGO";
import CreateWorkerForm from "../components/CreateWorkerForm";
import Sidebar from "../components/Sidebar";
import GoogleMaps from "../components/GoogleMaps";
import "./Dashboard.css";
import WorkerListPage from "./WorkerListPage";
import AssignedTasks from "./AssignedTasks";
import ReportHistoryPage from ".//ReportHistoryPage";
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  FileText,
  Zap,
  CheckCircle,
  User,
} from "lucide-react";
import ReportService from "../../firebase/services/ReportService";
import { useAuth as useAuthFirebase } from "../context/AuthContext";
import { auth } from "../../firebase/config";
import NGODetail from "../components/NGODetail";

// Unassigned Reports Component
const UnassignedReportsSection = ({
  reports,
  workers,
  ngoId,
  ngoCategories,
  ngoData,
  refetchAllData,
}) => {
  const [assigningReport, setAssigningReport] = useState(null);
  const [selectedWorker, setSelectedWorker] = useState("");
  const [isAssigning, setIsAssigning] = useState(false);

  const unassignedReports = useMemo(() => {
    if (!reports) return [];

    // Filter by status first
    const statusFiltered = reports.filter(
      (r) => r.status === "pending" || r.status === "unassigned" || !r.status
    );

    // If no NGO categories defined, show all unassigned reports
    if (!ngoCategories || ngoCategories.length === 0) {
      return statusFiltered;
    }

    // Filter by NGO categories
    return statusFiltered.filter((report) => {
      // If report has no category, exclude it
      if (!report.category) return false;

      // Check if report category matches any of the NGO's categories
      return ngoCategories.includes(report.category);
    });
  }, [reports, ngoCategories]);

  const handleAssignClick = (report) => {
    setAssigningReport(report);
    setSelectedWorker("");
  };

  const handleCancelAssign = () => {
    setAssigningReport(null);
    setSelectedWorker("");
  };

  const handleAssignWorker = async () => {
    if (!selectedWorker || !assigningReport) return;
    console.log(assigningReport);
    console.log(selectedWorker);
    console.log(ngoData);
    
    
    // return;

    setIsAssigning(true);
    try {
      const worker = workers.find((w) => w.id === selectedWorker);
      await ReportService.updateReport(assigningReport.id, {
        assignedTo: selectedWorker,
        status: "assigned",
        ngoId: ngoData?.adminId, // Update the ngoId
      });

      // Refetch data to update the UI
      await refetchAllData();

      setAssigningReport(null);
      setSelectedWorker("");

      // Refresh the page after successful assignment
      // window.location.reload();

    } catch (error) {
      console.error("Error assigning worker:", error);
      alert("Failed to assign worker. Please try again.");
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <div className="dashboard-card">
      <div className="card-header">
        <h2 className="card-title">Unassigned Reports</h2>
        <p className="card-subtitle">
          {unassignedReports.length} report
          {unassignedReports.length !== 1 ? "s" : ""} waiting for assignment
        </p>
      </div>
      <div
        className="unassigned-reports-container"
        style={{
          maxHeight: "500px",
          overflowY: "auto",
          padding: "1rem",
        }}
      >
        {unassignedReports.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "3rem",
              color: "#64748b",
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✅</div>
            <p>No unassigned reports</p>
          </div>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {unassignedReports.map((report) => (
              <div
                key={report.id}
                style={{
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  padding: "1rem",
                  backgroundColor: "#fff",
                  transition: "box-shadow 0.2s",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.boxShadow =
                    "0 4px 6px -1px rgba(0, 0, 0, 0.1)")
                }
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "0.5rem",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontWeight: "600",
                        color: "#1e293b",
                        marginBottom: "0.25rem",
                      }}
                    >
                      Report ID: {report.id}
                    </div>
                    <div
                      style={{
                        color: "#64748b",
                        fontSize: "0.9rem",
                        marginBottom: "0.25rem",
                      }}
                    >
                      📍{" "}
                      {report.location?.address ||
                        report.address ||
                        "Unknown Location"}
                    </div>
                    {report.category && (
                      <div
                        style={{
                          color: "#64748b",
                          fontSize: "0.85rem",
                        }}
                      >
                        Category: {report.category}
                      </div>
                    )}
                    {report.priority && (
                      <span
                        style={{
                          display: "inline-block",
                          marginTop: "0.5rem",
                          padding: "0.25rem 0.75rem",
                          borderRadius: "12px",
                          fontSize: "0.8rem",
                          fontWeight: "500",
                          backgroundColor:
                            report.priority === "High"
                              ? "#fee2e2"
                              : report.priority === "Medium"
                              ? "#fef3c7"
                              : "#dbeafe",
                          color:
                            report.priority === "High"
                              ? "#991b1b"
                              : report.priority === "Medium"
                              ? "#92400e"
                              : "#1e40af",
                        }}
                      >
                        {report.priority} Priority
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleAssignClick(report)}
                    style={{
                      padding: "0.5rem 1rem",
                      backgroundColor: "#0ea5e9",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontWeight: "500",
                      fontSize: "0.9rem",
                      transition: "background-color 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.backgroundColor = "#0284c7")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.backgroundColor = "#0ea5e9")
                    }
                  >
                    Assign
                  </button>
                </div>

                {/* Assignment Modal */}
                {assigningReport?.id === report.id && (
                  <div
                    style={{
                      marginTop: "1rem",
                      padding: "1rem",
                      backgroundColor: "#f8fafc",
                      borderRadius: "6px",
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: "600",
                        marginBottom: "0.75rem",
                        color: "#1e293b",
                      }}
                    >
                      Select Worker to Assign
                    </div>
                    <select
                      value={selectedWorker}
                      onChange={(e) => setSelectedWorker(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "0.625rem",
                        border: "1px solid #cbd5e1",
                        borderRadius: "6px",
                        marginBottom: "0.75rem",
                        fontSize: "0.9rem",
                        backgroundColor: "white",
                      }}
                      disabled={isAssigning}
                    >
                      <option value="">-- Select a worker --</option>
                      {workers &&
                        workers.map((worker) => (
                          <option key={worker.id} value={worker.id}>
                            {worker.name}{" "}
                            {worker.isActive ? "(Active)" : "(Offline)"}
                          </option>
                        ))}
                    </select>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button
                        onClick={handleAssignWorker}
                        disabled={!selectedWorker || isAssigning}
                        style={{
                          flex: 1,
                          padding: "0.625rem",
                          backgroundColor:
                            selectedWorker && !isAssigning
                              ? "#10b981"
                              : "#94a3b8",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                          cursor:
                            selectedWorker && !isAssigning
                              ? "pointer"
                              : "not-allowed",
                          fontWeight: "500",
                          fontSize: "0.9rem",
                        }}
                      >
                        {isAssigning ? "Assigning..." : "Confirm Assignment"}
                      </button>
                      <button
                        onClick={handleCancelAssign}
                        disabled={isAssigning}
                        style={{
                          flex: 1,
                          padding: "0.625rem",
                          backgroundColor: "white",
                          color: "#64748b",
                          border: "1px solid #cbd5e1",
                          borderRadius: "6px",
                          cursor: isAssigning ? "not-allowed" : "pointer",
                          fontWeight: "500",
                          fontSize: "0.9rem",
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user, signOut, isLoading: isAuthLoading } = useAuth();
  const navigate = useNavigate();
  const { data: workers, isLoading: isLoadingWorkers, refetch: refetchWorkers } = useWorkers(user?.uid);
  const { data: reports, isLoading: isLoadingReports, refetch: refetchReports } = useNgoReports(
    user?.uid
  );
  const { data: ngoData, isLoading: isLoadingNgo, refetch: refetchNgo } = useNGO(user?.uid);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeNav, setActiveNav] = useState(() => {
    // Load the last active tab from localStorage, default to "dashboard"
    return localStorage.getItem("activeNav") || "dashboard";
  });

  // Refetch all data function
  const refetchAllData = async () => {
    try {
      await Promise.all([
        refetchWorkers?.(),
        refetchReports?.(),
        refetchNgo?.()
      ]);
      console.log('All data refetched successfully');
    } catch (error) {
      console.error('Error refetching data:', error);
    }
  };

  // Navigation items
  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      route: "/dashboard",
    },
    {
      id: "assigned-tasks",
      label: "Assigned Tasks",
      icon: <ClipboardList size={20} />,
      route: "/assigned-tasks",
    },
    {
      id: "workers",
      label: "Workers",
      icon: <Users size={20} />,
      route: "/workers",
    },
    // { id: "analytics", label: "Analytics", icon: <TrendingUp size={20} />, route: "/analytics" },
    {
      id: "reports-history",
      label: "Reports History",
      icon: <FileText size={20} />,
      route: "/reports-history",
    },
    { id: "profile", label: "Profile", icon: <User size={20} /> },
  ];

  // Calculate real-time stats from reports
  const stats = useMemo(() => {
    if (!reports) {
      return [
        {
          title: "Total Tasks Assigned",
          value: "0",
          icon: <ClipboardList size={32} />,
          color: "#3b82f6",
        },
        {
          title: "Tasks In Progress",
          value: "0",
          icon: <Zap size={32} />,
          color: "#f59e0b",
        },
        {
          title: "Tasks Completed",
          value: "0",
          icon: <CheckCircle size={32} />,
          color: "#10b981",
        },
        {
          title: "Total Workers",
          value: workers.length.toString() || "0",
          icon: <Users size={32} />,
          color: "#8b5cf6",
        },
      ];
    }

    const totalAssigned = reports.filter(
      (r) =>
        r.status === "assigned" ||
        r.status === "in-progress" ||
        r.status === "completed"
    ).length;
    const inProgress = reports.filter((r) => r.status === "in-progress").length;
    const completed = reports.filter((r) => r.status === "completed").length;

    return [
      {
        title: "Total Tasks Assigned",
        value: totalAssigned.toString(),
        icon: <ClipboardList size={32} />,
        color: "#3b82f6",
      },
      {
        title: "Tasks In Progress",
        value: inProgress.toString(),
        icon: <Zap size={32} />,
        color: "#f59e0b",
      },
      {
        title: "Tasks Completed",
        value: completed.toString(),
        icon: <CheckCircle size={32} />,
        color: "#10b981",
      },
      {
        title: "Active Workers",
        value: workers?.length || "0",
        icon: <Users size={32} />,
        color: "#8b5cf6",
      },
    ];
  }, [reports, workers]);

  // Get nearby/unassigned requests
  const nearbyRequests = useMemo(() => {
    if (!reports) return [];

    return reports
      .filter((r) => r.status === "pending" || r.status === "unassigned")
      .map((report) => ({
        id: report.id,
        location:
          report.location?.address || report.address || "Unknown Location",
        distance: "N/A",
        priority: report.priority || "Medium",
        image: "🗑️",
      }));
  }, [reports]);

  // Prepare markers data for Google Maps
  const mapMarkers = useMemo(() => {
    if (!reports) return [];

    return reports
      .filter((r) => r.location?.latitude && r.location?.longitude)
      .map((report) => ({
        lat: report.location.latitude,
        lng: report.location.longitude,
        title: report.location?.address || report.address || "Garbage Report",
        address: report.location?.address || report.address,
        status: report.status,
        priority: report.priority,
        id: report.id,
      }));
  }, [reports]);

  // Get active tasks (assigned or in-progress)
  const activeTasks = useMemo(() => {
    if (!reports) return [];

    return reports
      .filter(
        (r) =>
          r.status === "assigned" ||
          r.status === "in-progress"
      )
      .map((report) => ({
        id: report.id,
        location:
          report.location?.address || report.address || "Unknown Location",
        worker: {
          name: report.workerName || "Unassigned",
          avatar: "👨",
        },
        status: report.status === "in-progress" ? "In Progress" : "Assigned",
        timeRemaining: "N/A",
      }));
  }, [reports]);

  // Get active workers list
  const activeWorkersList = useMemo(() => {
    if (!workers) return [];

    return workers.map((worker) => ({
      id: worker.id,
      name: worker.name,
      lastActive: worker.isActive ? "Active" : "Offline",
      status: worker.isActive ? "Online" : "Offline",
    }));
  }, [workers]);

  // Calculate tasks per day for the last 7 days
  const tasksPerDay = useMemo(() => {
    if (!reports) {
      return [
        { day: "Mon", count: 0 },
        { day: "Tue", count: 0 },
        { day: "Wed", count: 0 },
        { day: "Thu", count: 0 },
        { day: "Fri", count: 0 },
        { day: "Sat", count: 0 },
        { day: "Sun", count: 0 },
      ];
    }

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const today = new Date();
    const last7Days = [];

    // Create array of last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      last7Days.push({
        day: days[date.getDay()],
        date: date.toDateString(),
        count: 0,
      });
    }

    // Count completed tasks per day
    reports
      .filter((r) => r.status === "completed" && r.updatedAt)
      .forEach((report) => {
        const reportDate = report.updatedAt.toDate
          ? report.updatedAt.toDate()
          : new Date(report.updatedAt);
        const dateStr = reportDate.toDateString();
        const dayEntry = last7Days.find((d) => d.date === dateStr);
        if (dayEntry) {
          dayEntry.count++;
        }
      });

    return last7Days;
  }, [reports]);

  // Calculate task categories
  const taskCategories = useMemo(() => {
    if (!reports || reports.length === 0) {
      return [{ name: "No Data", count: 0, percentage: 100, color: "#94a3b8" }];
    }

    // Group by category/type
    const categoryCounts = {};
    reports.forEach((report) => {
      const category = report.category || report.type || "Other";
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });

    const total = reports.length;
    const categories = Object.entries(categoryCounts).map(
      ([name, count], idx) => ({
        name,
        count,
        percentage: ((count / total) * 100).toFixed(1),
        color: [
          "#3b82f6",
          "#10b981",
          "#f59e0b",
          "#ef4444",
          "#8b5cf6",
          "#ec4899",
          "#06b6d4",
          "#f97316",
        ][idx % 8],
      })
    );

    return categories.length > 0
      ? categories
      : [{ name: "No Data", count: 0, percentage: 100, color: "#94a3b8" }];
  }, [reports]);

  // Calculate KPIs from real data
  const kpiMetrics = useMemo(() => {
    if (!reports || reports.length === 0) {
      return {
        avgResolutionTime: "N/A",
        successRate: "0%",
        workerEfficiency: "N/A",
      };
    }

    // Calculate Average Resolution Time
    const completedReports = reports.filter(
      (r) => r.status === "completed" && r.createdAt && r.updatedAt
    );
    let avgResolutionHours = 0;

    if (completedReports.length > 0) {
      const totalHours = completedReports.reduce((sum, report) => {
        const created = report.createdAt.toDate
          ? report.createdAt.toDate()
          : new Date(report.createdAt);
        const updated = report.updatedAt.toDate
          ? report.updatedAt.toDate()
          : new Date(report.updatedAt);
        const diffHours = (updated - created) / (1000 * 60 * 60);
        return sum + diffHours;
      }, 0);
      avgResolutionHours = totalHours / completedReports.length;
    }

    // Calculate Success Rate
    const assignedReports = reports.filter(
      (r) =>
        r.status === "assigned" ||
        r.status === "in-progress" ||
        r.status === "completed"
    );
    const successRate =
      assignedReports.length > 0
        ? Math.round((completedReports.length / assignedReports.length) * 100)
        : 0;

    // Calculate Worker Efficiency (avg completed tasks per worker)
    const activeWorkersCount = workers?.length || 1;
    const efficiency = completedReports.length / activeWorkersCount;

    return {
      avgResolutionTime:
        completedReports.length > 0
          ? avgResolutionHours < 1
            ? `${Math.round(avgResolutionHours * 60)} min`
            : `${avgResolutionHours.toFixed(1)} hrs`
          : "N/A",
      successRate: `${successRate}%`,
      workerEfficiency:
        efficiency > 0 ? `${efficiency.toFixed(1)}/worker` : "N/A",
    };
  }, [reports, workers]);

  useEffect(() => {
    console.log("Workers:", workers);
    console.log("Reports:", reports);
    console.log(
      "Assigned Reports:",
      reports.filter(
        (r) =>
          r.status === "assigned" ||
          r.status === "in-progress" ||
          r.status === "pending"
      )
    );
    console.log("Map Markers:", mapMarkers);
  }, [workers, reports, mapMarkers]);

  // Persist active tab to localStorage
  useEffect(() => {
    localStorage.setItem("activeNav", activeNav);
  }, [activeNav]);

  if (isAuthLoading || isLoadingWorkers || isLoadingReports) {
    return (
      <div
        className="dashboard-container"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <div className="loading-spinner"></div>
        <p style={{ color: "#64748b", fontSize: "1.1rem" }}>
          {isAuthLoading
            ? "Verifying authentication..."
            : isLoadingReports || isLoadingAssignedReports
            ? "Loading reports data..."
            : "Loading your dashboard..."}
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
          <div
            className="alert-section"
            style={{ marginBottom: "2rem", textAlign: "center" }}
          >
            <h1>Welcome to SwachhSathi!</h1>
            <p>
              To get started, you must add at least one worker to your team.
            </p>
          </div>
          <CreateWorkerForm />
        </div>
      </div>
    );
  }
  const handleTaskClick = (taskId) => {
    navigate(`/report-details/${taskId}`);
  };

  const maxTaskCount = Math.max(...tasksPerDay.map((d) => d.count));

  return (
    <>
      {/* Sidebar Component */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        navItems={navItems}
      />
      {activeNav == "dashboard" && (
        <>
          {/* Main Dashboard Content */}
          <div
            className="dashboard-container"
            style={{ display: "flex", flexDirection: "column", gap: "2rem" }}
          >
            {/* Stats Cards */}
            <div className="stats-grid">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="stat-card"
                  style={{ borderLeftColor: stat.color }}
                >
                  <div
                    className="stat-icon"
                    style={{
                      backgroundColor: `${stat.color}20`,
                      color: stat.color,
                    }}
                  >
                    {stat.icon}
                  </div>
                  <div className="stat-content">
                    <div className="stat-value">{stat.value}</div>
                    <div className="stat-title">{stat.title}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Main Content Grid */}
            <div className="main-grid" style={{ gridTemplateColumns: "1fr" }}>
              {/* Main Column */}
              <div
                className="main-column"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "2rem",
                }}
              >
                {/* Map Section */}
                <div className="dashboard-card map-card">
                  <div className="card-header">
                    <h2 className="card-title">Nearby Garbage Reports</h2>
                    <p className="card-subtitle">
                      {mapMarkers.length} active report
                      {mapMarkers.length !== 1 ? "s" : ""} on map
                    </p>
                  </div>
                  <div className="map-container" style={{ height: "400px" }}>
                    {mapMarkers.length > 0 ? (
                      <GoogleMaps markers={mapMarkers} />
                    ) : (
                      <div className="map-placeholder">
                        <div className="map-overlay">
                          No reports with location data available
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Active Tasks Table */}
                <div className="dashboard-card">
                  <div className="card-header">
                    <h2 className="card-title">Active Tasks</h2>
                    <p className="card-subtitle">
                      Currently assigned and in progress
                    </p>
                    {/* <button className="filter-btn">📋 Filter</button> */}
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
                        {activeTasks.length === 0 ? (
                          <tr>
                            <td
                              colSpan="6"
                              style={{
                                textAlign: "center",
                                padding: "2rem",
                                color: "#64748b",
                              }}
                            >
                              No active tasks found in Database
                            </td>
                          </tr>
                        ) : (
                          activeTasks.map((task) => (
                            <tr
                              key={task.id}
                              onClick={handleTaskClick.bind(null, task.id)}
                              style={{ cursor: "pointer" }}
                            >
                              <td className="task-id">{task.id}</td>
                              <td>{task.location}</td>
                              <td>
                                <div className="worker-cell">
                                  <span className="worker-avatar">
                                    {task.worker.avatar}
                                  </span>
                                  <span>{task.worker.name}</span>
                                </div>
                              </td>
                              <td>
                                <span
                                  className={`status-badge ${task.status
                                    .toLowerCase()
                                    .replace(" ", "-")}`}
                                >
                                  {task.status}
                                </span>
                              </td>
                              <td>{task.timeRemaining}</td>
                              <td>
                                <button className="action-btn view">
                                  View
                                </button>
                                <button className="action-btn update">
                                  Update
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Bottom Row - Charts */}
                <div
                  className="charts-row"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
                    gap: "1.5rem",
                  }}
                >
                  {/* Active Workers */}
                  <div className="dashboard-card">
                    <div className="card-header">
                      <h2 className="card-title">Active Workers</h2>
                      <p className="card-subtitle">Currently available team</p>
                    </div>
                    <div className="workers-list">
                      {activeWorkersList.length === 0 ? (
                        <div
                          style={{
                            textAlign: "center",
                            padding: "2rem",
                            color: "#64748b",
                          }}
                        >
                          No workers found in Firebase
                        </div>
                      ) : (
                        activeWorkersList.map((worker, idx) => (
                          <div
                            key={idx}
                            className="worker-item"
                            onClick={() => navigate(`/worker/${worker.id}`)}
                            style={{ cursor: "pointer" }}
                          >
                            <div className="worker-info">
                              <div className="worker-avatar-circle">
                                {worker.name.charAt(0)}
                              </div>
                              <div>
                                <div className="worker-name">{worker.name}</div>
                                <div className="worker-status-text">
                                  {worker.lastActive}
                                </div>
                              </div>
                            </div>
                            <span
                              className={`status-dot ${worker.status.toLowerCase()}`}
                            ></span>
                          </div>
                        ))
                      )}
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
                                style={{
                                  height: `${
                                    (day.count / maxTaskCount) * 100
                                  }%`,
                                }}
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
                <div
                  className="charts-row"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
                    gap: "1.5rem",
                  }}
                >
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
                              // Handle the 100% edge case (compare as number since percentage is a string)
                              if (
                                parseFloat(category.percentage) === 100 ||
                                taskCategories.length === 1
                              ) {
                                return (
                                  <circle
                                    key={idx}
                                    cx="100"
                                    cy="100"
                                    r="80"
                                    fill={category.color}
                                  />
                                );
                              }

                              const angle =
                                (parseFloat(category.percentage) / 100) * 360;
                              const startAngle = currentAngle;
                              currentAngle += angle;

                              const x1 =
                                100 +
                                80 *
                                  Math.cos(((startAngle - 90) * Math.PI) / 180);
                              const y1 =
                                100 +
                                80 *
                                  Math.sin(((startAngle - 90) * Math.PI) / 180);
                              const x2 =
                                100 +
                                80 *
                                  Math.cos(
                                    ((currentAngle - 90) * Math.PI) / 180
                                  );
                              const y2 =
                                100 +
                                80 *
                                  Math.sin(
                                    ((currentAngle - 90) * Math.PI) / 180
                                  );

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
                            <div
                              className="legend-color"
                              style={{ backgroundColor: category.color }}
                            ></div>
                            <span className="legend-text">
                              {category.name} ({category.count})
                            </span>
                            <span className="legend-percentage">
                              {category.percentage}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Unassigned Reports */}
                  <UnassignedReportsSection
                    reports={reports}
                    workers={workers}
                    ngoId={user?.uid}
                    ngoCategories={ngoData?.categories || []}
                    ngoData={ngoData}
                    refetchAllData={refetchAllData}
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {activeNav == "workers" && (
        <>
          {/* Main Dashboard Content */}
          <div className="dashboard-container">
            <WorkerListPage />
          </div>
        </>
      )}
      {activeNav == "assigned-tasks" && (
        <>
          {/* Main Dashboard Content */}
          <div className="dashboard-container">
            <AssignedTasks />
          </div>
        </>
      )}
      {activeNav == "reports-history" && (
        <>
          {/* Main Dashboard Content */}
          <div className="dashboard-container">
            <ReportHistoryPage />
          </div>
        </>
      )}
      {activeNav == "profile" && (
        <>
          {/* Main Dashboard Content */}
          <div className="dashboard-container">
            <NGODetail ngo={ngoData} />
          </div>
        </>
      )}
    </>
  );
};

export default Dashboard;
