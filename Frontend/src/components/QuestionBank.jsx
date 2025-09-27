import React, { useEffect, useState } from "react";
import "../styles.css/QuestionBank.css";

export default function QuestionBank() {
  const [activeTab, setActiveTab] = useState("mcq");
  const [loading, setLoading] = useState(false);

  const [mcqQuestions, setMcqQuestions] = useState([]);
  const [programQuestions, setProgramQuestions] = useState([]);

  // --- MCQ Editing ---
  const [editingMCQ, setEditingMCQ] = useState(null);
  const [mcqForm, setMcqForm] = useState({
    questionText: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correctOption: "",
  });

  // --- Program Editing ---
  const [editingProgram, setEditingProgram] = useState(null);
  const [programForm, setProgramForm] = useState({
    title: "",
    description: "",
    skeletonCode: "",
    testCases: [{ input: "", output: "" }],
  });

  // Fetch Questions
  const fetchAllQuestions = async () => {
    setLoading(true);
    try {
      const [mcqRes, programRes] = await Promise.all([
        fetch("http://localhost:8000/api/v1/questions/alltasks"),
        fetch("http://localhost:8000/api/v1/programs/all-pro"),
      ]);
      const mcqData = await mcqRes.json();
    
      const programData = await programRes.json();

      
      if (mcqData.success) setMcqQuestions(mcqData.data);
      if (programData.success) setProgramQuestions(programData.data);
    } catch (err) {
      console.error(err);
      alert("Error fetching questions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllQuestions();
  }, []);

  // --- MCQ Handlers ---
  const handleMCQChange = (e) => {
    const { name, value } = e.target;
    setMcqForm((prev) => ({ ...prev, [name]: value }));
  };

  const editMCQ = (q) => {
    setEditingMCQ(q._id);
    setMcqForm({
      questionText: q.question,
      optionA: q.option1,
      optionB: q.option2,
      optionC: q.option3,
      optionD: q.option4,
      correctOption: q.correctOption.replace("option", "").toUpperCase(),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelMCQEdit = () => {
    setEditingMCQ(null);
    setMcqForm({
      questionText: "",
      optionA: "",
      optionB: "",
      optionC: "",
      optionD: "",
      correctOption: "",
    });
  };

  const updateMCQ = async (e) => {
    e.preventDefault();
    if (!editingMCQ) return;
    const optionMap = { A: "option1", B: "option2", C: "option3", D: "option4" };
    const payload = {
      question: mcqForm.questionText,
      option1: mcqForm.optionA,
      option2: mcqForm.optionB,
      option3: mcqForm.optionC,
      option4: mcqForm.optionD,
      correctOption: optionMap[mcqForm.correctOption],
    };
    try {
      const res = await fetch(`http://localhost:8000/api/v1/questions/edit/${editingMCQ}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        alert("MCQ updated successfully!");
        cancelMCQEdit();
        fetchAllQuestions();
      } else alert("Failed to update MCQ");
    } catch (err) {
      console.error(err);
    }
  };

  const deleteMCQ = async (id) => {
    if (!window.confirm("Delete this MCQ?")) return;
    try {
      const res = await fetch(`http://localhost:8000/api/v1/questions/delete/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) fetchAllQuestions();
    } catch (err) {
      console.error(err);
    }
  };

  // --- Programming Handlers ---
  const handleProgramChange = (e) => {
    const { name, value } = e.target;
    setProgramForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleTestCaseChange = (idx, e) => {
    const { name, value } = e.target;
    const updated = [...programForm.testCases];
    updated[idx][name] = value;
    setProgramForm((prev) => ({ ...prev, testCases: updated }));
  };

  const addTestCase = () => {
    setProgramForm((prev) => ({ ...prev, testCases: [...prev.testCases, { input: "", output: "" }] }));
  };

  const removeTestCase = (idx) => {
    setProgramForm((prev) => ({ ...prev, testCases: prev.testCases.filter((_, i) => i !== idx) }));
  };

  const editProgram = (p) => {
    setEditingProgram(p._id);
    setProgramForm({
      title: p.title,
      description: p.description,
      skeletonCode: p.skeleton_code,
      testCases: p.testcase, // ✅ already array, no JSON.parse
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelProgramEdit = () => {
    setEditingProgram(null);
    setProgramForm({ title: "", description: "", skeletonCode: "", testCases: [{ input: "", output: "" }] });
  };

  const updateProgram = async (e) => {
    e.preventDefault();
    if (!editingProgram) return;

    // Validate test cases: remove empty ones
    const validTestCases = programForm.testCases.filter(
      (tc) => tc.input.trim() !== "" && tc.output.trim() !== ""
    );

    try {
      const payload = {
        title: programForm.title,
        description: programForm.description,
        skeleton_code: programForm.skeletonCode,
        testcase: validTestCases, // ✅ save as array, not string
      };

      const res = await fetch(`http://localhost:8000/api/v1/programs/edit-pro/${editingProgram}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        alert("Programming question updated!");
        cancelProgramEdit();
        fetchAllQuestions(); // refresh data
      } else {
        alert(data.message || "Failed to update programming question");
        console.error(data);
      }
    } catch (err) {
      console.error("Update Program Error:", err);
      alert("Error updating programming question");
    }
  };

  const deleteProgram = async (id) => {
    if (!window.confirm("Delete this Programming question?")) return;
    try {
      const res = await fetch(`http://localhost:8000/api/v1/programs/delete-pro/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) fetchAllQuestions();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="question-bank">
      <h1>Question Bank</h1>

      <div className="switch-buttons">
        <button className={activeTab === "mcq" ? "active" : ""} onClick={() => setActiveTab("mcq")}>
          MCQ
        </button>
        <button className={activeTab === "program" ? "active" : ""} onClick={() => setActiveTab("program")}>
          Programming
        </button>
      </div>

      {loading && <p className="loading-text">Loading questions...</p>}

      {/* === MCQ Section === */}
      {activeTab === "mcq" && (
        <>
          <div className="top-buttons">
            <button className="btn-primary" onClick={() => (window.location.href = "/admin/add-mcq")}>
              + Add MCQ
            </button>
          </div>

          {editingMCQ && (
            <form className="edit-form" onSubmit={updateMCQ}>
              <h2>Edit MCQ</h2>
              <textarea
                name="questionText"
                value={mcqForm.questionText}
                onChange={handleMCQChange}
                rows={3}
                required
              />
              {["A", "B", "C", "D"].map((opt) => (
                <input
                  key={opt}
                  type="text"
                  name={`option${opt}`}
                  value={mcqForm[`option${opt}`]}
                  onChange={handleMCQChange}
                  placeholder={`Option ${opt}`}
                  required
                />
              ))}
              <select name="correctOption" value={mcqForm.correctOption} onChange={handleMCQChange} required>
                <option value="">Select correct option</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
              </select>
              <div className="form-actions">
                <button type="submit" className="btn-primary">
                  Update MCQ
                </button>
                <button type="button" className="btn-secondary" onClick={cancelMCQEdit}>
                  Cancel
                </button>
              </div>
            </form>
          )}

          <table className="questions-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Question</th>
                <th>Options</th>
                <th>Correct</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {mcqQuestions.map((q, idx) => (
                <tr key={q._id}>
                  <td>{idx + 1}</td>
                  <td>{q.question}</td>
                  <td>
                    <strong>A:</strong> {q.option1}
                    <br />
                    <strong>B:</strong> {q.option2}
                    <br />
                    <strong>C:</strong> {q.option3}
                    <br />
                    <strong>D:</strong> {q.option4}
                  </td>
                  <td>{q.correctOption.replace("option", "").toUpperCase()}</td>
                  <td>
                    <button className="btn-edit" onClick={() => editMCQ(q)}>
                      Edit
                    </button>
                    <button className="btn-delete" onClick={() => deleteMCQ(q._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* === Programming Section === */}
      {activeTab === "program" && (
        <>
          <div className="top-buttons">
            <button className="btn-primary" onClick={() => (window.location.href = "/admin/add-program")}>
              + Add Programming
            </button>
          </div>

          {editingProgram && (
            <form className="edit-form" onSubmit={updateProgram}>
              <h2>Edit Programming</h2>
              <input
                type="text"
                name="title"
                value={programForm.title}
                onChange={handleProgramChange}
                placeholder="Title"
                required
              />
              <textarea
                name="description"
                value={programForm.description}
                onChange={handleProgramChange}
                rows={4}
                placeholder="Description"
                required
              />
              <textarea
                name="skeletonCode"
                value={programForm.skeletonCode}
                onChange={handleProgramChange}
                rows={4}
                placeholder="Skeleton Code"
              />

              <h3>Test Cases</h3>
              {programForm.testCases.map((tc, idx) => (
                <div key={idx} className="test-case-group">
                  <textarea
                    name="input"
                    value={tc.input}
                    onChange={(e) => handleTestCaseChange(idx, e)}
                    placeholder="Input"
                    required
                  />
                  <textarea
                    name="output"
                    value={tc.output}
                    onChange={(e) => handleTestCaseChange(idx, e)}
                    placeholder="Output"
                    required
                  />
                  {programForm.testCases.length > 1 && (
                    <button
                      type="button"
                      className="btn-remove-testcase"
                      onClick={() => removeTestCase(idx)}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}

              <button type="button" className="btn-add-testcase" onClick={addTestCase}>
                + Add Test Case
              </button>
              <div className="form-actions">
                <button type="submit" className="btn-primary">
                  Update Programming
                </button>
                <button type="button" className="btn-secondary" onClick={cancelProgramEdit}>
                  Cancel
                </button>
              </div>
            </form>
          )}

          <table className="questions-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Description</th>
                <th>Skeleton Code</th>
                <th>Test Cases</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {programQuestions.map((p, idx) => (
                <tr key={p._id}>
                  <td>{idx + 1}</td>
                  <td>{p.title}</td>
                  <td>{p.description}</td>
                  <td>
                    <pre>{p.skeleton_code}</pre>
                  </td>
                  <td>
                    {p.testcase.map((t, i) => (
                      <div key={i}>
                        <strong>Input:</strong> {t.input}
                        <br />
                        <strong>Output:</strong> {t.output}
                      </div>
                    ))}
                  </td>
                  <td>
                    <button className="btn-edit" onClick={() => editProgram(p)}>
                      Edit
                    </button>
                    <button className="btn-delete" onClick={() => deleteProgram(p._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
