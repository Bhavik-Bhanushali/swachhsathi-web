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
  const { signUp } = useAuth();

  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    // In a real app we'd save the extra data (username, ngoName, etc) to Firestore here

    try {
      await signUp({ email, password });
      navigate('/dashboard');
    } catch (error) {
      console.error("Signup failed", error);
      alert("Signup failed: " + error.message);
    }
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
              <input type="text" name="username" placeholder="Enter username" required />
            </div>

            {/* Email */}
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" name="email" placeholder="ngo@example.com" required />
            </div>

            {/* Password */}
            <div className="form-group">
              <label>Password</label>
              <input type="password" name="password" placeholder="••••••••" required />
            </div>

            {/* NGO Name */}
            <div className="form-group">
              <label>NGO Name</label>
              <input type="text" name="ngoName" placeholder="Your NGO Name" required />
            </div>

            {/* NGO Registration Number */}
            <div className="form-group">
              <label>NGO Registration Number</label>
              <input
                type="text"
                name="ngoRegNo"
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
