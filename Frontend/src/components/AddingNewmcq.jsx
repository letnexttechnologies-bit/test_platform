// AddingNewmcq.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles.css/AddingNewmcq.css";

export default function AddingNewmcq() {
  const navigate = useNavigate();

  const [questionData, setQuestionData] = useState({
    questionText: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correctOption: "", // Can be 'A', 'B', 'C', or 'D'
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuestionData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Map front-end option letters to backend field names
    const optionMap = {
      A: "option1",
      B: "option2",
      C: "option3",
      D: "option4",
    };

    const payload = {
      question: questionData.questionText,
      option1: questionData.optionA,
      option2: questionData.optionB,
      option3: questionData.optionC,
      option4: questionData.optionD,
      correctOption: optionMap[questionData.correctOption],
    };

    try {
      const response = await fetch("http://localhost:8000/api/v1/questions/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (result.success) {
        alert("Question added successfully!");
        // Clear the form
        setQuestionData({
          questionText: "",
          optionA: "",
          optionB: "",
          optionC: "",
          optionD: "",
          correctOption: "",
        });
      } else {
        alert("Failed to add question. Try again.");
      }
    } catch (error) {
      console.error("Error adding question:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-mcq-container">
      <div className="page-header">
        <h1>Add New MCQ Question</h1>
      </div>
      <form onSubmit={handleSubmit} className="mcq-form">
        <div className="form-group">
          <label htmlFor="questionText">Question Text</label>
          <textarea
            id="questionText"
            name="questionText"
            rows="4"
            value={questionData.questionText}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <div className="options-container">
          {["A", "B", "C", "D"].map((opt) => (
            <div className="form-group" key={opt}>
              <label htmlFor={`option${opt}`}>Option {opt}</label>
              <input
                type="text"
                id={`option${opt}`}
                name={`option${opt}`}
                value={questionData[`option${opt}`]}
                onChange={handleChange}
                required
              />
            </div>
          ))}
        </div>

        <div className="form-group">
          <label htmlFor="correctOption">Correct Option</label>
          <select
            id="correctOption"
            name="correctOption"
            value={questionData.correctOption}
            onChange={handleChange}
            required
          >
            <option value="">Select correct option</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
          </select>
        </div>

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
