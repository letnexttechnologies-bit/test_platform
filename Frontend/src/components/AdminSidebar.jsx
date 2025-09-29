import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles.css/AdminSidebar.css";
import LOGO1 from "../assets/learnNext.jpg";

export default function AdminSidebar() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [isResponsive, setIsResponsive] = useState(false); // true for tablet/mobile

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    alert("You have been logged out.");
    navigate("/");
  };

  // Detect screen width to enable collapse only in tablet/mobile
  useEffect(() => {
    const handleResize = () => {
      setIsResponsive(window.innerWidth <= 1024);
      if (window.innerWidth > 1024) setCollapsed(false); // ensure full sidebar on desktop
    };
    window.addEventListener("resize", handleResize);
    handleResize(); // initial check
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Toggle collapse only if responsive
  const handleSidebarClick = () => {
    if (isResponsive) setCollapsed(!collapsed);
  };

  const SidebarLinks = () => (
    <ul>
      <li>
        <NavLink
          to="/admin/admindashboard"
          className={({ isActive }) => (isActive ? "active-link" : "")}
        >
          <span className="icon">📊</span>
          <span className="text">Dashboard</span>
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/admin/question-bank"
          className={({ isActive }) => (isActive ? "active-link" : "")}
        >
          <span className="icon">❓</span>
          <span className="text">Question Bank</span>
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/admin/student-regi"
          className={({ isActive }) => (isActive ? "active-link" : "")}
        >
          <span className="icon">🧑‍🎓</span>
          <span className="text">Student Registration</span>
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/admin/test-management"
          className={({ isActive }) => (isActive ? "active-link" : "")}
        >
          <span className="icon">📝</span>
          <span className="text">Soon</span>
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/admin/student-results"
          className={({ isActive }) => (isActive ? "active-link" : "")}
        >
          <span className="icon">📈</span>
          <span className="text">Coming Soon</span>
        </NavLink>
      </li>
      <li>
        <button className="logout-btn" onClick={handleLogout}>
          <span className="icon">🚪</span>
          <span className="text">Logout</span>
        </button>
      </li>
    </ul>
  );

  return (
    <>
      <aside
        className={`admin-sidebar ${collapsed ? "collapsed" : ""}`}
        onClick={handleSidebarClick}
      >
        <div className="logo">
          <img src={LOGO1} alt="Logo" />
        </div>
        <SidebarLinks />
      </aside>
    </>
  );
}
