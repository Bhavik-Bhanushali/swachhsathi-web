import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useReportDetail } from "../../firebase/hooks/useReport";
import GoogleMaps from "../components/GoogleMaps";
import "./ReportDetailsPage.css";
import { Clock, Pin, Zap, CheckCircle, Circle, AlertCircle } from "lucide-react";

const ReportDetailsPage = () => {
  const { reportId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: report, isLoading: loading, error } = useReportDetail(reportId);

  const handleBack = () => {
    navigate(-1);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: "Pending", color: "#f59e0b", icon: <Clock size={16} /> },
      assigned: { label: "Assigned", color: "#3b82f6", icon: <Pin size={16} /> },
      "in-progress": { label: "In Progress", color: "#8b5cf6", icon: <Zap size={16} /> },
      resolved: { label: "Completed", color: "#10b981", icon: <CheckCircle size={16} /> },
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
      <span
        style={{
          padding: "8px 16px",
          borderRadius: "12px",
          fontSize: "14px",
          fontWeight: "600",
          backgroundColor: `${config.color}20`,
          color: config.color,
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
        }}
      >
        {config.icon} {config.label}
      </span>
    );
  };

  const getSeverityBadge = (severity) => {
    const severityConfig = {
      Low: { color: "#10b981", icon: <Circle size={12} fill="currentColor" /> },
      Medium: { color: "#f59e0b", icon: <Circle size={12} fill="currentColor" /> },
      High: { color: "#ef4444", icon: <AlertCircle size={16} /> },
    };

    const config = severityConfig[severity] || severityConfig.Low;

    return (
      <span
        style={{
          padding: "8px 16px",
          borderRadius: "12px",
          fontSize: "14px",
          fontWeight: "600",
          backgroundColor: `${config.color}20`,
          color: config.color,
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
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
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "N/A";
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <h2>Loading report details...</h2>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="error-container">
        <div className="error-content">
          <h2>Report not found</h2>
          <button onClick={handleBack} className="error-button">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="report-details-container">
      <div className="report-details-content">
        {/* Header with Back Button */}
        <div className="report-details-header">
          <div className="header-content">
            <button onClick={handleBack} className="back-button">
              ← Back
            </button>
            <div>
              <h1>Report Details</h1>
              <p>Complete information about this waste collection request</p>
            </div>
          </div>
        </div>

        {/* Status and Severity Cards */}
        <div className="status-cards-row">
          <div className="status-card">
            <p className="status-card-label">Status</p>
            {getStatusBadge(report.status)}
          </div>
          <div className="status-card">
            <p className="status-card-label">Severity</p>
            {getSeverityBadge(report.severity)}
          </div>
          <div className="status-card">
            <p className="status-card-label">Category</p>
            <p className="status-card-value">{report.category || "General"}</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="report-details-grid">
          {/* Left Column */}
          <div className="report-column">
            {/* Report Information */}
            <div className="report-card">
              <div className="report-card-header">
                <h3>📋 Report Information</h3>
              </div>
              <div className="report-card-content">
                <div className="report-field">
                  <p className="report-field-label">Report ID</p>
                  <p className="report-field-value">{report.id}</p>
                </div>
                <div className="report-field">
                  <p className="report-field-label">Description</p>
                  <p className="report-field-value">
                    {report.description || "No description provided"}
                  </p>
                </div>
                <div className="report-field">
                  <p className="report-field-label">Created At</p>
                  <p className="report-field-value">{formatDate(report.createdAt)}</p>
                </div>
                <div className="report-field">
                  <p className="report-field-label">Last Updated</p>
                  <p className="report-field-value">{formatDate(report.updatedAt)}</p>
                </div>
              </div>
            </div>

            {/* Reporter Information */}
            <div className="report-card">
              <div className="report-card-header">
                <h3>👤 Reporter Information</h3>
              </div>
              <div className="report-card-content">
                <div className="report-field">
                  <p className="report-field-label">Name</p>
                  <p className="report-field-value">{report.userName || "Anonymous"}</p>
                </div>
                <div className="report-field">
                  <p className="report-field-label">Email</p>
                  <p className="report-field-value">{report.userEmail || "N/A"}</p>
                </div>
              </div>
            </div>

            {/* Worker Information */}
            {/* {(report.assignedTo || report.workerName) && ( */}
              <div className="report-card">
                <div className="report-card-header">
                  <h3>👷 Assigned Worker</h3>
                </div>
                <div className="report-card-content">
                  <div className="report-field">
                    <p className="report-field-label">Worker Name</p>
                    <p className="report-field-value">{report.workerName || "N/A"}</p>
                  </div>
                  <div className="report-field">
                    <p className="report-field-label">Worker Email</p>
                    <p className="report-field-value">{report.workerEmail || "N/A"}</p>
                  </div>
                  {/* <div className="report-field">
                    <p className="report-field-label">Worker ID</p>
                    <p className="report-field-value">{report.workerId || "N/A"}</p>
                  </div> */}
                </div>
              </div>
            {/* )} */}
          </div>

          {/* Right Column */}
          <div className="report-column">
            {/* Location Information */}
            <div className="report-card">
              <div className="report-card-header">
                <h3>📍 Location</h3>
              </div>
              <div className="report-card-content">
                <div className="report-field">
                  <p className="report-field-label">Address</p>
                  <p className="report-field-value">
                    {report.location?.address || "N/A"}
                  </p>
                </div>
                <div style={{ display: "flex", gap: "20px" }}>
                  <div className="report-field" style={{ flex: "1" }}>
                    <p className="report-field-label">Latitude</p>
                    <p className="report-field-value">
                      {report.location?.latitude?.toFixed(6) || "N/A"}
                    </p>
                  </div>
                  <div className="report-field" style={{ flex: "1" }}>
                    <p className="report-field-label">Longitude</p>
                    <p className="report-field-value">
                      {report.location?.longitude?.toFixed(6) || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            {report.location?.latitude && report.location?.longitude && (
              <div className="report-card">
                <div className="report-card-header">
                  <h3>🗺️ Map View</h3>
                </div>
                <div className="map-container">
                  <GoogleMaps
                    latitude={report.location.latitude}
                    longitude={report.location.longitude}
                    address={report.location.address}
                  />
                </div>
              </div>
            )}

            {/* Image */}
            {report.imageUrl && (
              <div className="report-card">
                <div className="report-card-header">
                  <h3>📷 Report Image</h3>
                </div>
                <img
                  src={report.imageUrl}
                  alt="Report"
                  className="report-image"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportDetailsPage;
