import express from "express";
import { authenticateToken } from "../middleware/authMiddleware";
import { createJob, deleteJob, getJobById, getJobs, updateJob } from "../controllers/adminController";


const router = express.Router();

// Public
router.get("/getJobs", getJobs);
router.get("/job/:id", getJobById);

// Protected (Admin only inside controller)
router.delete("/deletejob/:id", authenticateToken, deleteJob);
router.post("/jobs", authenticateToken, createJob);
router.put("/updateJob/:id", authenticateToken, updateJob);
// router.delete("/:id", authenticateToken, deleteJob);

export default router;
