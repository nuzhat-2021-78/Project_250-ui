import React, { useState, useEffect } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";

function QuestionSetupForm() {
  const token = localStorage.getItem("token");
  const currentUsername = localStorage.getItem("username");
  const privileges = JSON.parse(localStorage.getItem("privileges") || "[]");
  const hasPermission = privileges.includes("CREATE_QUESTION");

  // All hooks before conditional return
  const [formData, setFormData] = useState({
    questionText: "",
    questionTypeId: "",
    difficultyLevelId: "",
    subjectId: "",
    classLevelId: "",
    importance: "ONE",
    mcqOptions: [{ optionText: "", correct: false, sortOrder: 1, imageKey: "" }],
    answer: {},
    score: 1,
    explanation: "",
    active: true,
  });

  const [metadata, setMetadata] = useState({
    questionTypes: [],
    difficultyLevels: [],
    subjects: [],
    classLevels: [],
  });

  const [questionImages, setQuestionImages] = useState([]);
  const [optionImages, setOptionImages] = useState([]);

  useEffect(() => {
    const fetchMetadata = async () => {
      const [qTypes, dLevels, subjects, classes] = await Promise.all([
        axios.get("http://localhost:9090/api/v1/question-types/ui/all"),
        axios.get("http://localhost:9090/api/v1/difficulty-levels/ui/all"),
        axios.get("http://localhost:9090/api/v1/subjects/ui/all"),
        axios.get("http://localhost:9090/api/v1/class-levels/ui/all"),
      ]);
      setMetadata({
        questionTypes: qTypes.data,
        difficultyLevels: dLevels.data,
        subjects: subjects.data,
        classLevels: classes.data,
      });
    };
    fetchMetadata();
  }, []);

  // Conditional redirects after hooks
  if (!token) return <Navigate to="/login" />;
  if (!hasPermission) return <Navigate to="/unauthorized" />;

  // Rest of your handlers and JSX unchanged...
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleMcqOptionChange = (index, field, value) => {
    const newOptions = [...formData.mcqOptions];
    newOptions[index][field] = value;
    setFormData({ ...formData, mcqOptions: newOptions });
  };

  const addMcqOption = () => {
    setFormData({
      ...formData,
      mcqOptions: [
        ...formData.mcqOptions,
        { optionText: "", correct: false, sortOrder: formData.mcqOptions.length + 1, imageKey: "" },
      ],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    const questionPayload = {
      ...formData,
      createdBy: currentUsername,
      modifiedBy: currentUsername,
    };

    form.append("question", new Blob([JSON.stringify(questionPayload)], { type: "application/json" }));
    questionImages.forEach((img) => form.append("images", img));
    optionImages.forEach((img) => form.append("optionImages", img));

    try {
      const res = await axios.post("http://localhost:9090/api/v1/questions", form, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Question created successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to create question");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white p-6 shadow-md rounded-md">
        <h2 className="text-xl font-semibold mb-4">Create Question</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Question Text</label>
            <textarea name="questionText" value={formData.questionText} onChange={handleChange} required className="w-full border rounded p-2" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">Question Type</label>
              <select name="questionTypeId" value={formData.questionTypeId} onChange={handleChange} required className="w-full border p-2 rounded">
                <option value="">Select Type</option>
                {metadata.questionTypes.map((type) => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-medium mb-1">Difficulty</label>
              <select name="difficultyLevelId" value={formData.difficultyLevelId} onChange={handleChange} required className="w-full border p-2 rounded">
                <option value="">Select Level</option>
                {metadata.difficultyLevels.map((lvl) => (
                  <option key={lvl.id} value={lvl.id}>{lvl.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-medium mb-1">Subject</label>
              <select name="subjectId" value={formData.subjectId} onChange={handleChange} required className="w-full border p-2 rounded">
                <option value="">Select Subject</option>
                {metadata.subjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>{sub.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-medium mb-1">Class Level</label>
              <select name="classLevelId" value={formData.classLevelId} onChange={handleChange} required className="w-full border p-2 rounded">
                <option value="">Select Class</option>
                {metadata.classLevels.map((cls) => (
                  <option key={cls.id} value={cls.id}>{cls.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-medium mb-1">Score</label>
            <input type="number" name="score" value={formData.score} onChange={handleChange} className="w-full border p-2 rounded" />
          </div>

          <div>
            <label className="block font-medium mb-1">Explanation</label>
            <textarea name="explanation" value={formData.explanation} onChange={handleChange} className="w-full border rounded p-2" />
          </div>

          <div>
            <label className="block font-medium mb-1">Question Images</label>
            <input type="file" multiple onChange={(e) => setQuestionImages([...e.target.files])} className="w-full" />
          </div>

          <div>
            <h4 className="text-lg font-medium">MCQ Options</h4>
            {formData.mcqOptions.map((opt, index) => (
              <div key={index} className="grid grid-cols-3 gap-2 items-center mb-2">
                <input
                  placeholder="Option Text"
                  value={opt.optionText}
                  onChange={(e) => handleMcqOptionChange(index, "optionText", e.target.value)}
                  className="border p-2 rounded w-full"
                />
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={opt.correct}
                    onChange={(e) => handleMcqOptionChange(index, "correct", e.target.checked)}
                    className="mr-2"
                  />
                  Correct
                </label>
                <input
                  placeholder="Image Key (filename)"
                  value={opt.imageKey || ""}
                  onChange={(e) => handleMcqOptionChange(index, "imageKey", e.target.value)}
                  className="border p-2 rounded w-full"
                />
              </div>
            ))}
            <button type="button" onClick={addMcqOption} className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300 mt-2">Add Option</button>
          </div>

          <div>
            <label className="block font-medium mb-1">Option Images</label>
            <input type="file" multiple onChange={(e) => setOptionImages([...e.target.files])} className="w-full" />
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">Submit Question</button>
        </form>
      </div>
    </div>
  );
}

export default QuestionSetupForm;
