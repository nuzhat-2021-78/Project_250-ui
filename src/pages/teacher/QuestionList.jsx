import React, { useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";

const QuestionList = () => {
  const token = localStorage.getItem("token");
  const privileges = JSON.parse(localStorage.getItem("privileges") || "[]");
  const hasPermission = privileges.includes("CREATE_QUESTION");

  const [questions, setQuestions] = useState([]);
  const [subjectFilter, setSubjectFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [classLevelFilter, setClassLevelFilter] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token || !hasPermission) return;

    const fetchQuestions = async () => {
      try {
        const res = await axios.get(
          "http://localhost:9090/api/v1/questions/for-exam-paper",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setQuestions(res.data);
        console.log("Fetched Questions:", res.data);
      } catch (err) {
        console.error("Error fetching questions:", err);
        setMessage("❌ Failed to load questions.");
      }
    };

    fetchQuestions();
  }, [token, hasPermission]);

  if (!token) return <Navigate to="/login" />;
  if (!hasPermission) return <Navigate to="/unauthorized" />;

  const filteredQuestions = questions.filter(
    (q) =>
      (!subjectFilter ||
        q.subject.toLowerCase().includes(subjectFilter.toLowerCase())) &&
      (!typeFilter ||
        q.questionType.toLowerCase().includes(typeFilter.toLowerCase())) &&
      (!classLevelFilter ||
        q.classLevel.toLowerCase().includes(classLevelFilter.toLowerCase()))
  );

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-semibold mb-4">Question List</h2>

      {message && (
        <div className="mb-4 text-sm text-red-600 font-medium">{message}</div>
      )}

      <div className="flex gap-4 mb-4">
        <input
          type="text"
          value={subjectFilter}
          onChange={(e) => setSubjectFilter(e.target.value)}
          placeholder="Filter by Subject"
          className="flex-1 border border-gray-300 rounded px-3 py-2"
        />
        <input
          type="text"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          placeholder="Filter by Question Type"
          className="flex-1 border border-gray-300 rounded px-3 py-2"
        />
        <input
          type="text"
          value={classLevelFilter}
          onChange={(e) => setClassLevelFilter(e.target.value)}
          placeholder="Filter by Class Level"
          className="flex-1 border border-gray-300 rounded px-3 py-2"
        />
      </div>

      <div className="border p-4 rounded bg-gray-50 max-h-[500px] overflow-y-auto">
        {filteredQuestions.length > 0 ? (
          filteredQuestions.map((q) => (
            <div key={q.id} className="border-b py-3">
              <p className="font-medium">{q.questionText}</p>
              <p className="text-sm text-gray-600">
                Subject: {q.subject} | Type: {q.questionType} | Class: {q.classLevel}
              </p>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">No questions found.</p>
        )}
      </div>
    </div>
  );
};

export default QuestionList;
