import Student from "../models/studentModels.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// ✅ Student login (with auto-register if not exists)
export const studentLogin = async (req, res) => {
  try {
    const { registerNo, fullname, department, collegename } = req.body;

    let student = await Student.findOne({ registerNo });
    let isNewStudent = false;

    if (!student) {
      // Create new student
      student = await Student.create({
        registerNo,
        fullname,
        department,
        collegename,
      });
      isNewStudent = true;
    } else {
      // Ensure details match
      if (
        student.fullname !== fullname ||
        student.department !== department ||
        student.collegename !== collegename 
       
      ) {
        return res.status(400).json({ message: "Student data mismatch" });
      }
    }

    // Generate token
    const token = jwt.sign(
      { studentId: student._id, fullname: student.fullname, role: "student" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Send token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // ✅ only secure in production
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: isNewStudent
        ? "Student registered and logged in successfully"
        : "Student login successful",
      student: {
        fullname: student.fullname,
        registerNo: student.registerNo,
        department: student.department,
        collegename: student.collegename,
        
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Student login failed", error: error.message });
  }
};

// ✅ Protected student dashboard
export const studentDashboard = async (req, res) => {
  try {
    const student = await Student.findById(req.user.studentId).select("-__v");
    res.json({ message: "Welcome to Dashboard", student });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch dashboard" });
  }
};

// ✅ Fetch all students
export const allStudents = async (req, res) => {
  try {
    const students = await Student.find().select("-__v");
    res.status(200).json({
      message: "All students fetched successfully",
      count: students.length,
      students,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch students",
      error: error.message,
    });
  }
};

// ✅ Fetch only student count
export const studentCount = async (req, res) => {
  try {
    const count = await Student.countDocuments();
    res
      .status(200)
      .json({ message: "Student count fetched successfully", count });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch student count", error: error.message });
  }
};


export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Student.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    res.status(200).json({ success: true, message: "Student deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting student:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

// ✅ Delete ALL students
export const deleteAllStudents = async (req, res) => {
  try {
    const result = await Student.deleteMany({});
    res.status(200).json({
      success: true,
      message: `${result.deletedCount} students deleted successfully`,
    });
  } catch (err) {
    console.error("❌ Error deleting all students:", err);
    res.status(500).json({
      success: false,
      message: "Server error while deleting all students",
      error: err.message,
    });
  }
};
