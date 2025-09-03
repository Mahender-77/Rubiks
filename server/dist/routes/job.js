import express from "express";
import { fetchJobsAPI, getJobFilters, getJobs, } from "../controllers/jobController.js";
const router = express.Router();
router.get("/getJobs", getJobs);
router.get("/jobfilters", getJobFilters);
router.get("/jobs", fetchJobsAPI);
export default router;
