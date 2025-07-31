import React, { useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";

const ExamPaperList = () => {
  const token = localStorage.getItem("token");
  const privileges = JSON.parse(localStorage.getItem("privileges") || "[]");
  const hasPermission = privileges.includes("CREATE_EXAM_PAPER");
  const username = localStorage.getItem("username");

  const [examPapers, setExamPapers] = useState([]);
  const [questionDetails, setQuestionDetails] = useState({});

  // Load exam papers
  useEffect(() => {
    const fetchExamPapers = async () => {
      if (!token || !hasPermission) return;
      try {
        const res = await axios.get(`http://localhost:9090/api/exam-papers/by-creator?username=${username}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setExamPapers(res.data);
      } catch (err) {
        console.error("Error fetching exam papers:", err);
      }
    };
    fetchExamPapers();
  }, [token, hasPermission, username]);

  // Load question details
  useEffect(() => {
    const fetchQuestionDetails = async () => {
      const allQuestionIds = new Set();
      examPapers.forEach((paper) =>
        paper.questions.forEach((q) => allQuestionIds.add(q.questionId))
      );

      for (const qId of allQuestionIds) {
        if (!questionDetails[qId]) {
          try {
            const res = await axios.get(`http://localhost:9090/api/v1/questions/${qId}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            setQuestionDetails((prev) => ({
              ...prev,
              [qId]: res.data,
            }));
          } catch (err) {
            console.error(`Failed to fetch question ${qId}`, err);
          }
        }
      }
    };

    if (examPapers.length > 0) {
      fetchQuestionDetails();
    }
  }, [examPapers, token, questionDetails]);

  if (!token) return <Navigate to="/login" />;
  if (!hasPermission) return <Navigate to="/unauthorized" />;

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-semibold mb-6">All Exam Papers</h2>

      {examPapers.length === 0 ? (
        <p className="text-gray-600">No exam papers found.</p>
      ) : (
        examPapers.map((paper) => (
          <div key={paper.id} className="mb-6 border-b pb-4">
            <h3 className="text-lg font-bold">{paper.title}</h3>
            <p className="text-sm text-gray-600">
              Created by: {paper.createdBy} | Duration: {paper.duration} | Date:{" "}
              {new Date(paper.createdAt).toLocaleString()}
            </p>

            <div className="mt-3">
              <h4 className="font-semibold mb-2">Questions:</h4>
              {paper.questions.map((q, idx) => {
                const qData = questionDetails[q.questionId];
                const correctIds = qData?.answer?.correctOptionIds || [];

                return (
                  <div key={q.questionId} className="ml-4 mb-4 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{idx + 1}.</span>
                      <span className="flex-1">
                        {qData ? qData.questionText : "Loading..."}
                      </span>
                      <span className="text-gray-600">[Mark: {q.mark}]</span>
                    </div>

                    {qData?.questionTypeId === 1 && qData.mcqOptions?.length > 0 && (
                      <ul className="ml-6 mt-1 list-disc text-gray-700">
                        {qData.mcqOptions
                          .sort((a, b) => a.sortOrder - b.sortOrder)
                          .map((opt, idx) => (
                            <li key={opt.id} className="mb-1">
                              <span className="mr-1 font-medium">
                                {String.fromCharCode(65 + idx)}.
                              </span>
                              {opt.optionText}
                              {correctIds.includes(opt.id) && (
                                <span className="ml-2 text-green-600 font-semibold">
                                  ✅
                                </span>
                              )}
                              {opt.imageUrl && (
                                <div className="mt-1">
                                  <img
                                    src={opt.imageUrl}
                                    alt={`Option ${idx + 1}`}
                                    className="w-40 border rounded"
                                  />
                                </div>
                              )}
                            </li>
                          ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ExamPaperList;
