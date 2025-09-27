// ProgrammingTest.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as faceapi from "face-api.js"; // ✅ Face detection
import "../styles.css/ProgrammingTest.css";

export default function ProgrammingTest({ currentUser, setLatestTest }) {
  const location = useLocation();
  const navigate = useNavigate();

  const [mcqQuestions, setMcqQuestions] = useState([]);
  const [selectedMCQ, setSelectedMCQ] = useState({});
  const [lockedMCQ, setLockedMCQ] = useState({});
  const [activeMCQ, setActiveMCQ] = useState(0);

  const [programQuestions, setProgramQuestions] = useState([]);
  const [activeProgram, setActiveProgram] = useState(0);
  const [studentCode, setStudentCode] = useState({});
  const [programOutputs, setProgramOutputs] = useState({});
  const [stage, setStage] = useState("mcq");
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState("python3");

  // ✅ Timer
  const [timer, setTimer] = useState(0);

  // ✅ Camera + Face Detection
  const [cameraStream, setCameraStream] = useState(null);
  const [faceDetected, setFaceDetected] = useState(true);

  const [loadingMcqs, setLoadingMcqs] = useState(true);
  const [loadingPrograms, setLoadingPrograms] = useState(false);

  // ✅ Load or Reset MCQ state when user changes
  useEffect(() => {
    if (currentUser) {
      // 🚀 FIX: Clear old answers for a fresh login
      sessionStorage.removeItem(`${currentUser.id}_selectedMCQ`);
      sessionStorage.removeItem(`${currentUser.id}_lockedMCQ`);

      setSelectedMCQ({});
      setLockedMCQ({});
      setStudentCode({});
      setProgramOutputs({});
      setActiveMCQ(0);
      setActiveProgram(0);
      setStage("mcq");
    }
  }, [currentUser]);

  // Load MCQs
  useEffect(() => {
    const loadMcqs = async () => {
      try {
        if (Array.isArray(location.state?.questions)) {
          setMcqQuestions(location.state.questions);
        } else {
          const res = await fetch("http://localhost:8000/api/v1/questions/alltasks");
          const data = await res.json();
          if (data.success && Array.isArray(data.data)) setMcqQuestions(data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingMcqs(false);
      }
    };
    loadMcqs();
  }, [location.state]);

  // ✅ Persist MCQ state per user
  useEffect(() => {
    if (currentUser) {
      sessionStorage.setItem(`${currentUser.id}_selectedMCQ`, JSON.stringify(selectedMCQ));
    }
  }, [selectedMCQ, currentUser]);

  useEffect(() => {
    if (currentUser) {
      sessionStorage.setItem(`${currentUser.id}_lockedMCQ`, JSON.stringify(lockedMCQ));
    }
  }, [lockedMCQ, currentUser]);

  // ✅ Dynamic Timer (MCQ + Program)
  useEffect(() => {
    const mcqTime = mcqQuestions.length * 69; // ~1.15 mins per MCQ
    const programTime = programQuestions.length * 1800; // 30 mins per program
    setTimer(mcqTime + programTime);
  }, [mcqQuestions, programQuestions]);

  // ✅ Countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          handleSubmitTest(true);
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (s) =>
    `${Math.floor(s / 60)}:${s % 60 < 10 ? "0" : ""}${s % 60}`;

  // ✅ Camera Setup + Face Detection
  useEffect(() => {
    const startCamera = async () => {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri("/models");

        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setCameraStream(stream);

        const video = document.getElementById("cameraFeed");
        if (video) {
          video.srcObject = stream;
          video.onloadedmetadata = () => video.play();
        }
      } catch (err) {
        console.error("Camera error:", err);
        alert("⚠️ Camera access is required to start the test. Please allow camera permissions.");
        navigate(-1);
      }
    };

    startCamera();

    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // ✅ Continuous face detection
  // ✅ Continuous face detection (No repeated alerts)
useEffect(() => {
  const video = document.getElementById("cameraFeed");
  if (!video) return;

  const interval = setInterval(async () => {
    if (video.readyState === 4) {
      const detections = await faceapi.detectAllFaces(
        video,
        new faceapi.TinyFaceDetectorOptions()
      );

      if (detections.length === 0) {
        // ❌ No face
        if (faceDetected) {
          alert("⚠️ Face not detected! Please ensure your face is visible to the camera.");
          setFaceDetected(false);
        }
      } else if (detections.length > 1) {
        // ❌ Multiple faces
        if (faceDetected) {
          alert("⚠️ Multiple faces detected! Only the student should be visible.");
          setFaceDetected(false);
        }
      } else {
        // ✅ Exactly one face
        if (!faceDetected) {
          setFaceDetected(true); // reset state only when detection returns
        }
      }
    }
  }, 1000); // check every 15 sec

  return () => clearInterval(interval);
}, [faceDetected]);


  // 🚫 Prevent refresh/exit
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  // --- MCQ Handlers ---
  const handleMCQOptionChange = (option) => {
    if (lockedMCQ[mcqQuestions[activeMCQ]?._id]) return;
    setSelectedMCQ({
      ...selectedMCQ,
      [mcqQuestions[activeMCQ]?._id]: option,
    });
  };

  const handleLockMCQ = () => {
    const id = mcqQuestions[activeMCQ]?._id;
    if (!id || !selectedMCQ[id]) {
      alert("Select an option before locking!");
      return;
    }
    setLockedMCQ((prev) => ({ ...prev, [id]: true }));
    if (activeMCQ < mcqQuestions.length - 1) setActiveMCQ(activeMCQ + 1);
  };

  const handleNextMCQ = () =>
    activeMCQ < mcqQuestions.length - 1 && setActiveMCQ(activeMCQ + 1);
  const handlePrevMCQ = () =>
    activeMCQ > 0 && setActiveMCQ(activeMCQ - 1);

  // --- Programming Handlers ---
  const fetchPrograms = async () => {
    setLoadingPrograms(true);
    try {
      const res = await fetch("http://localhost:8000/api/v1/programs/all-pro");
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setProgramQuestions(data.data);
        const initialCode = {};
        data.data.forEach((q) => {
          initialCode[q._id] = q.skeleton_code || "";
        });
        setStudentCode(initialCode);
        setStage("program");
      } else alert("Failed to load programming questions");
    } catch (err) {
      console.error(err);
      alert("Error fetching programming questions");
    } finally {
      setLoadingPrograms(false);
    }
  };

  const handleCodeChange = (id, code) =>
    setStudentCode({ ...studentCode, [id]: code });

  const handleNextProgram = () =>
    activeProgram < programQuestions.length - 1 &&
    setActiveProgram(activeProgram + 1);

  const handlePrevProgram = () =>
    activeProgram > 0 && setActiveProgram(activeProgram - 1);

  const handleBackToMCQ = () => setStage("mcq");

  // --- Run Code ---
  const runCode = async () => {
    const currentProgram = programQuestions[activeProgram];
    if (!currentProgram) return;

    let code = studentCode[currentProgram._id] || "";
    const selectedLang = language.toLowerCase();
    if (selectedLang === "python3" && /def\s+solution\s*\(/.test(code))
      code += "\nsolution()";

    const testCases = Array.isArray(currentProgram.testcase)
      ? currentProgram.testcase
      : [];

    setOutput("Running...");
    let resultsText = "";
    let structuredResults = [];

    for (let i = 0; i < testCases.length; i++) {
      const input = testCases[i]?.input || "";
      const expected = testCases[i]?.output || "";
      try {
        const res = await fetch("http://localhost:8000/api/v1/execute", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code, language: selectedLang, stdin: input }),
        });
        const data = await res.json();
        const out = data.success ? data.output.trim() : `Error - ${data.error}`;
        const passed = out === expected.trim();

        resultsText += `Test Case ${i + 1}:\nInput: ${input}\nOutput: ${out}\nExpected: ${expected}\nResult: ${
          passed ? "✅ Passed" : "❌ Failed"
        }\n\n`;

        structuredResults.push({ input, expected, output: out, passed });
      } catch (err) {
        resultsText += `Test Case ${i + 1}: Error - ${err.message}\n\n`;
        structuredResults.push({ input, expected, output: `Error - ${err.message}`, passed: false });
      }
    }

    setOutput(resultsText);
    setProgramOutputs((prev) => ({
      ...prev,
      [currentProgram._id]: structuredResults,
    }));
  };

  // --- Submit Test ---
  const handleSubmitTest = async (auto = false) => {
    const allMCQsAnswered = mcqQuestions.every((q) => lockedMCQ[q._id]);
    const allProgramsAnswered = programQuestions.every(
      (q) => studentCode[q._id]?.trim()?.length > 0
    );

    if (!allMCQsAnswered || !allProgramsAnswered) {
      if (!auto) alert("Please attend all the questions before submitting!");
      return;
    }

    if (!auto && !window.confirm("Are you sure you want to submit the test?"))
      return;

    try {
      await runCode();

      const res = await fetch("http://localhost:8000/api/v1/test/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          mcqQuestions,
          studentId: currentUser?._id, 
          mcqAnswers: selectedMCQ,
          mcqLocked: lockedMCQ,
          programAnswers: studentCode,
          programTestcases: programOutputs,
          remainingTime: timer,
          autoSubmit: auto,
        }),
      });

      const data = await res.json();
      if (data?.success) {
        alert(auto ? "Time's up! Test auto-submitted." : "Test submitted successfully!");
        setLatestTest(data.data || data);
        navigate(`/results/${data.data._id}`, { state: { test: data.data } });
      } else alert("Failed to submit test.");
    } catch (err) {
      console.error(err);
      alert("Error submitting test.");
    }
  };

  return (
    <div className="programming-test-container">
      {/* ✅ Top bar with timer + camera */}
      <div className="top-bar">
        <div className="title"><h1>Full Stack Developer Test</h1></div>
        <div className="right-section">
          <div className="timer">⏱ {formatTime(timer)} remaining</div>
          <div className="camera-box">
            <video
              id="cameraFeed"
              autoPlay
              playsInline
              muted
              width="200"
              height="150"
            ></video>
            {/* {!faceDetected && (
              <div className="warning">⚠️ Face not detected! Test paused.</div>
            )} */}
          </div>
        </div>
      </div>

      {/* Test main area */}
      <div className="test-main">
        <aside className="question-sidebar">
          <div className="question-group">
            <h3>{stage === "mcq" ? "MCQs" : "Programming"}</h3>
            <div className="question-grid">
              {(stage === "mcq" ? mcqQuestions : programQuestions).map((q, idx) => (
                <button
                  key={q._id}
                  className={`question-btn ${
                    stage === "mcq"
                      ? idx === activeMCQ
                        ? "current"
                        : selectedMCQ[q._id]
                        ? "answered"
                        : "unanswered"
                      : idx === activeProgram
                      ? "current"
                      : studentCode[q._id]
                      ? "answered"
                      : "unanswered"
                  }`}
                  onClick={() =>
                    stage === "mcq" ? setActiveMCQ(idx) : setActiveProgram(idx)
                  }
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Question Area */}
        <div className="question-area">
          {/* --- MCQ Stage --- */}
          {stage === "mcq" && mcqQuestions.length > 0 && (
            <>
              <h2>
                MCQ {activeMCQ + 1} / {mcqQuestions.length}
              </h2>
              <p>{mcqQuestions[activeMCQ].question}</p>
              <div className="mcq-options">
                {[
                  mcqQuestions[activeMCQ].option1,
                  mcqQuestions[activeMCQ].option2,
                  mcqQuestions[activeMCQ].option3,
                  mcqQuestions[activeMCQ].option4,
                ].map((opt, idx) => (
                  <label key={idx} className="option-item">
                    <input
                      type="radio"
                      name={`mcq-${mcqQuestions[activeMCQ]._id}`}
                      checked={
                        selectedMCQ[mcqQuestions[activeMCQ]._id] ===
                        `option${idx + 1}`
                      }
                      onChange={() =>
                        handleMCQOptionChange(`option${idx + 1}`)
                      }
                      disabled={lockedMCQ[mcqQuestions[activeMCQ]._id]}
                    />
                    {opt}
                  </label>
                ))}
              </div>
              <div className="test-footer">
                <button onClick={handlePrevMCQ} disabled={activeMCQ === 0}>
                  ← Previous
                </button>
                {activeMCQ < mcqQuestions.length - 1 ? (
                  <button onClick={handleNextMCQ}>Next →</button>
                ) : (
                  <button onClick={fetchPrograms} disabled={loadingPrograms}>
                    {loadingPrograms ? "Loading Programs..." : "Move to Programming →"}
                  </button>
                )}
                {!lockedMCQ[mcqQuestions[activeMCQ]?._id] && (
                  <button onClick={handleLockMCQ} className="lock-btn">
                    🔒 Lock Answer
                  </button>
                )}
              </div>
            </>
          )}

          {/* --- Programming Stage --- */}
          {stage === "program" &&
            programQuestions.length > 0 &&
            (() => {
              const currentProgram = programQuestions[activeProgram];
              if (!currentProgram) return null;
              return (
                <>
                  <h2>
                    Programming {activeProgram + 1} / {programQuestions.length}
                  </h2>
                  <p><strong>{currentProgram.title}</strong></p>
                  <p>{currentProgram.description || "No description"}</p>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                  >
                    <option value="python3">Python 3</option>
                    <option value="c">C</option>
                    <option value="cpp">C++</option>
                    <option value="java">Java</option>
                  </select>
                  <textarea
                    rows={12}
                    value={studentCode[currentProgram._id] || ""}
                    onChange={(e) =>
                      handleCodeChange(currentProgram._id, e.target.value)
                    }
                    placeholder="Write your code here..."
                  />
                  <div className="console-output">
                    <strong>Output:</strong>
                    <pre>{output}</pre>
                  </div>
                  <div className="test-footer">
                    <button onClick={handlePrevProgram} disabled={activeProgram === 0}>
                      ← Previous
                    </button>
                    <button
                      onClick={handleNextProgram}
                      disabled={activeProgram === programQuestions.length - 1}
                    >
                      Next →
                    </button>
                    <button onClick={handleBackToMCQ}>← Back to MCQs</button>
                    <button onClick={runCode} className="run-btn">Run Code</button>
                    <button
                      className="submit-btn"
                      onClick={() => handleSubmitTest(false)}
                    >
                      ✓ Submit Test
                    </button>
                  </div>
                </>
              );
            })()}
        </div>
      </div>
    </div>
  );
}
