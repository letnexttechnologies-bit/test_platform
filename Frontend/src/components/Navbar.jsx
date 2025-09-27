import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles.css/Navbar.css";

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [student, setStudent] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedStudent = localStorage.getItem("student");
    if (savedStudent) {
      setStudent(JSON.parse(savedStudent));
    }
  }, []);

const handleLogout = async () => {
  const confirmLogout = window.confirm("Are you sure you want to logout?");
  if (!confirmLogout) return; // If user cancels, do nothing

  try {
    await fetch("http://localhost:8000/api/v1/users/logout", {
      method: "POST",
      credentials: "include",
    });
    navigate("/");
  } catch (error) {
    console.error("Logout failed:", error);
  }
};



  return (
    <nav className="navbar">
      <div className="profile-dropdown">
        <div
          className="profile"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <div className="avatar">
            {student?.fullname ? student.fullname.charAt(0) : "?"}
          </div>
          <strong>{student?.fullname || "Guest"}</strong>
          <span className={`dropdown-arrow ${isDropdownOpen ? "open" : ""}`}>
            ▼
          </span>
        </div>

        {isDropdownOpen && (
          <div className="dropdown-menu">
            <button onClick={() => navigate("/profile")}>Profile</button>
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
    </nav>
  );
}
