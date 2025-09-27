import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles.css/Login.css";
import LOGO from "../assets/ChatGPT Image Sep 27, 2025, 10_23_41 AM.png"

 const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function Login() {
  const [activeTab, setActiveTab] = useState("student");

  // Student fields
  const [regNumber, setRegNumber] = useState("");
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [college, setCollege] = useState("");
  const [year, setYear] = useState("");

  // Admin fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (activeTab === "student") {
      if (!regNumber || !name || !department || !college ) {
        alert("Please fill all the fields!");
        return;
      }

      try {
        const res = await fetch(`${BASE_URL}/api/v1/users/student-login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            registerNo: regNumber,
            fullname: name,
            department,
            collegename: college,
            year,
          }),
        });

        const data = await res.json();
        console.log("login data", data);

        if (res.ok && data.student) {
          alert(data.message || "Login successful");
          localStorage.setItem("student", JSON.stringify(data.student));
          navigate("/dashboard");
          window.location.reload();
        } else {
          alert(data.message || "Login failed");
        }
      } catch (error) {
        console.error(error);
        alert("Something went wrong. Please try again.");
      }
    } else {
      // Admin login
      if (email === "admin@test.com" && password === "admin123") {
        navigate("/admin/admindashboard");
      } else {
        alert("Invalid admin credentials. Use email: admin@test.com / pass: admin123");
      }
    }
  };

  return (
    <div className="login-container">
      {/* Dark overlay on background */}
      <div className="background-overlay"></div>

      <div className="login-box">
        {/* Title */}
        <div className="title">
          <img src={LOGO} alt="hi" width={"100px"} height={"100px"}/>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button
            className={activeTab === "student" ? "active" : ""}
            onClick={() => setActiveTab("student")}
          >
            👨‍🎓 Student
          </button>
          <button
            className={activeTab === "admin" ? "active" : ""}
            onClick={() => setActiveTab("admin")}
          >
            🛠 Admin
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {activeTab === "student" ? (
            <>
              <div className="form-group">
                <label>Registration Number</label>
                <input
                  type="text"
                  placeholder="Enter your registration number"
                  value={regNumber}
                  onChange={(e) => setRegNumber(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Department</label>
                <input
                  type="text"
                  placeholder="Enter your department"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>College</label>
                <input
                  type="text"
                  placeholder="Enter your college name"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                />
              </div>

              {/* <div className="form-group">
                <label>Year</label>
                <select value={year} onChange={(e) => setYear(e.target.value)}>
                  <option value="">Select your year</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>
              </div> */}
            </>
          ) : (
            <>
              {/* Admin fields */}
              <div className="form-group">
                <label>Email or Username</label>
                <input
                  type="text"
                  placeholder="Enter your email or username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="options">
                <label className="checkbox-label">
                  <input type="checkbox" /> Remember me
                </label>
                <a href="#" className="forgot-link">Forgot password?</a>
              </div>
            </>
          )}

          <button type="submit" className="login-btn">
            Login
            <span className="btn-shine"></span>
          </button>
        </form>
      </div>
    </div>
  );
}
