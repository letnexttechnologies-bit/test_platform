

import express from "express";
import {
  addProgramming,
  getAllPrograms,
  getProgramById,
  updateProgram,
  deleteProgram,
} from "../controllers/addingNewprogram.js";

const router = express.Router();

// CRUD routes
router.post("/add-pro", addProgramming);           // Add new program
router.get("/all-pro", getAllPrograms);           // Get all programs
router.get("/:id", getProgramById);           // Get single program
router.put("/edit-pro/:id", updateProgram);       // Update program
router.delete("/delete-pro/:id", deleteProgram);  // Delete program

export default router;

