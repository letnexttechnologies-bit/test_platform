import React, { useState, useEffect } from "react";
import "../styles.css/AdminDashboard.css";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function AdminDashboard() {
  const [studentCount, setStudentCount] = useState(0);
  const [collegeCount, setCollegeCount] = useState(0);
  const [topColleges, setTopColleges] = useState([]);
  const [topStudents, setTopStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await fetch(`${BASE_URL}/api/v1/admin/dashboard-data`);
        if (!res.ok) throw new Error("Failed to fetch dashboard data");

        const { students = [], resultMap = {} } = await res.json();

        setStudentCount(students.length);
        const uniqueColleges = new Set(students.map((s) => s.collegename));
        setCollegeCount(uniqueColleges.size);

        const collegeMap = students.reduce((acc, student) => {
          if (!acc[student.collegename]) {
            acc[student.collegename] = { name: student.collegename, candidates: 0, passed: 0 };
          }
          acc[student.collegename].candidates += 1;

          if (!resultMap[student._id]) resultMap[student._id] = { passed: false, score: 0 };
          if (resultMap[student._id].passed) acc[student.collegename].passed += 1;

          return acc;
        }, {});

        const collegesArray = Object.values(collegeMap).map(college => ({
          ...college,
          rate: college.candidates ? Math.round((college.passed / college.candidates) * 100) + "%" : "0%",
          initials: college.name.substring(0, 3).toUpperCase(),
        }));

        collegesArray.sort((a, b) => {
          const rateA = parseInt(a.rate.replace("%",""));
          const rateB = parseInt(b.rate.replace("%",""));
          if(rateB === rateA) return b.candidates - a.candidates;
          return rateB - rateA;
        });

        setTopColleges(collegesArray.slice(0,4));

        const studentsWithResults = students
          .filter(s => s.fullname)
          .map(s => ({
            name: s.fullname,
            initials: s.fullname.split(" ").map(n => n[0]).join("").substring(0,2).toUpperCase(),
            collegename: s.collegename,
            ...resultMap[s._id],
          }))
          .filter(s => s.score !== undefined)
          .sort((a,b) => b.score - a.score)
          .slice(0,5);

        setTopStudents(studentsWithResults);

      } catch(err) {
        console.error(err);
        setError("Failed to fetch dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const stats = [
    { title: "Number of Colleges", value: collegeCount, subtitle: "vs last month" },
    { title: "Number of Students", value: studentCount, subtitle: "vs last month" },
    { title: "----", value: "", subtitle: "" },
    { title: "----", value: "", subtitle: "" },
  ];

  if(loading) return <p>Loading dashboard...</p>;
  if(error) return <p style={{color: "red"}}>{error}</p>;

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Dashboard Overview</h1>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        {stats.map((stat,index)=>(
          <div key={index} className="stat-card">
            <h3>{stat.title}</h3>
            <div className="stat-value">{stat.value ?? "N/A"}</div>
            <div className="stat-change">
              <span className="stat-subtitle">{stat.subtitle}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-content">
        {/* Top Students */}
        <div className="content-card">
          <h2>Top Performing Students</h2>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Score</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {topStudents.map((student, idx)=>(
                  <tr key={idx}>
                    <td>
                      <div className="user-info">
                        <span className="user-avatar">{student.initials}</span>
                        <span>{student.name}</span>
                      </div>
                    </td>
                    <td>{student.score}%</td>
                    <td>{student.date}</td>
                    <td>
                      <span className={`status-badge ${student.passed?"passed":"failed"}`}>
                        {student.passed ? "Passed":"Failed"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Colleges */}
        <div className="content-card">
          <h2>Top Performing Colleges</h2>
          <div className="colleges-list">
            {topColleges.map((college,index)=>(
              <div key={index} className="college-item">
                <div className="college-info">
                  <span className="college-initials">{college.initials}</span>
                  <div>
                    <h4>{college.name}</h4>
                    <p>{college.candidates} candidates, {college.passed} passed</p>
                  </div>
                </div>
                <div className="college-rate">{college.rate}</div>
              </div>
            ))}
          </div>
          <button className="view-all-btn">View all</button>
        </div>
      </div>
    </div>
  );
}
