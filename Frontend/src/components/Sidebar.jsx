// Sidebar.jsx
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import "../styles.css/Sidebar.css";
import LOGO1 from "../assets/learnNext.jpg"; // ✅ import image


export default function Sidebar({ student, latestTest }) {
  const [latestResult, setLatestResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!student?._id) return; // wait until student is loaded

    const fetchLatestResult = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `http://localhost:8000/api/v1/test/latest/${student._id}`
        );
        const data = await res.json();
        if (res.ok && data.success) setLatestResult(data.data);
        else setLatestResult(null);
      } catch (err) {
        console.error("Error fetching latest result:", err);
        setLatestResult(null);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestResult();
  }, [student]); // runs whenever student changes
  return (
    <aside className="sidebar">
      <div className="logo" >
        <img src={LOGO1} alt="Logo"  />
        
      </div>
      <ul>
        <li>
          <NavLink
            to="/dashboard"
            // ✅ pass latestTest here
          >
            📊 Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/available-tests">📝 Available Tests</NavLink>
        </li>
        <li>
          <NavLink
            to="/test-details"
            onClick={(e) => {
              if (latestTest) {
                e.preventDefault(); // stop navigation
                alert("You have  already completed the test");
              }
            }}
          >
            ✅ My Tests
          </NavLink>
        </li>
        
       {/* ✅ Only show Results if latestTest exists */}
        {latestTest && (
          <li>
            <NavLink
              to={`/results/${latestTest._id}`}
              state={{ test: latestTest }}
            >
              📈 Results
            </NavLink>
          </li>
        )}
          
        {/* <li>
          <NavLink to="/profile">👤 Profile</NavLink>
        </li> */}
      </ul>
    </aside>
  );
}
