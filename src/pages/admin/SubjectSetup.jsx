import React, { useState, useEffect } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";

const SubjectSetup = () => {
  const token = localStorage.getItem("token");
  const privileges = JSON.parse(localStorage.getItem("privileges") || "[]");

  const hasPermission = privileges.includes("SETUP_PERMISSION");

  const [subjects, setSubjects] = useState([]);
  const [name, setName] = useState("");
  const [parentId, setParentId] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await axios.get("http://localhost:9090/api/v1/subjects/ui/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSubjects(res.data);
      } catch (err) {
        console.error("Failed to load subjects", err);
      }
    };

    fetchSubjects();
  }, [token]); // ✅ Called unconditionally

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:9090/api/v1/subjects/subject",
        { name, parentId: parentId || null },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage(`✅ Subject '${response.data.name}' created successfully`);
      setName("");
      setParentId("");
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to create subject");
    }
  };

  // ✅ Conditional rendering AFTER hooks
  if (!token) return <Navigate to="/login" />;
  if (!hasPermission) return <Navigate to="/unauthorized" />;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-xl font-semibold mb-4">Setup Subject</h2>
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
          <label className="block text-sm font-medium mb-1">Parent Subject (optional)</label>
          <select
            value={parentId}
            onChange={(e) => setParentId(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="">-- None --</option>
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create Subject
        </button>
      </form>
    </div>
  );
};

export default SubjectSetup;
