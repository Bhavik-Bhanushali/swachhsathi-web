import { useState } from 'react';
import './LandingPage.css';
import logo from '../assets/images/logo_without_bg.png';
import { Camera, MapPin, TrendingUp, Bell, Map, Globe, ClipboardList, Navigation, CheckCircle, Users, BarChart3, Award, LayoutDashboard, FileText } from 'lucide-react';

const LandingPage = () => {
  const [activeTab, setActiveTab] = useState('citizen');

  const features = {
    citizen: [
      {
        icon: <Camera size={32} className="feature-icon" />,
        title: 'Photo Upload',
        desc: 'Capture and upload garbage images instantly'
      },
      {
        icon: <MapPin size={32} className="feature-icon" />,
        title: 'GPS Auto-Detection',
        desc: 'Automatic location tagging for precise reporting'
      },
      {
        icon: <TrendingUp size={32} className="feature-icon" />,
        title: 'Status Tracking',
        desc: 'Real-time timeline view of report progress'
      },
      {
        icon: <Bell size={32} className="feature-icon" />,
        title: 'Push Notifications',
        desc: 'Updates on assignment and completion'
      },
      {
        icon: <Map size={32} className="feature-icon" />,
        title: 'Nearby Reports',
        desc: 'View garbage hotspots in your area'
      },
      {
        icon: <Globe size={32} className="feature-icon" />,
        title: 'Multi-Language Support',
        desc: 'Accessibility for diverse users'
      },
    ],
    worker: [
      {
        icon: <ClipboardList size={32} className="feature-icon" />,
        title: 'Task Management',
        desc: 'View assigned cleanup tasks efficiently'
      },
      {
        icon: <Navigation size={32} className="feature-icon" />,
        title: 'Location Navigation',
        desc: 'GPS-guided route to report location'
      },
      {
        icon: <TrendingUp size={32} className="feature-icon" />,
        title: 'Progress Updates',
        desc: 'Real-time status updates on tasks'
      },
      {
        icon: <Camera size={32} className="feature-icon" />,
        title: 'Before/After Photos',
        desc: 'Document cleanup work with proof'
      },
      {
        icon: <CheckCircle size={32} className="feature-icon" />,
        title: 'Task Completion',
        desc: 'Mark jobs as done with evidence'
      },
    ],
    admin: [
      {
        icon: <LayoutDashboard size={32} className="feature-icon" />,
        title: 'Dashboard',
        desc: 'Overview of all complaints and statistics'
      },
      {
        icon: <FileText size={32} className="feature-icon" />,
        title: 'Advanced Filtering',
        desc: 'Filter by status, zone, and priority'
      },
      {
        icon: <Users size={32} className="feature-icon" />,
        title: 'Task Assignment',
        desc: 'Assign reports to available workers'
      },
      {
        icon: <Users size={32} className="feature-icon" />,
        title: 'Worker Management',
        desc: 'Monitor field team performance'
      },
      {
        icon: <BarChart3 size={32} className="feature-icon" />,
        title: 'Analytics',
        desc: 'Comprehensive insights and trends'
      },
    ],
  };

  const stats = [
    { number: '1000+', label: 'Reports Resolved' },
    { number: '500+', label: 'Active Citizens' },
    { number: '50+', label: 'Field Workers' },
    { number: '95%', label: 'Success Rate' },
  ];

  const techStack = [
    { name: 'React Native', category: 'Mobile Framework' },
    { name: 'Firebase', category: 'Backend & Auth' },
    { name: 'Google Maps', category: 'Location Services' },
    { name: 'Cloud Firestore', category: 'Database' },
    { name: 'TypeScript', category: 'Language' },
    { name: 'TanStack Query', category: 'Data Fetching' },
  ];

  return (
    <div className="landing-page">
      {/* Navigation */}
      {/* Navigation - Moved to App.jsx */}

      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Smart Garbage Reporting for
              <span className="gradient-text"> Cleaner Cities</span>
            </h1>
            <p className="hero-subtitle">
              Revolutionizing urban waste management through citizen participation and real-time tracking.
              Connect with municipal workers and administrators for efficient garbage resolution.
            </p>
            <div className="hero-buttons">
              <button className="btn btn-primary">
                <span>Download App</span>
                <span className="btn-icon">→</span>
              </button>
              <button className="btn btn-secondary">
                <span>Learn More</span>
              </button>
            </div>
          </div>
          <div className="hero-image">
            <div className="hero-card">
              <div className="card-header">
                <span className="status-badge pending">Pending</span>
                <span className="time">2 mins ago</span>
              </div>
              <div className="card-content">
                <div className="location-info">
                  <span className="location-icon">📍</span>
                  <span>MG Road, Sector 15</span>
                </div>
                <p className="card-description">Overflowing garbage near bus stop</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <h3 className="stat-number">{stat.number}</h3>
                <p className="stat-label">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="problem-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">The Problem We're Solving</h2>
            <p className="section-subtitle">Urban areas face critical challenges in maintaining cleanliness</p>
          </div>
          <div className="problem-grid">
            <div className="problem-card">
              <div className="problem-icon">
                <svg viewBox="0 0 64 64" className="icon-svg">
                  <circle cx="32" cy="32" r="28" fill="#fef3c7" opacity="0.3" />
                  <circle cx="32" cy="32" r="20" fill="#fbbf24" className="pulse" />
                  <path d="M32 16 L32 32 L40 40" stroke="#78350f" strokeWidth="3" strokeLinecap="round" fill="none" className="clock-hand" />
                  <circle cx="32" cy="32" r="2" fill="#78350f" />
                </svg>
              </div>
              <h3>Delayed Reporting</h3>
              <p>Garbage accumulation often goes unreported for days, leading to health hazards</p>
            </div>
            <div className="problem-card">
              <div className="problem-icon">
                <svg viewBox="0 0 64 64" className="icon-svg">
                  <circle cx="28" cy="28" r="18" fill="none" stroke="#3b82f6" strokeWidth="3" className="search-circle" />
                  <line x1="42" y1="42" x2="52" y2="52" stroke="#3b82f6" strokeWidth="4" strokeLinecap="round" className="search-handle" />
                  <circle cx="28" cy="28" r="12" fill="#dbeafe" opacity="0.5" className="pulse" />
                </svg>
              </div>
              <h3>Lack of Tracking</h3>
              <p>No real-time visibility into cleanup operations and accountability</p>
            </div>
            <div className="problem-card">
              <div className="problem-icon">
                <svg viewBox="0 0 64 64" className="icon-svg">
                  <path d="M16 48 Q16 28 32 28 Q48 28 48 48" fill="none" stroke="#8b5cf6" strokeWidth="3" className="wave" />
                  <circle cx="16" cy="48" r="4" fill="#8b5cf6" className="bounce" />
                  <circle cx="32" cy="28" r="4" fill="#8b5cf6" className="bounce" style={{ animationDelay: '0.2s' }} />
                  <circle cx="48" cy="48" r="4" fill="#8b5cf6" className="bounce" style={{ animationDelay: '0.4s' }} />
                  <rect x="12" y="16" width="40" height="28" rx="4" fill="#ede9fe" opacity="0.4" />
                </svg>
              </div>
              <h3>Poor Communication</h3>
              <p>Inefficient channels between citizens and municipal authorities</p>
            </div>
            <div className="problem-card">
              <div className="problem-icon">
                <svg viewBox="0 0 64 64" className="icon-svg">
                  <rect x="16" y="40" width="8" height="16" rx="2" fill="#10b981" className="bar-grow" />
                  <rect x="28" y="28" width="8" height="28" rx="2" fill="#3b82f6" className="bar-grow" style={{ animationDelay: '0.1s' }} />
                  <rect x="40" y="20" width="8" height="36" rx="2" fill="#8b5cf6" className="bar-grow" style={{ animationDelay: '0.2s' }} />
                  <line x1="12" y1="56" x2="52" y2="56" stroke="#64748b" strokeWidth="2" />
                </svg>
              </div>
              <h3>Limited Visibility</h3>
              <p>Municipal teams lack data-driven insights for resource allocation</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Features for Everyone</h2>
            <p className="section-subtitle">Tailored experiences for citizens, workers, and administrators</p>
          </div>

          <div className="feature-tabs">
            <button
              className={`tab ${activeTab === 'citizen' ? 'active' : ''}`}
              onClick={() => setActiveTab('citizen')}
            >
              <svg viewBox="0 0 24 24" className="tab-icon-svg" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
              </svg>
              <span>Citizens</span>
            </button>
            <button
              className={`tab ${activeTab === 'worker' ? 'active' : ''}`}
              onClick={() => setActiveTab('worker')}
            >
              <svg viewBox="0 0 24 24" className="tab-icon-svg" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <span>Workers</span>
            </button>
            <button
              className={`tab ${activeTab === 'admin' ? 'active' : ''}`}
              onClick={() => setActiveTab('admin')}
            >
              <svg viewBox="0 0 24 24" className="tab-icon-svg" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="M12 8v4M12 16h.01" />
              </svg>
              <span>Admins</span>
            </button>
          </div>

          <div className="features-grid">
            {features[activeTab].map((feature, index) => (
              <div key={index} className="feature-card" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="feature-icon-wrapper">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-desc">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="how-it-works">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">Simple 4-step process from report to resolution</p>
          </div>
          <div className="steps-container">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Report Creation</h3>
                <p>Citizen captures photo, GPS location auto-tagged, report submitted to system</p>
              </div>
            </div>
            <div className="step-connector">→</div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Task Assignment</h3>
                <p>Admin reviews pending reports and assigns to available field worker</p>
              </div>
            </div>
            <div className="step-connector">→</div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Cleanup Execution</h3>
                <p>Worker navigates to location, completes task, uploads after-photo</p>
              </div>
            </div>
            <div className="step-connector">→</div>
            <div className="step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3>Verification & Closure</h3>
                <p>Status updated, citizen notified, data aggregated for analytics</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section id="technology" className="technology-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Built with Modern Technology</h2>
            <p className="section-subtitle">Leveraging cutting-edge tools for reliability and performance</p>
          </div>
          <div className="tech-grid">
            {techStack.map((tech, index) => (
              <div key={index} className="tech-card">
                <h4>{tech.name}</h4>
                <p>{tech.category}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Make Your City Cleaner?</h2>
            <p className="cta-subtitle">
              Join thousands of citizens making a difference in their communities
            </p>
            <div className="cta-buttons">
              <button className="btn btn-primary btn-large">
                <span>Get Started Now</span>
                <span className="btn-icon">→</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <div className="footer-logo">
                <img src={logo} alt="Swachhsathi" className="logo-image" />
                <span className="logo-text">Swachhsathi</span>
              </div>
              <p className="footer-tagline">Built with ❤️ for a cleaner, smarter city</p>
            </div>
            <div className="footer-section">
              <h4>Product</h4>
              <a href="#features">Features</a>
              <a href="#how-it-works">How It Works</a>
              <a href="#technology">Technology</a>
            </div>
            <div className="footer-section">
              <h4>Resources</h4>
              <a href="#">Documentation</a>
              <a href="#">API Reference</a>
              <a href="#">Support</a>
            </div>
            <div className="footer-section">
              <h4>Company</h4>
              <a href="#">About Us</a>
              <a href="#contact">Contact</a>
              <a href="#">Privacy Policy</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 Swachhsathi. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
