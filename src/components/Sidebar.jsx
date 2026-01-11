import React from 'react';
import { Menu, X } from 'lucide-react';

const Sidebar = ({ sidebarOpen, setSidebarOpen, activeNav, setActiveNav, navItems }) => {
    return (
        <>
            {/* Sidebar */}
            <div className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
                <nav className="sidebar-nav">
                    {navItems.map((item) => (
                        <div
                            key={item.id}
                            className={`sidebar-nav-item ${activeNav === item.id ? 'active' : ''}`}
                            onClick={() => setActiveNav(item.id)}
                        >
                            <span className="sidebar-nav-item-icon">{item.icon}</span>
                            <span>{item.label}</span>
                        </div>
                    ))}
                </nav>
            </div>

            {/* Mobile Sidebar Toggle */}
            <button
                className="sidebar-toggle"
                onClick={() => setSidebarOpen(!sidebarOpen)}
            >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
        </>
    );
};

export default Sidebar;