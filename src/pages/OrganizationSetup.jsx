import React, { useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";

const OrganizationSetup = () => {
  const token = localStorage.getItem("token");
  const privileges = JSON.parse(localStorage.getItem("privileges") || "[]");

  const hasPermission = privileges.includes("SETUP_PERMISSION");

  const [name, setName] = useState("");
  const [type, setType] = useState("UNIVERSITY");
  const [message, setMessage] = useState("");

  if (!token) return <Navigate to="/login" />;
  if (!hasPermission) return <Navigate to="/unauthorized" />;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:9090/api/organizations",
        { name, type },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage(`✅ Organization '${response.data.name}' created successfully`);
      setName("");
      setType("UNIVERSITY");
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to create organization");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-xl font-semibold mb-4">Setup Organization</h2>
      {message && <div className="mb-4 text-sm text-gray-700">{message}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="UNIVERSITY">UNIVERSITY</option>
            <option value="COLLEGE">COLLEGE</option>
            <option value="SCHOOL">SCHOOL</option>
            <option value="INSTITUTE">INSTITUTE</option>
            <option value="OTHER">OTHER</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create Organization
        </button>
      </form>
    </div>
  );    
};

export default OrganizationSetup;
