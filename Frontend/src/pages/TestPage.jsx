import React, { useState, useEffect } from "react";
import "../styles.css/TestPage.css"; // Create this CSS file

const questions = [
  {
    id: 1,
    text: "Question 1: What is a key feature of React?",
    options: ["MVC Architecture", "Virtual DOM", "Two-way data binding", "jQuery dependency"],
    // language: "React/JavaScript"
  },
  {
    id: 2,
    text: "Question 2: What does the 'git clone' command do?",
    options: ["Clones a project on your local machine", "Pushes changes to a remote repository", "Creates a new branch", "Merges two branches"],
    // language: "Git"
  },
  {
    id: 3,
    text: "Question 3: In Python, what is the purpose of 'pip'?",
    options: ["A web framework", "A package installer", "A command-line tool for file management", "A built-in data structure"],
    // language: "Python"
  },
  {
    id: 4,
    text: "Question 4: What is the primary function of CSS?",
    options: ["Defining page structure", "Managing server-side logic", "Styling a web page", "Handling user authentication"],
    // language: "CSS"
  },
  {
    id: 5,
    text: "Question 5: What is a promise in JavaScript?",
    options: ["A data type for strings", "An object representing the completion of an asynchronous operation", "A type of loop", "A way to declare variables"],
    // language: "JavaScript"
  },
  {
    id: 6,
    text: "Question 6: What is a primary key in a database?",
    options: ["A foreign key", "A column that uniquely identifies each row", "A way to join tables", "A type of database index"],
    // language: "SQL"
  },
  {
    id: 7,
    text: "Question 7: What does the term API stand for?",
    options: ["Application Programming Interface", "Advanced Personal Identifier", "Automated Program Integration", "Asynchronous Program Interface"],
    // language: "General"
  },
  {
    id: 8,
    text: "Question 8: What is the correct syntax to create a function in PHP?",
    options: ["def myFunc()", "function myFunc()", "create function myFunc()", "func myFunc()"],
    // language: "PHP"
  },
  {
    id: 9,
    text: "Question 9: What is the purpose of a 'while' loop?",
    options: ["To iterate over an array", "To execute code a specific number of times", "To execute code as long as a condition is true", "To handle exceptions"],
    // language: "General"
  },
  {
    id: 10,
    text: "Question 10: Which is a benefit of using a NoSQL database?",
    options: ["Strict schema enforcement", "High scalability and flexibility", "Complex query support", "Atomicity, Consistency, Isolation, Durability (ACID) compliance"],
    // language: "Databases"
  }
];

export default function TestPage() {
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes in seconds
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Timer logic
  useEffect(() => {
    if (timeLeft === 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="test-page-container">
      <div className="header">
        <div className="logo-section">
          <p className="logo">TalentTest</p>
          <p className="test-name">Software Engineering Aptitude</p>
        </div>
        <div className="user-section">
          <p>John Smith</p>
          <p>⏳ {formatTime(timeLeft)}</p>
        </div>
      </div>

      <div className="question-box">
        <div className="question-header">
          <h3>Question {currentQuestion.id} of {questions.length}</h3>
          <span className="language-tag">{currentQuestion.language}</span>
        </div>
        <p className="question-text">{currentQuestion.text}</p>
        <div className="options">
          {currentQuestion.options.map((option, index) => (
            <div key={index} className="option">
              <input type="radio" id={`option-${index}`} name="answer" />
              <label htmlFor={`option-${index}`}>{option}</label>
            </div>
          ))}
        </div>
      </div>
      
      <div className="navigation-buttons">
        <button onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
          Previous
        </button>
        <button onClick={handleNext} disabled={currentQuestionIndex === questions.length - 1}>
          Next
        </button>
      </div>
    </div>
  );
}