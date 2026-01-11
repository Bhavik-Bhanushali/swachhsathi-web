import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/images/logo_without_bg.png';
import './Navbar.css';

const Navbar = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            if (signOut) {
               const comfirm = window.confirm('Are you sure you want to log out?');
               if (comfirm) {
                   await signOut();
                   navigate('/');
               }    
            } else {
                // Fallback if signOut is not implemented in context yet
                navigate('/');
            }
        } catch (error) {
            console.error('Failed to log out', error);
        }
    };

    return (
        <nav className="navbar">
            <div className="container nav-content">
                <Link to="/" className="logo">
                    <img src={logo} alt="Swachhsathi" className="logo-image" />
                    <span className="logo-text">Swachhsathi</span>
                </Link>
                <div className="nav-links">
                    {user ? (
                        <>
                            <Link to="/" onClick={handleLogout} className="nav-link" style={{ cursor: 'pointer' }}>
                                Log Out
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link to="/" className="nav-link">Home</Link>
                            <Link to="/signin" className="nav-link">Sign In</Link>
                            <Link to="/signup" className="nav-cta">
                                Get Started
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
