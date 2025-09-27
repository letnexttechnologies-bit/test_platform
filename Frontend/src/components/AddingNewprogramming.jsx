// AddingNewprogramming.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles.css/AddingNewprogramming.css";

export default function AddingNewprogramming() {
  const navigate = useNavigate();

  const [questionData, setQuestionData] = useState({
    title: "",
    description: "",
    skeletonCode: "",
    testCases: [{ input: "", output: "" }],
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuestionData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleTestCaseChange = (index, e) => {
    const { name, value } = e.target;
    const newTestCases = [...questionData.testCases];
    newTestCases[index][name] = value;
    setQuestionData((prevData) => ({
      ...prevData,
      testCases: newTestCases,
    }));
  };

  const handleAddTestCase = () => {
    setQuestionData((prevData) => ({
      ...prevData,
      testCases: [...prevData.testCases, { input: "", output: "" }],
    }));
  };

  const handleRemoveTestCase = (index) => {
    const newTestCases = questionData.testCases.filter((_, i) => i !== index);
    setQuestionData((prevData) => ({
      ...prevData,
      testCases: newTestCases,
    }));
  };

  // ✅ Updated handleSubmit to POST to backend API
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/v1/programs/add-pro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
       body: JSON.stringify({
  title: questionData.title,
  description: questionData.description,
  skeleton_code: questionData.skeletonCode,
  testcase: questionData.testCases, // send as array directly
}),

      });

      const data = await res.json();

      if (data.success) {
        alert("Programming question added successfully!");
        // Reset form
        setQuestionData({
          title: "",
          description: "",
          skeletonCode: "",
          testCases: [{ input: "", output: "" }],
        });
        navigate("/admin/question-bank"); // optional: go back to question bank
      } else {
        alert("Failed to add question: " + data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-program-container">
      <div className="page-header">
        <h1>Add New Programming Question</h1>
      </div>
      <form onSubmit={handleSubmit} className="program-form">
        <div className="form-group">
          <label htmlFor="title">Question Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={questionData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Problem Description</label>
          <textarea
            id="description"
            name="description"
            rows="6"
            value={questionData.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="skeletonCode">Skeleton Code (Optional)</label>
          <textarea
            id="skeletonCode"
            name="skeletonCode"
            rows="6"
            value={questionData.skeletonCode}
            onChange={handleChange}
            placeholder="e.g., def solution(input):"
          ></textarea>
        </div>

        <h3>Test Cases</h3>
        {questionData.testCases.map((testCase, index) => (
          <div key={index} className="test-case-group">
            <div className="form-group">
              <label htmlFor={`input-${index}`}>Input</label>
              <textarea
                id={`input-${index}`}
                name="input"
                rows="2"
                value={testCase.input}
                onChange={(e) => handleTestCaseChange(index, e)}
                required
              ></textarea>
            </div>
            <div className="form-group">
              <label htmlFor={`output-${index}`}>Expected Output</label>
              <textarea
                id={`output-${index}`}
                name="output"
                rows="2"
                value={testCase.output}
                onChange={(e) => handleTestCaseChange(index, e)}
                required
              ></textarea>
            </div>
            {questionData.testCases.length > 1 && (
              <button
                type="button"
                className="btn-remove-testcase"
                onClick={() => handleRemoveTestCase(index)}
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button type="button" className="btn-add-testcase" onClick={handleAddTestCase}>
          + Add Test Case
        </button>

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Saving..." : "Save Question"}
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate("/admin/question-bank")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
