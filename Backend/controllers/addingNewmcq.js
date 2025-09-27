
import Mcq from "../models/addNewmcq.js";


export const addMcq = async (req, res) => {
  try {
    const { question, option1, option2, option3, option4, correctOption } = req.body;
   
    // Create a new document in the Mcq collection
    const newQuestion = await Mcq.create({
      question,
      option1,
      option2,
      option3,
      option4,
      correctOption,
    });

    res.status(201).json({
      success: true,
      message: "MCQ question added successfully.",
      data: newQuestion,
    });
  } catch (error) {
    console.error("Error adding MCQ:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add MCQ question.",
      error: error.message,
    });
  }
};

export const getAllMcqs = async (req, res) => {
  try {
    const allQuestions = await Mcq.find({});

    res.status(200).json({
      success: true,
      count: allQuestions.length,
      data: allQuestions,
    });
  } catch (error) {
    console.error("Error fetching MCQs:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch MCQ questions.",
      error: error.message,
    });
  }
};

export const deleteMcq = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the MCQ by ID and delete it
    const result = await Mcq.findByIdAndDelete(id);

    // Check if the document was found and deleted
    if (!result) {
      return res.status(404).json({
        success: false,
        message: "MCQ question not found."
      });
    }

    res.status(200).json({
      success: true,
      message: "MCQ question deleted successfully.",
      data: result,
    });
  } catch (error) {
    console.error("Error deleting MCQ:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete MCQ question.",
      error: error.message,
    });
  }
};

export const editMcq = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Use findByIdAndUpdate to find and update the document
    const updatedMcq = await Mcq.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true } // Options for the update
    );

    // Check if the document was found
    if (!updatedMcq) {
      return res.status(404).json({
        success: false,
        message: "MCQ question not found."
      });
    }

    res.status(200).json({
      success: true,
      message: "MCQ question updated successfully.",
      data: updatedMcq,
    });
  } catch (error) {
    console.error("Error editing MCQ:", error);
    res.status(500).json({
      success: false,
      message: "Failed to edit MCQ question.",
      error: error.message,
    });
  }
};