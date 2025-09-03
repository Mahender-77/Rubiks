import express from "express";
import { authenticateToken, requireAdmin, } from "../middleware/authMiddleware.js";
import { createJob, deleteJob, getJobById, updateJob, createNews, getNews, deleteNews, } from "../controllers/adminController.js";
import { param, validationResult } from "express-validator";
const router = express.Router();
// Validation middleware for Express 5
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: "Validation error",
            errors: errors.array(),
        });
    }
    next();
};
// Public routes
router.get("/getNews", getNews);
router.get("/job/:id", [
    param("id").notEmpty().withMessage("Job ID is required"),
    handleValidationErrors,
], getJobById);
// Protected routes (Admin only - verified inside controller)
router.post("/jobs", authenticateToken, requireAdmin, createJob);
router.put("/updateJob/:id", [
    param("id").notEmpty().withMessage("Job ID is required"),
    handleValidationErrors,
], authenticateToken, requireAdmin, updateJob);
router.delete("/deletejob/:id", [
    param("id").notEmpty().withMessage("Job ID is required"),
    handleValidationErrors,
], authenticateToken, requireAdmin, deleteJob);
//new routes
router.post("/createNews", authenticateToken, requireAdmin, createNews);
router.put("/updateJob/:id", [
    param("id").notEmpty().withMessage("Job ID is required"),
    handleValidationErrors,
], authenticateToken, updateJob);
router.delete("/deletejob/:id", [
    param("id").notEmpty().withMessage("Job ID is required"),
    handleValidationErrors,
], authenticateToken, requireAdmin, deleteJob);
router.delete("/deletenews/:id", [
    param("id").notEmpty().withMessage("News ID is required"),
    handleValidationErrors,
], authenticateToken, requireAdmin, deleteNews);
export default router;
