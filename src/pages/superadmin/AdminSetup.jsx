import React, { useState } from "react";
import axios from "axios";

const AdminSetup = () => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    adminRoleTitle: "",
    contactNumber: "",
    notes: "",
    joinDate: ""
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    axios.post("http://localhost:9090/api/auth/signup/admin", formData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        setMessage("✅ Admin registered successfully!");
        setFormData({
          name: "",
          username: "",
          email: "",
          password: "",
          adminRoleTitle: "",
          contactNumber: "",
          notes: "",
          joinDate: ""
        });
      })
      .catch(err => {
        console.error(err);
        setMessage("❌ Registration failed: " + (err.response?.data?.message || err.message));
      });
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-md rounded-xl">
      <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">Admin Registration</h2>

      {message && (
        <div className="mb-4 text-center text-sm text-red-600">{message}</div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        <input name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required className="input" />
        <input name="username" placeholder="Username" value={formData.username} onChange={handleChange} required className="input" />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required className="input" />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required className="input" />
        <input name="adminRoleTitle" placeholder="Admin Role Title" value={formData.adminRoleTitle} onChange={handleChange} className="input" />
        <input name="contactNumber" placeholder="Contact Number" value={formData.contactNumber} onChange={handleChange} className="input" />
        <input name="notes" placeholder="Notes" value={formData.notes} onChange={handleChange} className="input" />
        <input type="date" name="joinDate" value={formData.joinDate} onChange={handleChange} className="input" />

        <button type="submit" className="bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
          Register Admin
        </button>
      </form>
    </div>
  );
};

export default AdminSetup;
