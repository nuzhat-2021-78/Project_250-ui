import React, { useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";

const ExamPaperCreate = () => {
  const token = localStorage.getItem("token");
  const privileges = JSON.parse(localStorage.getItem("privileges") || "[]");
  const hasPermission = privileges.includes("CREATE_EXAM_PAPER");

  const [title, setTitle] = useState("");
  //const [createdBy, setCreatedBy] = useState("");
  const [createdBy] = useState(localStorage.getItem("username") || "");
  const [duration, setDuration] = useState("");
  const [questionList, setQuestionList] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [subjectFilter, setSubjectFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
   const [classLevelFilter, setClassLevelFilter] = useState(""); // ✅ added
  const [mcqPreview, setMcqPreview] = useState({});
  const [message, setMessage] = useState("");

  // ✅ Safe Hook Usage
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
        setQuestionList(res.data);
        console.log("Fetched Questions:", res.data);
      } catch (err) {
        console.error("Error fetching questions:", err);
      }
    };

    fetchQuestions();
  }, [token, hasPermission]);

  // ✅ Redirects after hooks are declared
  if (!token) return <Navigate to="/login" />;
  if (!hasPermission) return <Navigate to="/unauthorized" />;

  const handleSelectQuestion = (qId) => {
    if (selectedQuestions.some((q) => q.questionId === qId)) {
      setSelectedQuestions((prev) => prev.filter((q) => q.questionId !== qId));
    } else {
      setSelectedQuestions((prev) => [...prev, { questionId: qId, mark: 1 }]);
    }
  };

  const handleMarkChange = (qId, mark) => {
    setSelectedQuestions((prev) =>
      prev.map((q) =>
        q.questionId === qId ? { ...q, mark: parseInt(mark) } : q
      )
    );
  };

  const handlePreviewToggle = async (qId) => {
    if (mcqPreview[qId]) {
      setMcqPreview((prev) => ({ ...prev, [qId]: null }));
    } else {
      try {
        const res = await axios.get(
          `http://localhost:9090/api/v1/questions/${qId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setMcqPreview((prev) => ({
          ...prev,
          [qId]: res.data.mcqOptions || [],
        }));
      } catch (err) {
        console.error("Preview error", err);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedQuestions.length)
      return setMessage("❌ Select at least one question");

    try {
      const res = await axios.post(
        "http://localhost:9090/api/exam-papers",
        {
          title,
          createdBy,
          duration,
          questions: selectedQuestions,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(`✅ Exam Paper '${res.data.title}' created successfully`);
      setTitle("");
      //setCreatedBy("");
      setDuration("");
      setSelectedQuestions([]);
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to create exam paper");
    }
  };

  const filteredQuestions = questionList.filter(
    (q) =>
      (!subjectFilter ||
        q.subject.toLowerCase().includes(subjectFilter.toLowerCase())) &&
      (!typeFilter ||
        q.questionType.toLowerCase().includes(typeFilter.toLowerCase())) &&
      (!classLevelFilter ||
        q.classLevel.toLowerCase().includes(classLevelFilter.toLowerCase())) // ✅ added
  );

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-semibold mb-4">Create Exam Paper</h2>
      {message && (
        <div className="mb-4 text-sm text-gray-700 font-medium">{message}</div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Exam Title"
          className="w-full border border-gray-300 rounded px-3 py-2"
          required
        />

        <input
        type="text"
        value={createdBy}
        readOnly
        className="w-full border border-gray-300 rounded px-3 py-2"
       />

        <input
          type="text"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          placeholder="Duration (e.g., 90 minutes)"
          className="w-full border border-gray-300 rounded px-3 py-2"
        />

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

        <div className="border p-4 rounded bg-gray-50 max-h-[400px] overflow-y-auto">
          <h3 className="font-semibold mb-2">Select Questions</h3>
          {filteredQuestions.map((q) => (
            <div key={q.id} className="border-b py-2">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={selectedQuestions.some(
                    (sel) => sel.questionId === q.id
                  )}
                  onChange={() => handleSelectQuestion(q.id)}
                />
                <span>{q.questionText}</span>
              </label>

              {selectedQuestions.some((sel) => sel.questionId === q.id) && (
                <div className="ml-6 mt-1 flex items-center gap-3">
                  <label className="text-sm">Mark:</label>
                  <input
                    type="number"
                    min="1"
                    value={
                      selectedQuestions.find(
                        (sel) => sel.questionId === q.id
                      )?.mark || 1
                    }
                    onChange={(e) =>
                      handleMarkChange(q.id, e.target.value)
                    }
                    className="w-20 px-2 py-1 border rounded"
                  />
                  {q.questionType === "MCQ" && (
                    <button
                      type="button"
                      onClick={() => handlePreviewToggle(q.id)}
                      className="text-blue-600 text-sm underline"
                    >
                      {mcqPreview[q.id] ? "Hide Options" : "Show Options"}
                    </button>
                  )}
                </div>
              )}

              {mcqPreview[q.id] && (
                <ul className="ml-8 mt-1 list-disc text-sm text-gray-600">
                  {mcqPreview[q.id].map((opt, idx) => (
                    <li key={idx}>{opt.optionText}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Create Exam Paper
        </button>
      </form>
    </div>
  );
};

export default ExamPaperCreate;
