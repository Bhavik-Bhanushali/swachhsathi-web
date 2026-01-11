import React from 'react';
import { Building2, MapPin, ClipboardList, CheckCircle, Users, Star, Phone, Home, FileText, Info, Target, ExternalLink } from 'lucide-react';
import './NGODetail.css';

const NGODetail = ({ ngo }) => {
  if (!ngo) {
    return (
      <div className="ngo-empty-state">
        <div className="empty-icon">
          <Building2 size={48} />
        </div>
        <h3>No NGO Data Available</h3>
        <p>The NGO information could not be loaded at this time.</p>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'verified':
        return 'status-active';
      case 'pending':
        return 'status-pending';
      case 'inactive':
      case 'suspended':
        return 'status-inactive';
      default:
        return 'status-default';
    }
  };

  return (
    <div className="ngo-detail-container">
      {/* Header Section */}
      <div className="ngo-header-card">
        <div className="ngo-avatar">
          <span className="avatar-icon"><Building2 size={32} /></span>
        </div>
        <div className="ngo-header-info">
          <h1 className="ngo-name">{ngo.name || 'Unnamed NGO'}</h1>
          <div className="ngo-location">
            <span className="location-icon"><MapPin size={16} /></span>
            <span>{ngo.city || 'Unknown City'}, {ngo.state || 'Unknown State'}</span>
          </div>
          <span className={`ngo-status-badge ${getStatusColor(ngo.status)}`}>
            {ngo.status || 'Unknown Status'}
          </span>
        </div>
      </div>

      {/* Stats Section */}
      <div className="ngo-stats-grid">
        <div className="stat-card">
          <div className="stat-icon stat-icon-blue"><ClipboardList size={24} /></div>
          <div className="stat-content">
            <span className="stat-number">{ngo.totalReports || 0}</span>
            <span className="stat-label">Total Reports</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon stat-icon-green"><CheckCircle size={24} /></div>
          <div className="stat-content">
            <span className="stat-number">{ngo.completedReports || 0}</span>
            <span className="stat-label">Completed</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon stat-icon-orange"><Users size={24} /></div>
          <div className="stat-content">
            <span className="stat-number">{ngo.totalWorkers || 0}</span>
            <span className="stat-label">Workers</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon stat-icon-purple"><Star size={24} /></div>
          <div className="stat-content">
            <span className="stat-number">{ngo.rating || 'N/A'}</span>
            <span className="stat-label">Rating</span>
          </div>
        </div>
      </div>

      {/* Info Cards Grid */}
      <div className="ngo-info-grid">
        {/* Contact Information */}
        <div className="info-card">
          <div className="info-card-header">
            <span className="info-card-icon"><Phone size={20} /></span>
            <h3>Contact Information</h3>
          </div>
          <div className="info-card-body">
            <div className="info-item">
              <span className="info-label">Email</span>
              <span className="info-value">
                {ngo.email ? (
                  <a href={`mailto:${ngo.email}`} className="info-link">
                    {ngo.email}
                  </a>
                ) : 'N/A'}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Phone</span>
              <span className="info-value">
                {ngo.phone ? (
                  <a href={`tel:${ngo.phone}`} className="info-link">
                    {ngo.phone}
                  </a>
                ) : 'N/A'}
              </span>
            </div>
            {ngo.website && (
              <div className="info-item">
                <span className="info-label">Website</span>
                <span className="info-value">
                  <a 
                    href={ngo.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="info-link website-link"
                  >
                    {ngo.website.replace(/^https?:\/\//, '')}
                    <span className="external-icon"><ExternalLink size={14} /></span>
                  </a>
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Address Information */}
        <div className="info-card">
          <div className="info-card-header">
            <span className="info-card-icon"><Home size={20} /></span>
            <h3>Address Details</h3>
          </div>
          <div className="info-card-body">
            <div className="info-item">
              <span className="info-label">Address</span>
              <span className="info-value">{ngo.address || 'N/A'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">City</span>
              <span className="info-value">{ngo.city || 'N/A'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">State</span>
              <span className="info-value">{ngo.state || 'N/A'}</span>
            </div>
            {ngo.pincode && (
              <div className="info-item">
                <span className="info-label">PIN Code</span>
                <span className="info-value">{ngo.pincode}</span>
              </div>
            )}
          </div>
        </div>

        {/* Registration Details */}
        <div className="info-card">
          <div className="info-card-header">
            <span className="info-card-icon"><FileText size={20} /></span>
            <h3>Registration Details</h3>
          </div>
          <div className="info-card-body">
            <div className="info-item">
              <span className="info-label">Registration No.</span>
              <span className="info-value registration-number">
                {ngo.registrationNumber || 'N/A'}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Status</span>
              <span className={`info-value status-text ${getStatusColor(ngo.status)}`}>
                {ngo.status || 'N/A'}
              </span>
            </div>
            {ngo.establishedYear && (
              <div className="info-item">
                <span className="info-label">Established</span>
                <span className="info-value">{ngo.establishedYear}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Description Section */}
      {ngo.description && (
        <div className="ngo-description-card">
          <div className="info-card-header">
            <span className="info-card-icon"><Info size={20} /></span>
            <h3>About the Organization</h3>
          </div>
          <p className="description-text">{ngo.description}</p>
        </div>
      )}

      {/* Services/Focus Areas */}
      {ngo.focusAreas && ngo.focusAreas.length > 0 && (
        <div className="ngo-focus-areas">
          <div className="info-card-header">
            <span className="info-card-icon"><Target size={20} /></span>
            <h3>Focus Areas</h3>
          </div>
          <div className="focus-tags">
            {ngo.focusAreas.map((area, index) => (
              <span key={index} className="focus-tag">{area}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NGODetail;
