import React, { useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";

const ExamPaperDownload = () => {
  const token = localStorage.getItem("token");
  const privileges = JSON.parse(localStorage.getItem("privileges") || "[]");
  const hasPermission = privileges.includes("CREATE_EXAM_PAPER");
  const username = localStorage.getItem("username");

  const [examPapers, setExamPapers] = useState([]);

  useEffect(() => {
    if (!token || !hasPermission) return;

    const fetchExamPapers = async () => {
      try {
        const res = await axios.get(`http://localhost:9090/api/exam-papers/by-creator?username=${username}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setExamPapers(res.data);
      } catch (err) {
        console.error("Failed to fetch exam papers", err);
      }
    };

    fetchExamPapers();
  }, [token, hasPermission, username]);

  const handleDownload = async (id, format) => {
    const url = `http://localhost:9090/api/exam-papers/exam-papers/${id}/download/${format}`;

    try {
      const res = await axios.get(url, {
        responseType: "blob", // important for binary data
        headers: { Authorization: `Bearer ${token}` },
      });

      const blob = new Blob([res.data], {
        type: format === "pdf" ? "application/pdf" : "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });

      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `exam-paper-${id}.${format}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(`Download ${format.toUpperCase()} failed`, err);
      alert("❌ Download failed");
    }
  };

  if (!token) return <Navigate to="/login" />;
  if (!hasPermission) return <Navigate to="/unauthorized" />;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-semibold mb-4">Download Exam Papers</h2>

      {examPapers.length === 0 ? (
        <p className="text-gray-600">No exam papers available.</p>
      ) : (
        <ul className="space-y-4">
          {examPapers.map((paper) => (
            <li key={paper.id} className="border p-4 rounded shadow-sm">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-lg">{paper.title}</h3>
                  <p className="text-sm text-gray-600">
                    Created by: {paper.createdBy} | Duration: {paper.duration}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleDownload(paper.id, "pdf")}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                  >
                    Download PDF
                  </button>
                  <button
                    onClick={() => handleDownload(paper.id, "docx")}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
                  >
                    Download DOCX
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ExamPaperDownload;
