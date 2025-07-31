import React, { useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";

const QuestionTypeSetup = () => {
  const token = localStorage.getItem("token");
  const privileges = JSON.parse(localStorage.getItem("privileges") || "[]");
  const hasPermission = privileges.includes("SETUP_PERMISSION");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  if (!token) return <Navigate to="/login" />;
  if (!hasPermission) return <Navigate to="/unauthorized" />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:9090/api/v1/question-types/add",
        { name, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(`✅ '${response.data.name}' created successfully.`);
      setName("");
      setDescription("");
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to create question type.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-xl font-semibold mb-4">Setup Question Type</h2>
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
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            rows="3"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create
        </button>
      </form>
    </div>
  );
};

export default QuestionTypeSetup;
