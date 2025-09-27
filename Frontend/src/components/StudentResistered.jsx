import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles.css/StudentRegistrated.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const StudentResistered = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [collegeQuery, setCollegeQuery] = useState("");
  const navigate = useNavigate();

  // ✅ Fetch all students on mount
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/v1/users/student-count");
        if (!response.ok) throw new Error("Failed to fetch students");
        const data = await response.json();
        const allStudents = data.students || [];
        setStudents(allStudents);
        setFilteredStudents(allStudents);
      } catch (err) {
        console.error("❌ Failed to fetch students", err);
        setError("Failed to load students.");
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  // ✅ Filter by college name
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setCollegeQuery(query);

    const filtered = students.filter((student) =>
      student.collegename.toLowerCase().includes(query)
    );
    setFilteredStudents(filtered);
  };

  // ✅ Navigate to student performance page
  const handleViewPerformance = (student) => {
    const studentId = student._id || student.id;
    if (!studentId) return alert("Invalid student ID");
    navigate(`/admin/viewPerformance/${studentId}`);
  };

  // ✅ Delete single student
  const handleDelete = async (student) => {
    const studentId = student._id || student.id;
    if (!studentId) return alert("Invalid student ID");

    if (!window.confirm(`Are you sure you want to delete ${student.fullname}?`)) return;

    try {
      const res = await fetch(`http://localhost:8000/api/v1/users/students/${studentId}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (res.ok) {
        alert("✅ Student deleted successfully");
        setStudents((prev) => prev.filter((s) => s._id !== studentId));
        setFilteredStudents((prev) => prev.filter((s) => s._id !== studentId));
      } else {
        alert(`❌ Failed to delete: ${data.message}`);
      }
    } catch (err) {
      console.error("❌ Error deleting student:", err);
      alert("Server error while deleting student.");
    }
  };

  // ✅ Delete all students
  const handleDeleteAll = async () => {
    if (!window.confirm("⚠️ Are you sure you want to delete ALL students?")) return;

    try {
      const res = await fetch("http://localhost:8000/api/v1/users/delete-all", {
        method: "DELETE",
      });
      const data = await res.json();

      if (res.ok) {
        alert(`✅ ${data.message}`);
        setStudents([]);
        setFilteredStudents([]);
      } else {
        alert(`❌ Failed to delete all: ${data.message}`);
      }
    } catch (err) {
      console.error("❌ Error deleting all students:", err);
      alert("Server error while deleting all students.");
    }
  };

  // ✅ Export all students data as PDF
  const handleExportPDF = () => {
    if (students.length === 0) return alert("No student data to export");

    const doc = new jsPDF();
    doc.text("All Students Data", 20, 20);

    autoTable(doc, {
      head: [["Reg No", "Full Name", "Department", "College Name"]],
      body: students.map((s) => [s.registerNo, s.fullname, s.department, s.collegename]),
      startY: 30,
    });

    doc.save("students_data.pdf");
  };

  if (loading) return <p>Loading students...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="results-table">
      <div className="center-container">
        <label>Search College:</label>
        <input
          type="text"
          className="center-input"
          placeholder="Enter college name..."
          value={collegeQuery}
          onChange={handleSearch}
        />

        <button className="btn-export" onClick={handleExportPDF}>
          📄 Export All Students
        </button>

        <button className="btn-delete-all" onClick={handleDeleteAll}>
          🗑️ Delete All Students
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Sl.no</th>
            <th>Reg No</th>
            <th>Full Name</th>
            <th>Department</th>
            <th>College Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.length > 0 ? (
            filteredStudents.map((student, index) => (
              <tr key={student._id || student.id || index}>
                <td>{index + 1}</td>
                <td>{student.registerNo}</td>
                <td>{student.fullname}</td>
                <td>{student.department}</td>
                <td>{student.collegename}</td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-view" onClick={() => handleViewPerformance(student)}>
                      View Performance
                    </button>
                    <button className="btn-view" onClick={() => handleDelete(student)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                No students found for this college
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StudentResistered;
