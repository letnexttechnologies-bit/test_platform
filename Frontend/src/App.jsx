// App.jsx
import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_BASE_URL;

import Login from "./pages/Login";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import AvailableTests from "./pages/AvailableTests";
import TestDetails from "./pages/TestDetails";
import ProgrammingTest from "./pages/ProgrammingTest";
import TestPage from "./pages/TestPage";
import Results from "./pages/Results";

// Admin
import AdminSidebar from "./components/AdminSidebar";
import AdminDashboard from "./components/AdminDashboard";
import TestManagement from "./components/TestManagement";
import QuestionBank from "./components/QuestionBank";
import StudentResults from "./components/StudentResults";
import StudentPerformance from "./components/StudentPerformance";
import StudentResistered from "./components/StudentResistered";
import AddingNewmcq from "./components/AddingNewmcq";
import AddingNewprogramming from "./components/AddingNewprogramming";

import "./App.css";
import ViewPerformace from "./components/ViewPerformace";

//  Student Layout
const MainLayout = ({ children, currentUser, latestTest }) => (
  <div className="app">
    <Sidebar student={currentUser} latestTest={latestTest} />
    <div className="main-content">
      <Navbar student={currentUser} />
      {children}
    </div>
  </div>
);

// 🟢 Admin Layout
const AdminLayout = () => (
  <div className="admin-app">
    <AdminSidebar />
    <div className="admin-main">
      <Outlet />
    </div>
  </div>
);

export default function App() {
  const [currentUser, setCurrentUser] = useState(null); // logged in student
  const [latestTest, setLatestTest] = useState(null); // store latest test

  // Fetch logged-in student
  useEffect(() => {
    const fetchStudent = async () => {
      
      try {
        const res = await fetch(`${BASE_URL}/api/v1/users/student-dashboard`,
          {
            credentials: "include",
          }
        );
        if (res.ok) {
          const data = await res.json();
          setCurrentUser(data.student);

          // 🟢 Now fetch the latest test for this student
          if (data.student?._id) {
            const testRes = await fetch(
              `${BASE_URL}/api/v1/test/latest/${data.student._id}`
            );
            if (testRes.ok) {
              const latest = await testRes.json();
              setLatestTest(latest);
            }
          }
        }
      } catch (err) {
        console.error("Error fetching student:", err);
      }
    };
    fetchStudent();
  }, []);

  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Login />} />

      {/* Student routes */}
      <Route
        path="/dashboard"
        element={
          <MainLayout currentUser={currentUser} latestTest={latestTest}>
            <Dashboard />
          </MainLayout>
        }
      />
      <Route
        path="/available-tests"
        element={
          <MainLayout currentUser={currentUser} latestTest={latestTest}>
            <AvailableTests />
          </MainLayout>
        }
      />
      <Route
        path="/test-details"
        element={
          <MainLayout currentUser={currentUser} latestTest={latestTest}>
            <TestDetails />
          </MainLayout>
        }
      />
      <Route
        path="/programming-test"
        element={
          <MainLayout currentUser={currentUser} latestTest={latestTest}>
            <ProgrammingTest
              currentUser={currentUser}
              setLatestTest={setLatestTest}
            />
          </MainLayout>
        }
      />
      <Route
        path="/test-page"
        element={
          <MainLayout currentUser={currentUser} latestTest={latestTest}>
            <TestPage latestTest={latestTest} />
          </MainLayout>
        }
      />
      <Route
        path="/results/:testId"
        element={
          <MainLayout currentUser={currentUser} latestTest={latestTest}>
            <Results />
          </MainLayout>
        }
      />
      

      

      {/* Admin routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="admindashboard" element={<AdminDashboard />} />
        <Route path="test-management" element={<TestManagement />} />
        <Route path="question-bank" element={<QuestionBank />} />
        <Route path="student-results" element={<StudentResults />} />
        <Route
          path="student-regi"
          element={
            <StudentResistered
              currentUser={currentUser}
              latestTest={latestTest}
            />
          }
        />
              <Route path="viewPerformance/:studentId" element={<ViewPerformace />} />

        <Route path="add-mcq" element={<AddingNewmcq />} />
        <Route path="add-program" element={<AddingNewprogramming />} />
        <Route
          path="student-performance/:id"
          element={<StudentPerformance />}
        />

        <Route
          path="*"
          element={<Navigate to="/admin/admindashboard" replace />}
        />
      </Route>
     
    </Routes>
  );
}
