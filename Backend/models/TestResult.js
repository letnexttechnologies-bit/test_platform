// models/TestResult.js
import mongoose from "mongoose";

const testResultSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },

    mcqTotal: { type: Number, default: 0 },
    mcqAnswered: { type: Number, default: 0 },
    mcqCorrect: { type: Number, default: 0 },
    mcqWrong: { type: Number, default: 0 },
   correctMCQIds: { type: [String], default: [] },
    programTotal: { type: Number, default: 0 },
    programAnswered: { type: Number, default: 0 },
    programPassed: { type: Number, default: 0 },

    timeTaken: { type: Number, default: 0 },

    mcqAnswers: { type: Object, default: {} },
    programAnswers: { type: Object, default: {} },
    programOutputs: { type: Object, default: {} },
    programTestcases: { type: Object, default: {} },
  },
  { timestamps: true }
);

const TestResult = mongoose.model("TestResult", testResultSchema);
export default TestResult;
