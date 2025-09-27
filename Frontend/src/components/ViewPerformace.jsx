import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles.css/ViewPerformance.css"; // create CSS similar to Results.css

const ViewPerformance = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/api/v1/test/latest-result/${studentId}`,
          { credentials: "include" }
        );
        const data = await res.json();
        console.log(data)

        if (!res.ok || !data.data) {
          setResult(null);
          return;
        }

        setResult(data.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch performance.");
      } finally {
        setLoading(false);
      }
    };

    fetchPerformance();
  }, [studentId]);

  if (loading) return <p>Loading performance...</p>;
  if (error) return <p>{error}</p>;
  if (!result) return <p>No results found for this student.</p>;

  // ✅ Calculations
  const totalQuestions = (result.mcqTotal || 0) + (result.programTotal || 0);

  const totalCorrect =
    (result.mcqCorrect || 0) + (result.programPassed || 0);
  const passPercentage =
    totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;
  const isPassed = passPercentage >= 50;

  return (
    <div className="student-performance">
      <button onClick={() => navigate(-1)}>← Back</button>
      <h2>Performance Summary</h2>

      {/* Summary Cards */}
      <div className="results-summary">
        <div className="summary-card"><strong>Student ID:</strong> {result.studentId}</div>
        <div className="summary-card"><strong>Test ID:</strong> {result._id}</div>
        <div className="summary-card"><strong>MCQ Score:</strong> {result.mcqCorrect} / {result.mcqTotal}</div>
        <div className="summary-card"><strong>Programming Score:</strong> {result.programPassed} / {result.programTotal}</div>
        <div className="summary-card"><strong>Total Score:</strong> {totalCorrect}</div>
        <div className={`summary-card overall-status ${isPassed ? "passed" : "failed"}`}>
          <strong>Result:</strong> {isPassed ? "✅ Passed" : "❌ Failed"}
        </div>
      </div>

      {/* MCQ Details */}
      <h3>MCQ Answers</h3>
      {result.mcqAnswers && Object.keys(result.mcqAnswers).length > 0 ? (
        <ul>
          {Object.entries(result.mcqAnswers).map(([qId, answer], idx) => {
            const passed = result.correctMCQIds?.includes(qId); // ✅ check correct MCQs
            return (
              <li key={qId} className={passed ? "correct" : "wrong"}>
                <strong>MCQ {idx + 1}:</strong> Question ID: {qId} — Your Answer: {answer} — {passed ? "✅ Passed" : "❌ Failed"}
              </li>
            );
          })}
        </ul>
      ) : (
        <p>No MCQs attempted.</p>
      )}

      {/* Programming Details */}
      <h3>Programming Answers</h3>
      {result.programAnswers && Object.keys(result.programAnswers).length > 0 ? (
        <div>
          {Object.entries(result.programAnswers).map(([qId, code], idx) => {
            const testcases = result.programTestcases?.[qId] || [];
            const allPassed = testcases.length > 0 ? testcases.every(tc => tc.passed) : false;

            return (
              <div key={qId} className={`breakdown-card ${allPassed ? "correct" : "wrong"}`}>
                <h4>Programming Question {idx + 1}</h4>
                <p><strong>Question ID:</strong> {qId}</p>
                <pre>{code}</pre>
                <h5>Test Cases:</h5>
                <ul>
                  {testcases.map((tc, tIdx) => (
                    <li key={tIdx}>
                      Input: {tc.input} — Expected: {tc.output} — {tc.passed ? "✅ Passed" : "❌ Failed"}
                    </li>
                  ))}
                </ul>
                <p>Status: {allPassed ? "✅ Passed" : "❌ Failed"}</p>
              </div>
            );
          })}
        </div>
      ) : (
        <p>No programming answers submitted.</p>
      )}
    </div>
  );
};

export default ViewPerformance;
