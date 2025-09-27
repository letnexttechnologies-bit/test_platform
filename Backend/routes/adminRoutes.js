// routes/adminRoutes.js
import express from "express";
import { getDashboardData } from "../controllers/adminController.js";

const router = express.Router();

// GET /api/v1/admin/dashboard-data
router.get("/dashboard-data", getDashboardData);

export default router;
