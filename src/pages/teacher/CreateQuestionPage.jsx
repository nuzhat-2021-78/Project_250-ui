import React, { useState, useEffect } from "react";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";

function CreateQuestionPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const currentUsername = localStorage.getItem("username");
  const privileges = JSON.parse(localStorage.getItem("privileges") || "[]");
  const hasPermission = privileges.includes("CREATE_QUESTION");

  // State management
  const [formData, setFormData] = useState({
    questionText: "",
    questionTypeId: "",
    difficultyLevelId: "",
    subjectId: "",
    classLevelId: "",
    importance: "ONE",
    mcqOptions: [],
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch metadata
  useEffect(() => {
    if (!token || !hasPermission) return;

    const fetchMetadata = async () => {
      try {
        setLoading(true);
        const [qTypes, dLevels, subjects, classes] = await Promise.all([
          axios.get("http://localhost:9090/api/v1/question-types/ui/all", {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get("http://localhost:9090/api/v1/difficulty-levels/ui/all", {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get("http://localhost:9090/api/v1/subjects/ui/all", {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get("http://localhost:9090/api/v1/class-levels/ui/all", {
            headers: { Authorization: `Bearer ${token}` }
          }),
        ]);
        setMetadata({
          questionTypes: qTypes.data,
          difficultyLevels: dLevels.data,
          subjects: subjects.data,
          classLevels: classes.data,
        });
      } catch (err) {
        setError("Failed to load metadata");
      } finally {
        setLoading(false);
      }
    };
    fetchMetadata();
  }, [token, hasPermission]);

  // Handle authentication
  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else if (!hasPermission) {
      navigate("/unauthorized");
    }
  }, [token, hasPermission, navigate]);

  // Handle MCQ options when question type changes
  useEffect(() => {
    if (formData.questionTypeId === "1") { // Assuming 1 is MCQ type ID
      setFormData(prev => ({
        ...prev,
        mcqOptions: prev.mcqOptions.length > 0 ? prev.mcqOptions : [
          { optionText: "", correct: false, sortOrder: 1, imageKey: "" },
          { optionText: "", correct: false, sortOrder: 2, imageKey: "" }
        ]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        mcqOptions: [],
        answer: {} // Reset answer when not MCQ
      }));
    }
  }, [formData.questionTypeId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleMcqOptionChange = (index, field, value) => {
    const newOptions = [...formData.mcqOptions];
    newOptions[index][field] = value;
    
    // Ensure only one option is correct for MCQ
    if (field === "correct" && value === true) {
      newOptions.forEach((option, i) => {
        if (i !== index) option.correct = false;
      });
    }
    
    setFormData({ ...formData, mcqOptions: newOptions });
  };

  const addMcqOption = () => {
    setFormData({
      ...formData,
      mcqOptions: [
        ...formData.mcqOptions,
        { 
          optionText: "", 
          correct: false, 
          sortOrder: formData.mcqOptions.length + 1, 
          imageKey: "" 
        },
      ],
    });
  };

  const removeMcqOption = (index) => {
    const newOptions = formData.mcqOptions.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      mcqOptions: newOptions.map((opt, i) => ({
        ...opt,
        sortOrder: i + 1
      }))
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.questionTypeId === "1" && 
        formData.mcqOptions.filter(opt => opt.correct).length !== 1) {
      setError("For MCQ questions, exactly one option must be correct");
      return;
    }

    try {
      setLoading(true);
      const form = new FormData();
      const questionPayload = {
        ...formData,
        createdBy: currentUsername,
        modifiedBy: currentUsername,
      };

      form.append("question", new Blob([JSON.stringify(questionPayload)], { 
        type: "application/json" 
      }));
      
      questionImages.forEach((img) => form.append("images", img));
      optionImages.forEach((img) => form.append("optionImages", img));

      await axios.post("http://localhost:9090/api/v1/questions", form, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      
      // Reset form after successful submission
      setFormData({
        questionText: "",
        questionTypeId: "",
        difficultyLevelId: "",
        subjectId: "",
        classLevelId: "",
        importance: "THREE",
        mcqOptions: [],
        answer: {},
        score: 1,
        explanation: "",
        active: true,
      });
      setQuestionImages([]);
      setOptionImages([]);
      setError(null);
      alert("Question created successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create question");
    } finally {
      setLoading(false);
    }
  };

  if (!token || !hasPermission) {
    return null; // Already handled by useEffect navigation
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white p-6 shadow-md rounded-md">
        <h2 className="text-xl font-semibold mb-4">Create Question</h2>
        
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        
        {loading && (
          <div className="mb-4 h-1 bg-gray-200">
            <div className="h-full bg-blue-500 animate-pulse"></div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
  <div>
    <label className="block font-medium mb-1">Question Text</label>
    <textarea 
      name="questionText" 
      value={formData.questionText} 
      onChange={handleChange} 
      required 
      className="w-full border rounded p-2" 
    />
  </div>

  <div className="grid grid-cols-2 gap-4">
    <div>
      <label className="block font-medium mb-1">Question Type</label>
      <select 
        name="questionTypeId" 
        value={formData.questionTypeId} 
        onChange={handleChange} 
        required 
        className="w-full border p-2 rounded"
      >
        <option value="">Select Type</option>
        {metadata.questionTypes.map((type) => (
          <option key={type.id} value={type.id}>{type.name}</option>
        ))}
      </select>
    </div>
    <div>
      <label className="block font-medium mb-1">Difficulty</label>
      <select 
        name="difficultyLevelId" 
        value={formData.difficultyLevelId} 
        onChange={handleChange} 
        required 
        className="w-full border p-2 rounded"
      >
        <option value="">Select Level</option>
        {metadata.difficultyLevels.map((lvl) => (
          <option key={lvl.id} value={lvl.id}>{lvl.level}</option>
        ))}
      </select>
    </div>
    <div>
      <label className="block font-medium mb-1">Subject</label>
      <select 
        name="subjectId" 
        value={formData.subjectId} 
        onChange={handleChange} 
        required 
        className="w-full border p-2 rounded"
      >
        <option value="">Select Subject</option>
        {metadata.subjects.map((sub) => (
          <option key={sub.id} value={sub.id}>{sub.name}</option>
        ))}
      </select>
    </div>
    <div>
      <label className="block font-medium mb-1">Class Level</label>
      <select 
        name="classLevelId" 
        value={formData.classLevelId} 
        onChange={handleChange} 
        required 
        className="w-full border p-2 rounded"
      >
        <option value="">Select Class</option>
        {metadata.classLevels.map((cls) => (
          <option key={cls.id} value={cls.id}>{cls.name}</option>
        ))}
      </select>
    </div>
  </div>

  <div className="grid grid-cols-2 gap-4">
    <div>
      <label className="block font-medium mb-1">Importance</label>
      <select 
        name="importance" 
        value={formData.importance} 
        onChange={handleChange} 
        className="w-full border p-2 rounded"
      >
        <option value="ONE">Very Low</option>
        <option value="TWO">Low</option>
        <option value="THREE">Medium</option>
        <option value="FOUR">High</option>
        <option value="FIVE">Very High</option>
      </select>
    </div>
    <div>
      <label className="block font-medium mb-1">Score</label>
      <input 
        type="number" 
        name="score" 
        value={formData.score} 
        onChange={handleChange} 
        min="1"
        className="w-full border p-2 rounded" 
      />
    </div>
  </div>

  <div>
    <label className="block font-medium mb-1">Explanation</label>
    <textarea 
      name="explanation" 
      value={formData.explanation} 
      onChange={handleChange} 
      className="w-full border rounded p-2" 
    />
  </div>

  <div>
    <label className="block font-medium mb-1">Question Images</label>
    <input 
      type="file" 
      multiple 
      onChange={(e) => setQuestionImages([...e.target.files])} 
      className="w-full" 
      accept="image/*"
    />
  </div>

  {/* MCQ Options Section - shown only when question type is MCQ */}
  {formData.questionTypeId === "1" && (
    <div>
      <h4 className="text-lg font-medium mb-2">MCQ Options</h4>
      {formData.mcqOptions.map((opt, index) => (
        <div key={index} className="grid grid-cols-12 gap-2 items-center mb-2">
          <div className="col-span-6">
            <input
              placeholder={`Option ${index + 1} Text`}
              value={opt.optionText}
              onChange={(e) => handleMcqOptionChange(index, "optionText", e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div className="col-span-2 flex items-center">
            <input
              type="checkbox"
              checked={opt.correct}
              onChange={(e) => handleMcqOptionChange(index, "correct", e.target.checked)}
              className="mr-2"
              id={`correct-${index}`}
            />
            <label htmlFor={`correct-${index}`}>Correct</label>
          </div>
          <div className="col-span-3">
            <input
              type="file"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  handleMcqOptionChange(index, "imageKey", file.name);
                  const newOptionImages = [...optionImages];
                  newOptionImages[index] = file;
                  setOptionImages(newOptionImages);
                }
              }}
              className="w-full"
              accept="image/*"
            />
          </div>
          <div className="col-span-1">
            {formData.mcqOptions.length > 2 && (
              <button
                type="button"
                onClick={() => removeMcqOption(index)}
                className="text-red-500 hover:text-red-700"
              >
                ×
              </button>
            )}
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={addMcqOption}
        className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300 mt-2"
      >
        Add Option
      </button>
    </div>
  )}

  {/* Option Images Section */}
  {formData.questionTypeId === "1" && (
    <div>
      <label className="block font-medium mb-1">Option Images</label>
      <input 
        type="file" 
        multiple 
        onChange={(e) => setOptionImages([...e.target.files])} 
        className="w-full" 
        accept="image/*"
      />
    </div>
  )}

  <button 
    type="submit" 
    className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400"
    disabled={loading}
  >
    {loading ? "Submitting..." : "Submit Question"}
  </button>
</form>
      </div>
    </div>
  );
}

export default CreateQuestionPage;