import { Request, Response, NextFunction } from "express";
import Jobs from "../models/Jobs.js";

export const createJob = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Creating job with data:", req.body);
  try {
    // Check admin
    if (req.user?.user?.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Admin access required" });
    }

    const job = new Jobs(req.body);
    await job.save();

    res.status(201).json({ success: true, job });
  } catch (error: any) {
    console.error("Create job error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getJobs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const jobs = await Jobs.find().sort({ createdAt: -1 });
    res.json({ success: true, jobs });
  } catch (error: any) {
    console.error("Get jobs error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getJobById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const job = await Jobs.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    res.json({ success: true, job });
  } catch (error: any) {
    console.error("Get job by ID error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateJob = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Check role
    if (req.user?.user?.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Admin access required" });
    }

    // Extract job id from params
    const { id } = req.params;

    // Update job with request body
    const job = await Jobs.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    // Match frontend expectation
    res.json({
      success: true,
      message: "Job updated successfully",
      job,
    });
  } catch (error: any) {
    console.error("Update job error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

export const deleteJob = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Deleting job with ID:", req.params.id);
  try {
    if (req.user?.user?.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Admin access required" });
    }

    const job = await Jobs.findByIdAndDelete(req.params.id);
    console.log("Job found for deletion:", job);

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    console.log("Job deleted successfully:", job._id);
    res.json({ success: true, message: "Job deleted successfully" });
  } catch (error: any) {
    console.error("Delete job error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
