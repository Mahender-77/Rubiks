import Jobs from "../models/Jobs";
import express from "express";

import {authenticateToken} from "../middleware/authMiddleware.js"
import { fetchJobsAPI, getJobFilters, getJobs } from "../controllers/jobController";



const router = express.Router();


router.get("/getJobs", getJobs);
router.get("/jobfilters",getJobFilters)
router.get("/jobs",fetchJobsAPI)

export default router;