import express from "express";
import {
  studentLogin,
  studentDashboard,
  allStudents,
  deleteStudent,
  deleteAllStudents,
} from "../controllers/studentController.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

// Student login/register
router.post("/student-login", studentLogin);

// Get all students
router.get("/student-count", allStudents);

// Protected student dashboard
router.get("/student-dashboard", verifyToken, studentDashboard);

// Delete single student
router.delete("/students/:id", deleteStudent);

// Delete all students
router.delete("/delete-all", deleteAllStudents);

export default router;
