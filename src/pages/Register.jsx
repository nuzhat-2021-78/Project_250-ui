import React, { useState, useEffect } from "react";
import axios from "axios";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    organizationId: "",
    contactNumber: "",
    department: "",
    qualifications: "",
    joinDate: ""
  });

  const [organizations, setOrganizations] = useState([]);
  const [message, setMessage] = useState("");

  // ✅ Load organizations (no token needed)
  useEffect(() => {
    axios.get("http://localhost:9090/api/organizations/all")
      .then(res => {
        setOrganizations(res.data);
        setMessage(""); // clear any old error message
      })
      .catch(err => {
        console.error("Error loading organizations", err);
        setMessage("❌ Failed to load organization list.");
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = { ...formData };

    axios.post("http://localhost:9090/api/auth/signup/teacher", payload)
      .then(res => {
        setMessage("✅ Registration successful!");
        setFormData({
          name: "",
          username: "",
          email: "",
          password: "",
          organizationId: "",
          contactNumber: "",
          department: "",
          qualifications: "",
          joinDate: ""
        });
      })
      .catch(err => {
        setMessage("❌ Registration failed: " + (err.response?.data?.message || err.message));
      });
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-md rounded-xl">
      <h2 className="text-2xl font-bold mb-4 text-center text-amber-600">Teacher Registration</h2>

      {message && (
        <div className="mb-4 text-center text-sm text-red-600">{message}</div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        <input name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required className="input" />
        <input name="username" placeholder="Username" value={formData.username} onChange={handleChange} required className="input" />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required className="input" />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required className="input" />
        <input name="contactNumber" placeholder="Contact Number" value={formData.contactNumber} onChange={handleChange} className="input" />
        <input name="department" placeholder="Department" value={formData.department} onChange={handleChange} className="input" />
        <input name="qualifications" placeholder="Qualifications" value={formData.qualifications} onChange={handleChange} className="input" />
        <input type="date" name="joinDate" value={formData.joinDate} onChange={handleChange} required className="input" />

        <select name="organizationId" value={formData.organizationId} onChange={handleChange} className="input" required>
          <option value="">Select Organization</option>
          {organizations.map((org) => (
            <option key={org.id} value={org.id}>
              {org.name}
            </option>
          ))}
        </select>

        <button type="submit" className="bg-amber-500 text-white py-2 rounded-lg font-semibold hover:bg-amber-600 transition">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
