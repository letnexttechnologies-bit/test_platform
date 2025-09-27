// controllers/testControllers.js
import TestResult from "../models/TestResult.js";
import mongoose from "mongoose";


export const submitTest = async (req, res) => {
  try {
    // ✅ Allow both: token OR request body
const studentId = req.user?._id || req.body.studentId;
    if (!studentId) {
      return res.status(400).json({ success: false, message: "Student ID is required" });
    }

    const { mcqQuestions, mcqAnswers, programAnswers, programOutputs, programTestcases, remainingTime } = req.body;

    const mcqTotal = mcqQuestions?.length || 0;
    const mcqAnswered = Object.keys(mcqAnswers || {}).length;

    const correctMCQIds = mcqQuestions
      ?.filter(q => mcqAnswers[q._id] === q.correctOption)
      .map(q => q._id) || [];

    const mcqCorrect = correctMCQIds.length;
    const mcqWrong = mcqAnswered - mcqCorrect;

    const programTotal = Object.keys(programAnswers || {}).length;
    const programAnswered = programTotal;
    let programPassed = 0;

    Object.values(programTestcases || {}).forEach(testcases => {
      if (testcases.every(tc => tc.passed)) programPassed += 1;
    });

    const test = new TestResult({
      studentId,
      mcqTotal,
      mcqAnswered,
      mcqCorrect,
      mcqWrong,
      programTotal,
      programAnswered,
      programPassed,
      timeTaken: remainingTime,
      mcqAnswers,
      correctMCQIds,
      programAnswers,
      programOutputs,
      programTestcases,
    });

    await test.save();
    res.status(200).json({ success: true, data: test });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to save test", error: err.message });
  }
};




// Get test by ID
export const getTestById = async (req, res) => {
  try {
    const { testId } = req.params;
    const { studentId } = req.query; // or get from req.user._id if using auth

    let result;

    if (testId === "latest") {
      // Fetch the latest test result for the student
      if (!studentId) {
        return res.status(400).json({ message: "studentId is required to fetch latest test" });
      }

      result = await TestResult.findOne({ studentId }).sort({ createdAt: -1 });
    } else {
      // Validate ObjectId
      if (!mongoose.Types.ObjectId.isValid(testId)) {
        return res.status(400).json({ message: "Invalid test ID" });
      }

      result = await TestResult.findById(testId);
    }

    if (!result) {
      return res.status(404).json({ message: "Test result not found" });
    }

    res.json(result);
  } catch (error) {
    console.error("Error fetching test result:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get latest test for a student
export const getLatestTest = async (req, res) => {
  try {
    const { studentId } = req.params; // ✅ read from route param
    if (!studentId) return res.status(400).json({ success: false, message: "studentId is required" });

    const latestTest = await TestResult.findOne({ studentId }).sort({ createdAt: -1 });
    if (!latestTest) return res.status(404).json({ success: false, message: "No latest test found" });

    res.status(200).json({ success: true, data: latestTest });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};


export const getLatestStudentResult = async (req, res) => {
  try {
    const { studentId } = req.params;

    const result = await TestResult.findOne({ studentId }).sort({ createdAt: -1 }); // latest test

    if (!result) {
      return res.status(404).json({ message: "Result not found" });
    }

    res.json({ data: result });
  } catch (error) {
    console.error("❌ Error fetching student result:", error);
    res.status(500).json({ message: "Server error" });
  }
};


