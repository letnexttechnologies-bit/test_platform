import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "../styles.css/Sidebar.css"; // Assuming this is your stylesheet

export default function AvailableTests() {
  const navigate = useNavigate();
  const tests = [
    { title: "Software Engineering Aptitude", duration: "60 minutes" },
    { title: "Logical Reasoning Assessment", duration: "45 minutes" },
    { title: "Technical Knowledge Evaluation", duration: "90 minutes" },
  ];

  const handleStartTest = () => {
    // Navigate to the new test page
    navigate("/test-page");
  };

  return (
    <div className="available-tests">
      <h2 className="page-title">Available Tests</h2>

      <div className="test-grid">
        {tests.map((test, index) => (
          <div className="test-card" key={index}>
            <h3>{test.title}</h3>
            <p>⏳ Duration: {test.duration}</p>
            {/* Add an onClick handler to the button */}
            <button className="start-btn" onClick={handleStartTest}>Start Test</button>
          </div>
        ))}
      </div>
    </div>
  );
}