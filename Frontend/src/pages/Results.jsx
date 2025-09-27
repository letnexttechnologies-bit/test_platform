// Results.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import "../styles.css/Results.css";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function Results() {
  const location = useLocation();
  const { testId } = useParams();
  const passedTest = location.state?.test;

  const [loading, setLoading] = useState(!passedTest);
  const [error, setError] = useState("");
  const [results, setResults] = useState(passedTest || null);

  useEffect(() => {
    // Only fetch if results not already set
    if (results) return;

    const fetchResults = async () => {
      try {
        setLoading(true);

        // Check sessionStorage for already submitted result
        const stored = sessionStorage.getItem(`submittedTest-${testId}`);
        if (stored) {
          setResults(JSON.parse(stored));
          setLoading(false);
          return;
        }

        // If no result in sessionStorage and student hasn't submitted yet
        const res = await fetch(`${BASE_URL}/api/v1/test/${testId}`);
        if (!res.ok) throw new Error("Failed to fetch results");

        const data = await res.json();

        if (data?.data) {
          setResults(data.data);
          sessionStorage.setItem(`submittedTest-${testId}`, JSON.stringify(data.data));
        } else {
          setResults(null); // No submission yet
        }

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [testId, results]);

  if (loading) return <p>Loading results...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!results) return <p>No results found.</p>; 

  const {
    mcqTotal = 0,
    mcqAnswered = 0,
    mcqCorrect = 0,
    mcqWrong = 0,
    programTotal = 0,
    programAnswered = 0,
    programAnswers = {},
    programTestcases = {},
    mcqAnswers = {},
    correctMcqAnswers = {},
    timeTaken = 0,
    totalTime = 0,
  } = results;

  const remainingTime = totalTime > 0 ? Math.max(totalTime - timeTaken, 0) : 0;
  const formatTime = (s) => `${Math.floor(s / 60)}m ${s % 60}s`;

  let programPassed = 0;
  Object.entries(programAnswers).forEach(([qId, code]) => {
    const testcases = programTestcases[qId] || [];
    const allPassed = testcases.length > 0 && testcases.every(tc => tc.passed);
    if (allPassed) programPassed++;
  });

  const totalQuestions = mcqTotal + programTotal;
  const totalCorrect = mcqCorrect + programPassed;
  const passPercentage = totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;
  const isPassed = passPercentage >= 50;

  return (
    <div className="results-page-container">
      <div className="results-header">
        <h1>Test Results</h1>
        <p>Summary of your performance</p>
      </div>

      <div className="results-summary">
        <div className="summary-card"><strong>Total MCQs:</strong> {mcqTotal}</div>
        <div className="summary-card"><strong>Answered:</strong> {mcqAnswered}</div>
        <div className="summary-card"><strong>Correct:</strong> {mcqCorrect}</div>
        <div className="summary-card"><strong>Wrong:</strong> {mcqWrong}</div>

        <div className="summary-card"><strong>Total Programs:</strong> {programTotal}</div>
        <div className="summary-card"><strong>Attempted:</strong> {programAnswered}</div>
        <div className="summary-card"><strong>Passed:</strong> {programPassed}</div>
        <div className="summary-card"><strong>Time Taken:</strong> {formatTime(timeTaken)}</div>
        <div className="summary-card"><strong>Remaining Time:</strong> {formatTime(remainingTime)}</div>

        <div className={`summary-card overall-status ${isPassed ? "passed" : "failed"}`}>
          <strong>Result:</strong> {isPassed ? "✅ Passed" : "❌ Failed"}
        </div>
      </div>

      <div className="results-details">
        <h3>MCQ Answers</h3>
        {mcqAnswered > 0 ? (
          <div className="breakdown-grid">
            {Object.entries(mcqAnswers).map(([qId, answer], idx) => {
              const correct = correctMcqAnswers[qId];
              const isCorrect = answer === correct;
              return (
                <div key={qId} className={`breakdown-card ${isCorrect ? "correct" : "wrong"}`}>
                  <h4>MCQ {idx + 1}</h4>
                  <p><strong>Your Answer:</strong> {answer}</p>
                </div>
              );
            })}
          </div>
        ) : <p>No MCQs attempted.</p>}

        <h3>Programming Answers & Outputs</h3>
        {programTotal > 0 ? (
          <div className="breakdown-grid">
            {Object.entries(programAnswers).map(([qId, code], idx) => {
              const testcases = programTestcases[qId] || [];
              const allPassed = testcases.length > 0 && testcases.every(tc => tc.passed);
              return (
                <div key={qId} className={`breakdown-card ${allPassed ? "correct" : "wrong"}`}>
                  <h4>Programming Question {idx + 1}</h4>
                  <p><strong>Code:</strong></p>
                  <pre>{code}</pre>
                  <p><strong>Test Results:</strong></p>
                  <pre>
                    {testcases.length > 0
                      ? testcases.map((tc, tIdx) => (
                          `Test Case ${tIdx + 1}:\nInput: ${tc.input}\nOutput: ${tc.output}\nExpected: ${tc.expected}\nResult: ${tc.passed ? "✅ Passed" : "❌ Failed"}\n\n`
                        ))
                      : "Not run"}
                  </pre>
                  <p>Status: {allPassed ? "✅ Passed" : "❌ Failed"}</p>
                </div>
              );
            })}
          </div>
        ) : <p>No programming questions attempted.</p>}
      </div>
    </div>
  );
}
