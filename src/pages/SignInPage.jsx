import { useState } from 'react';
import './SignInPage.css';
import logo from '../assets/images/logo_without_bg.png';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SignInPage = () => {
  const [role, setRole] = useState('citizen');
  const navigate = useNavigate();
  const { signIn } = useAuth(); // Assuming signIn is available in auth context
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signIn({ email, password });
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError('Failed to sign in: ' + err.message);
    }
  };

  return (
    <div className="signin-page">
      {/* Sign In Card */}
      <div className="signin-container">
        <div className="signin-card">
          <h1 className="signin-title">
            Welcome Back to <span className="gradient-text">Swachhsathi</span>
          </h1>
          <p className="signin-subtitle">
            Sign in to continue making your city cleaner
          </p>



          {error && <div className="error-message">{error}</div>}

          {/* Form */}
          <form className="signin-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="text" // Changed to text for easier testing or email
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>



            <button type="submit" className="btn btn-primary btn-full">
              <span>Sign In</span>
              <span className="btn-icon">→</span>
            </button>
          </form>

          {/* Footer */}
          <div className="signin-footer">
            <p>
              Don't have an account? <button className="text-button" onClick={() => navigate('/signup')}>Create one</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
