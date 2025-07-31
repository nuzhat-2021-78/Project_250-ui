
import React, { useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";

const ClassLevelSetup = () => {
  const token = localStorage.getItem("token");
  const privileges = JSON.parse(localStorage.getItem("privileges") || "[]");

  const hasPermission = privileges.includes("SETUP_PERMISSION");

  const [name, setName] = useState("");
  const [curriculum, setCurriculum] = useState("");
  const [educationLevel, setEducationLevel] = useState("");
  const [message, setMessage] = useState("");

  if (!token) return <Navigate to="/login" />;
  if (!hasPermission) return <Navigate to="/unauthorized" />;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:9090/api/v1/class-levels/class-level",
        { name, curriculum, educationLevel },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage(`✅ Class Level '${response.data.name}' created successfully`);
      setName("");
      setCurriculum("");
      setEducationLevel("");
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to create class level");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-xl font-semibold mb-4">Setup Class Level</h2>
      {message && <div className="mb-4 text-sm text-gray-700">{message}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name *</label>
          <input
            type="text"
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Curriculum</label>
          <input
            type="text"
            value={curriculum}
            onChange={(e) => setCurriculum(e.target.value)}
            placeholder="e.g., Cambridge, Oxford"
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Education Level</label>
          <input
            type="text"
            value={educationLevel}
            onChange={(e) => setEducationLevel(e.target.value)}
            placeholder="e.g., Primary, Secondary"
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create Class Level
        </button>
      </form>
    </div>
  );
};

export default ClassLevelSetup;