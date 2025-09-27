import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles.css/AdminSidebar.css";
import LOGO1 from "../assets/learnNext.jpg"; // ✅ import image


export default function AdminSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    alert("You have been logged out.");
    navigate("/"); 
  };

  return (
    <aside className="admin-sidebar">
      <div className="logo">
         <img src={LOGO1} alt="Logo"  />
      </div>
      <ul>
        <li>
          <NavLink 
            to="/admin/admindashboard"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            📊 Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/admin/question-bank"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            ❓ Question Bank
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/admin/student-regi"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            🧑‍🎓 Student Registration
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/admin/test-management"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            📝 Soon
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/admin/student-results"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            📈 Coming Soon
          </NavLink>
        </li>
        <li>
          <button className="logout-btn" onClick={handleLogout}>
            🚪 Logout
          </button>
        </li>
      </ul>
    </aside>
  );
}
