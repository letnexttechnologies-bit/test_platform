// routes/testRoutes.js
import express from "express";
import { submitTest, getTestById, getLatestTest, getLatestStudentResult } from "../controllers/testControllers.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

// POST submit test
router.post("/submit",verifyToken, submitTest);

// 🟢 Specific routes first
router.get("/latest/:studentId", getLatestTest);
// router.get("/results/:testId/:studentId", getStudentResult);

router.get("/latest-result/:studentId", getLatestStudentResult);

// 🟢 Generic last
router.get("/:id", getTestById);





export default router;
