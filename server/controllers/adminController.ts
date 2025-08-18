import { Request, Response } from "express";
import Jobs from "../models/Jobs";


export const createJob = async (req: Request, res: Response) => {
    console.log('Creating job with data:', req.body);
  try {
    // Check admin
    if (req.user?.user?.role !== "admin") {
      return res.status(403).json({ success: false, message: "Admin access required" });
    }

    const job = new Jobs(req.body);
    await job.save();

    res.status(201).json({ success: true, job });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getJobs = async (_req: Request, res: Response) => {
  try {
    const jobs = await Jobs.find().sort({ createdAt: -1 });
    
    res.json({ success: true, jobs });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getJobById = async (req: Request, res: Response) => {
  try {
    const job = await Jobs.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });
    res.json({ success: true, job });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateJob = async (req: Request, res: Response) => {
  try {
    if (req.user?.user?.role !== "admin") {
      return res.status(403).json({ success: false, message: "Admin access required" });
    }

    const job = await Jobs.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });

    res.json({ success: true, job });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteJob = async (req: Request, res: Response) => {
  try {
    if (req.user?.user?.role !== "admin") {
      return res.status(403).json({ success: false, message: "Admin access required" });
    }

    const job = await Jobs.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });

    res.json({ success: true, message: "Job deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
