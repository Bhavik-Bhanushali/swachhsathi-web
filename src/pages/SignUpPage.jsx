import { useState, useRef } from 'react';
import './SignUpPage.css';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCreateNGO } from '../../firebase/hooks/useNGO';
import { useJsApiLoader, Autocomplete } from '@react-google-maps/api';
import { useUser } from '../../firebase/hooks/useUsers';
import { ArrowRight } from 'lucide-react';

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

const libraries = ['marker', 'places'];

const SignUpPage = () => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const { createNGO } = useCreateNGO();
  const {createUser} = useUser();
  // Google Maps Autocomplete
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  const [autocomplete, setAutocomplete] = useState(null);
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");

  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const onLoad = (autocompleteInstance) => {
    setAutocomplete(autocompleteInstance);
  };

  const onPlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      const formattedAddress = place.formatted_address;
      setAddress(formattedAddress || "");

      // Extract city from address components
      if (place.address_components) {
        const cityComponent = place.address_components.find(component =>
          component.types.includes('locality')
        );
        if (cityComponent) {
          setCity(cityComponent.long_name);
        }
      }
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (selectedCategories.length === 0) {
    alert("Please select at least one category");
    return;
  }

  const formData = new FormData(e.target);

  const email = formData.get('email');
  const password = formData.get('password');
  const ngoName = formData.get('ngoName');
  const ngoRegNo = formData.get('ngoRegNo');
  const phone = formData.get('phone');
  const contactPerson = formData.get('contactPerson');
  const addressInput = formData.get('address');
  const cityInput = formData.get('city');

  console.log(formData);
  console.log(email);
  console.log(password);
  console.log(ngoName);
  console.log(ngoRegNo);
  console.log(phone);
  console.log(contactPerson);
  console.log(addressInput);
  console.log(cityInput);
  console.log(selectedCategories);
  
  // return;
  

  try {
    // 1️⃣ Create Auth User
    const authUser = await signUp({ email, password });
    console.log("Auth user: ", authUser);
    
    if (!authUser || !authUser.uid) {
      throw new Error("Failed to create user account");
    }
    
    const uid = authUser.uid;
    console.log("User UID: ", uid);

    // 2️⃣ Create NGO (Firestore with same ID as user)
    const ngoPayload = {
      name: ngoName,
      registrationNumber: ngoRegNo,
      contactPerson,
      email,
      phone,
      address: addressInput,
      city: cityInput,
      categories: selectedCategories,
      adminId: uid,
      status: 'pending',
    };

    await createNGO({ ngoId: uid, ngoData: ngoPayload });
    const ngoId = uid; // NGO ID is the same as user ID

    // 3️⃣ Create User Doc
    await createUser({
      uid,
      email,
      name: contactPerson,
      phone,
      role: 'admin',
      ngoId,
      createdAt: new Date(),
    });

    navigate('/dashboard');
  } catch (error) {
    console.error("Signup failed:", error);
    alert(error.message);
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
            {/* Contact Person / Username */}
            <div className="form-group">
              <label>Contact Person Name</label>
              <input type="text" name="contactPerson" placeholder="Enter full name" required />
            </div>

            <div className="form-row">
              {/* Email */}
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" name="email" placeholder="ngo@example.com" required />
              </div>

              {/* Phone */}
              <div className="form-group">
                <label>Phone Number</label>
                <input type="tel" name="phone" placeholder="+91 9876543210" required />
              </div>
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

            {/* Address with Google Maps */}
            <div className="form-group">
              <label> Address</label>

              <input
                type="text"
                name="address"
                placeholder="Enter NGO address"
                required
              />

            </div>

            {/* City */}
            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                name="city"
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
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
              <ArrowRight size={18} className="btn-icon" />
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
