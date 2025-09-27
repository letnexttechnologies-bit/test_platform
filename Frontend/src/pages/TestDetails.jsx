import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles.css/TestDetails.css";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function TestDetails({ latestTest }) {
  const [mcqCount, setMcqCount] = useState(0);
  const [programCount, setProgramCount] = useState(0);
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch MCQs
        const mcqRes = await fetch(`${BASE_URL}/api/v1/questions/alltasks`);
        const mcqData = await mcqRes.json();
        if (Array.isArray(mcqData.data)) {
          setMcqCount(mcqData.data.length);
          setQuestions(mcqData.data); // keep MCQs for test start
        } else {
          setMcqCount(0);
          setQuestions([]);
        }

        // Fetch Programming Questions
        const progRes = await fetch(`${BASE_URL}/api/v1/programs/all-pro`);
        const progData = await progRes.json();
        if (Array.isArray(progData.data)) {
          setProgramCount(progData.data.length);
        } else {
          setProgramCount(0);
        }
      } catch (error) {
        console.error("Failed to fetch test data:", error);
        setMcqCount(0);
        setProgramCount(0);
        setQuestions([]);
      }
    };

    fetchData();
  }, []);

  // ⏱ Duration calculation
  const totalDuration = Math.ceil(mcqCount * 1.15 + programCount * 30);

  const handleStartTest = () => {
    if (questions.length === 0) {
      alert("No questions available. Please try again later.");
      return;
    }
    navigate("/programming-test", { state: { questions } });
  };

  return (
    <div className="test-details-container">
      <div className="test-details-card">
        <div className="test-details-header">
          <h1>Test Assessment</h1>
          <h3>LetNext Technologies...</h3>
          <p className="description">
            This assessment evaluates your knowledge in full-stack web development.
          </p>
          <div style={{display:"flex", flexDirection:"column", alignItems:"flex-start", marginTop:"10px", color:"red"}}>
          <strong>**Note** 1.Dont switch any new Tab</strong>
           <strong>**Note** 2.Enable permissions to switch on camera and mic.</strong>
           </div>
        </div>

        <div className="section-block">
          <div className="section-title">
            <span className="icon">⏱</span>
            <h2>Test Details</h2>
          </div>
          <div className="details-grid">
            <div className="detail-item">
              <span className="detail-label">Duration:</span>{" "}
              {totalDuration} minutes
            </div>
            <div className="detail-item">
              <span className="detail-label">Questions:</span>{" "}
              {mcqCount} MCQ, {programCount} Programming
            </div>
            <div className="detail-item">
              <span className="detail-label">Passing Score:</span> 70%
            </div>
            <div className="detail-item">
              <span className="detail-label">Allowed Attempts:</span> 1
            </div>
          </div>
        </div>

        <div className="test-details-footer">
          <button className="back-btn" onClick={() => navigate(-1)}>
            ← Back to Tests
          </button>

          {!latestTest && (
            <button className="start-btn" onClick={handleStartTest}>
              Start Test →
            </button>
          )}

          {latestTest && (
            <span className="submitted-note">
              ✅ You have already submitted the test
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
