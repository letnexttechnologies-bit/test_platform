import Program from "../models/Program.js";

// Add new programming question
export const addProgramming = async (req, res) => {
  try {
    const { title, description, skeleton_code, testcase } = req.body;

    if (!title || !description || !skeleton_code || !testcase) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const newProgram = await Program.create({ title, description, skeleton_code, testcase });

    res.status(201).json({ success: true, data: newProgram });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get all programming questions
export const getAllPrograms = async (req, res) => {
  try {
    const programs = await Program.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: programs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get a single programming question by ID
export const getProgramById = async (req, res) => {
  try {
    const program = await Program.findById(req.params.id);
    if (!program) return res.status(404).json({ success: false, message: "Not found" });
    res.status(200).json({ success: true, data: program });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Update programming question
export const updateProgram = async (req, res) => {
  try {
    const { title, description, skeleton_code, testcase } = req.body;

    const updatedProgram = await Program.findByIdAndUpdate(
      req.params.id,
      { title, description, skeleton_code, testcase },
      { new: true }
    );

    if (!updatedProgram) return res.status(404).json({ success: false, message: "Not found" });

    res.status(200).json({ success: true, data: updatedProgram });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Delete programming question
export const deleteProgram = async (req, res) => {
  try {
    const deletedProgram = await Program.findByIdAndDelete(req.params.id);
    if (!deletedProgram) return res.status(404).json({ success: false, message: "Not found" });
    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
