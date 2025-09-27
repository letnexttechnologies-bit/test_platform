import mongoose from "mongoose";

// Testcase schema with optional string _id
const testCaseSchema = new mongoose.Schema({
  _id: { type: String }, // allow string IDs like "java_sum_tc1"
  input: { type: String, required: true },
  output: { type: String, required: true },
}, { _id: false }); // prevent Mongoose from auto-generating ObjectId

// Main Program schema
const programSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    skeleton_code: { type: String, required: true },
    testcase: { type: [testCaseSchema], default: [] },
  },
  { timestamps: true }
);

const Program = mongoose.model("Program", programSchema);

export default Program;
