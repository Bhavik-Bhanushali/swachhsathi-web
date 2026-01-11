import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNgoReports } from "../../firebase/hooks/useReport";
import { Clock, Pin, Zap, CheckCircle, Circle, AlertCircle, BarChart3, FileText } from "lucide-react";

const ReportHistoryPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all"); // all, pending, completed
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch reports by NGO ID using hook
  const { data: reports = [], isLoading: loading, error } = useNgoReports(user?.uid);

  const handleViewDetails = (reportId) => {
    console.log(reportId);
    
    navigate(`/report-details/${reportId}`);
  };

  // Filter reports based on status
  const filteredReports = reports.filter((report) => {
    // Filter by status
    if (filter === "pending") {
      if (!["pending", "assigned", "in-progress"].includes(report.status)) {
        return false;
      }
    } else if (filter === "completed") {
      if (report.status !== "resolved") {
        return false;
      }
    }

    // Filter by search term
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return (
        report.location?.address?.toLowerCase().includes(search) ||
        report.category?.toLowerCase().includes(search) ||
        report.userName?.toLowerCase().includes(search) ||
        report.workerName?.toLowerCase().includes(search)
      );
    }

    return true;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: "Pending", color: "#f59e0b", icon: <Clock size={14} /> },
      assigned: { label: "Assigned", color: "#3b82f6", icon: <Pin size={14} /> },
      "in-progress": { label: "In Progress", color: "#8b5cf6", icon: <Zap size={14} /> },
      resolved: { label: "Completed", color: "#10b981", icon: <CheckCircle size={14} /> },
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
      <span
        style={{
          padding: "4px 12px",
          borderRadius: "12px",
          fontSize: "12px",
          fontWeight: "600",
          backgroundColor: `${config.color}20`,
          color: config.color,
          display: "inline-flex",
          alignItems: "center",
          gap: "4px",
        }}
      >
        {config.icon} {config.label}
      </span>
    );
  };

  const getSeverityBadge = (severity) => {
    const severityConfig = {
      Low: { color: "#10b981", icon: <Circle size={10} fill="currentColor" /> },
      Medium: { color: "#f59e0b", icon: <Circle size={10} fill="currentColor" /> },
      High: { color: "#ef4444", icon: <AlertCircle size={14} /> },
    };

    const config = severityConfig[severity] || severityConfig.Low;

    return (
      <span
        style={{
          padding: "4px 12px",
          borderRadius: "12px",
          fontSize: "12px",
          fontWeight: "600",
          backgroundColor: `${config.color}20`,
          color: config.color,
          display: "inline-flex",
          alignItems: "center",
          gap: "4px",
        }}
      >
        {config.icon} {severity}
      </span>
    );
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "N/A";
    }
  };

  const stats = [
    {
      title: "Total Reports",
      value: reports.length,
      icon: <BarChart3 size={24} />,
      color: "#3b82f6",
    },
    {
      title: "Pending",
      value: reports.filter((r) =>
        ["pending", "assigned", "in-progress"].includes(r.status)
      ).length,
      icon: <Clock size={24} />,
      color: "#f59e0b",
    },
    {
      title: "Completed",
      value: reports.filter((r) => r.status === "resolved").length,
      icon: <CheckCircle size={24} />,
      color: "#10b981",
    },
    {
      title: "High Priority",
      value: reports.filter((r) => r.severity === "High").length,
      icon: <AlertCircle size={24} />,
      color: "#ef4444",
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
          <FileText size={24} /> Reports History
        </h2>
        <p style={{ color: "#6b7280", fontSize: "14px" }}>
          View all pending and completed waste collection requests
        </p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid" style={{ marginBottom: "24px" }}>
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-icon" style={{ color: stat.color }}>
                {stat.icon}
              </div>
              <div className="stat-content">
                <p className="stat-title">{stat.title}</p>
                <h3 className="stat-value">{stat.value}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Filters and Search */}
        <div style={{ marginBottom: "24px" }}>
          <div
            style={{
              display: "flex",
              gap: "16px",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <div style={{ flex: "1", minWidth: "250px" }}>
              <input
                type="text"
                placeholder="Search by location, category, or user..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                  fontSize: "14px",
                }}
              />
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={() => setFilter("all")}
                style={{
                  padding: "12px 24px",
                  borderRadius: "8px",
                  border: "none",
                  fontWeight: "600",
                  cursor: "pointer",
                  backgroundColor: filter === "all" ? "#3b82f6" : "#f3f4f6",
                  color: filter === "all" ? "white" : "#374151",
                }}
              >
                All
              </button>
              <button
                onClick={() => setFilter("pending")}
                style={{
                  padding: "12px 24px",
                  borderRadius: "8px",
                  border: "none",
                  fontWeight: "600",
                  cursor: "pointer",
                  backgroundColor: filter === "pending" ? "#f59e0b" : "#f3f4f6",
                  color: filter === "pending" ? "white" : "#374151",
                }}
              >
                Pending
              </button>
              <button
                onClick={() => setFilter("completed")}
                style={{
                  padding: "12px 24px",
                  borderRadius: "8px",
                  border: "none",
                  fontWeight: "600",
                  cursor: "pointer",
                  backgroundColor:
                    filter === "completed" ? "#10b981" : "#f3f4f6",
                  color: filter === "completed" ? "white" : "#374151",
                }}
              >
                Completed
              </button>
            </div>
          </div>
        </div>

        {/* Reports Table */}
        <div className="card">
          <div className="card-header">
            <h3>
              {filter === "all"
                ? "All Reports"
                : filter === "pending"
                ? "Pending Reports"
                : "Completed Reports"}
            </h3>
            <span style={{ color: "#6b7280", fontSize: "14px" }}>
              {filteredReports.length} reports
            </span>
          </div>

          {loading ? (
            <div style={{ padding: "40px", textAlign: "center" }}>
              <p>Loading reports...</p>
            </div>
          ) : filteredReports.length === 0 ? (
            <div style={{ padding: "40px", textAlign: "center" }}>
              <p style={{ color: "#6b7280" }}>No reports found</p>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr
                    style={{
                      borderBottom: "2px solid #e5e7eb",
                      textAlign: "left",
                    }}
                  >
                    <th style={{ padding: "12px", fontWeight: "600" }}>
                      Location
                    </th>
                    <th style={{ padding: "12px", fontWeight: "600" }}>
                      Category
                    </th>
                    <th style={{ padding: "12px", fontWeight: "600" }}>
                      Reporter
                    </th>
                    <th style={{ padding: "12px", fontWeight: "600" }}>
                      Worker
                    </th>
                    <th style={{ padding: "12px", fontWeight: "600" }}>
                      Severity
                    </th>
                    <th style={{ padding: "12px", fontWeight: "600" }}>
                      Status
                    </th>
                    <th style={{ padding: "12px", fontWeight: "600" }}>
                      Created
                    </th>
                    <th style={{ padding: "12px", fontWeight: "600" }}>
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReports.map((report) => (
                    <tr
                      key={report.id}
                      style={{
                        borderBottom: "1px solid #e5e7eb",
                        transition: "background-color 0.2s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#f9fafb")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "transparent")
                      }
                    >
                      <td style={{ padding: "12px" }}>
                        <div
                          style={{
                            maxWidth: "200px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                          title={report.location?.address}
                        >
                          📍 {report.location?.address || "N/A"}
                        </div>
                      </td>
                      <td style={{ padding: "12px" }}>
                        {report.category || "General"}
                      </td>
                      <td style={{ padding: "12px" }}>
                        {report.userName || "Anonymous"}
                      </td>
                      <td style={{ padding: "12px" }}>
                        {report.workerName || "Unassigned"}
                      </td>
                      <td style={{ padding: "12px" }}>
                        {getSeverityBadge(report.severity)}
                      </td>
                      <td style={{ padding: "12px" }}>
                        {getStatusBadge(report.status)}
                      </td>
                      <td style={{ padding: "12px", fontSize: "14px" }}>
                        {formatDate(report.createdAt)}
                      </td>
                      <td style={{ padding: "12px" }}>
                        <button
                          onClick={() =>{
                            console.log(report);
                            
                             handleViewDetails(report.id)
                          }}
                          style={{
                            padding: "8px 16px",
                            borderRadius: "6px",
                            border: "none",
                            backgroundColor: "#3b82f6",
                            color: "white",
                            cursor: "pointer",
                            fontSize: "14px",
                            fontWeight: "500",
                          }}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
  );
};

export default ReportHistoryPage;
