// controllers/adminController.js
import Student from "../models/studentModels.js";
import TestResult from "../models/TestResult.js";

export const getDashboardData = async (req, res) => {
  try {
    const students = await Student.find(); // all students
    const results = await TestResult.find(); // all test results

    // map studentId -> result
    const resultMap = {};
results.forEach((r) => {
  const mcqCorrect = r.mcqCorrect || 0;
  let programPassed = 0;
  const programAnswers = r.programAnswers || {};
  const programTestcases = r.programTestcases || {};

  Object.entries(programAnswers).forEach(([qId]) => {
    const tcs = programTestcases[qId] || [];
    if (tcs.length > 0 && tcs.every((tc) => tc.passed)) programPassed++;
  });

  const totalQuestions = (r.mcqTotal || 0) + (r.programTotal || 0);
  const totalCorrect = mcqCorrect + programPassed;
  const passPercent =
    totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;

  const passed = passPercent >= 50;

  // ✅ Keep the best result (passed first)
  if (!resultMap[r.studentId] || (!resultMap[r.studentId].passed && passed)) {
    resultMap[r.studentId] = {
      passed,
      score: Math.round(passPercent),
      testName: r.testName || "Unknown Test",
      date: new Date(r.createdAt).toLocaleDateString(),
    };
  }
});


    res.json({ students, resultMap });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch dashboard data" });
  }
};

