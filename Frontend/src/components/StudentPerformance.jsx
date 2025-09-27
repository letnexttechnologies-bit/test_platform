// StudentPerformance.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import '../styles.css/StudentPerformances.css';

export default function StudentPerformance() {
  const { id } = useParams();
  
  // Mock data - in a real app, you would fetch this based on the student ID
  const student = {
    name: 'John Doe',
    university: 'Stanford University',
    email: 'john.doe@stanford.edu',
    overallScore: 82,
    multipleChoiceScore: 93,
    programmingScore: 76,
    totalTime: '65 min',
    testName: 'Java Developer Assessment'
  };

  const sectionScores = [
    {
      section: 'Multiple Choice',
      studentScore: 28,
      total: 30,
      percentage: 93,
      average: 65,
      timeSpent: '25 minutes'
    },
    {
      section: 'Programming',
      studentScore: 38,
      total: 50,
      percentage: 76,
      average: 65,
      timeSpent: '40 minutes'
    }
  ];

  return (
    <div className="student-performance">
      <div className="page-header">
        <h1>Student Performance Analysis</h1>
      </div>

      <div className="student-info-card">
        <div className="student-basic-info">
          <div className="student-avatar-large">JD</div>
          <div>
            <h2>{student.name}</h2>
            <p>{student.university}</p>
            <p>{student.email}</p>
          </div>
        </div>

        <div className="performance-stats">
          <div className="stat">
            <h3>Overall Score</h3>
            <div className="stat-value">{student.overallScore}%</div>
          </div>
          <div className="stat">
            <h3>Multiple Choice</h3>
            <div className="stat-value">{student.multipleChoiceScore}%</div>
          </div>
          <div className="stat">
            <h3>Programming</h3>
            <div className="stat-value">{student.programmingScore}%</div>
          </div>
          <div className="stat">
            <h3>Total Time</h3>
            <div className="stat-value">{student.totalTime}</div>
          </div>
        </div>
      </div>

      <div className="test-details">
        <h2>{student.testName}</h2>
        
        <div className="section-scores">
          {sectionScores.map((section, index) => (
            <div key={index} className="section-card">
              <h3>{section.section}</h3>
              <div className="score-comparison">
                <div className="student-score">
                  <span>Student Score: {section.percentage}%</span>
                  <div className="score-bar">
                    <div 
                      className="score-fill" 
                      style={{ width: `${section.percentage}%` }}
                    ></div>
                  </div>
                </div>
                <div className="average-score">
                  <span>Average: {section.average}%</span>
                  <div className="score-bar">
                    <div 
                      className="score-fill average" 
                      style={{ width: `${section.average}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <p>Time spent: {section.timeSpent}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="question-analysis">
        <h2>Question-by-Question Analysis</h2>
        <div className="analysis-tabs">
          <button className="tab-active">Multiple Choice</button>
          <button>Programming</button>
          <button>Time Analysis</button>
        </div>
        
        <div className="analysis-content">
          <p>Detailed question analysis would appear here, showing which questions the student answered correctly or incorrectly, with comparisons to average performance.</p>
        </div>
      </div>
    </div>
  );
}