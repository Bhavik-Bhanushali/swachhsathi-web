import { useState } from 'react';
import './SignUpPage.css';
import logo from '../assets/images/logo_without_bg.png';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const garbageCategories = [
  'Dead Animals',
  'Garbage Collection',
  'Clean Public Space',
  'Overflowing Dustbins',
  'Construction Waste',
  'Plastic Waste',
  'Organic Waste',
  'Drain Cleaning',
];

const SignUpPage = () => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const navigate = useNavigate();
  // const { signUp } = useAuth(); // If available

  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Implement sign up logic here
    console.log('Signing up with categories:', selectedCategories);
    navigate('/dashboard');
  };

  return (
    <div className="signup-page">
      {/* Signup Card */}
      <div className="signup-container">
        <div className="signup-card">
          <h1 className="signup-title">
            Register Your <span className="gradient-text">NGO</span>
          </h1>
          <p className="signup-subtitle">
            Join us to help keep cities clean and healthy
          </p>

          <form className="signup-form" onSubmit={handleSubmit}>
            {/* Username */}
            <div className="form-group">
              <label>Username</label>
              <input type="text" placeholder="Enter username" required />
            </div>

            {/* Email */}
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" placeholder="ngo@example.com" required />
            </div>

            {/* Password */}
            <div className="form-group">
              <label>Password</label>
              <input type="password" placeholder="••••••••" required />
            </div>

            {/* NGO Name */}
            <div className="form-group">
              <label>NGO Name</label>
              <input type="text" placeholder="Your NGO Name" required />
            </div>

            {/* NGO Registration Number */}
            <div className="form-group">
              <label>NGO Registration Number</label>
              <input
                type="text"
                placeholder="NGO Registration No."
                required
              />
            </div>

            {/* Categories */}
            <div className="form-group">
              <label>
                Garbage Categories <span className="required">*</span>
              </label>
              <div className="categories-grid">
                {garbageCategories.map((category) => (
                  <button
                    type="button"
                    key={category}
                    className={`category-chip ${selectedCategories.includes(category) ? 'selected' : ''
                      }`}
                    onClick={() => toggleCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
              {selectedCategories.length === 0 && (
                <p className="error-text">
                  Please select at least one category
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn btn-primary btn-full"
              disabled={selectedCategories.length === 0}
            >
              <span>Create Account</span>
              <span className="btn-icon">→</span>
            </button>
          </form>

          {/* Footer */}
          <div className="signup-footer">
            <p>
              Already registered? <Link to="/signin">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
