import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles.css/Dashboard.css";

export default function Dashboard() {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if page has already reloaded in this session
    if (!sessionStorage.getItem("dashboardReloaded")) {
      sessionStorage.setItem("dashboardReloaded", "true");
      window.location.reload();
      return;
    }

    const fetchStudent = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/v1/users/student-dashboard", {
          credentials: "include", 
        });

        if (res.ok) {
          const data = await res.json();
          setStudent(data.student);
        } else {
          navigate("/"); 
        }
      } catch (error) {
        console.error(error);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [navigate]);

  
  if (loading) return <p>Loading...</p>;

  return (
    <div className="dashboard">
      <div className="welcome">
        <div>
          <h2>Welcome back, {student?.fullname}!</h2>
          <p>Reg No: {student?.registerNo}</p>
        </div>
      </div>

      <div className="grid">
        <div className="card">
          <h3>Upcoming Tests</h3>
          <div className="test-item">
            <p><strong>Software Engineering Aptitude</strong></p>
            <small>📅 May 15, 2025 - 10:00 AM • ⏱ 60 minutes</small>
          </div>
          <div className="test-item">
            <p><strong>Logical Reasoning Assessment</strong></p>
            <small>📅 May 18, 2025 - 2:00 PM • ⏱ 45 minutes</small>
          </div>
        </div>

        <div className="card">
          <h3>Performance Summary</h3>
          <p>Tests Taken: <strong>12</strong></p>
          <p>Average Score: <strong>78%</strong></p>
          <p>Highest Score: <strong>92%</strong></p>
          <p>Completion Rate: <strong>85%</strong></p>
        </div>
      </div>
    </div>
  );
}
