import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

dotenv.config({ path: "./.env" });

const app = express();
const mongo_url = process.env.MONGODB_URI;
app.use(cors());
app.use(express.json());

console.log("Db", mongo_url);
// ✅ MongoDB connection
mongoose
  .connect(mongo_url!)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Server working" });
});
import Jobs from "./models/Jobs.js";
// Test route to verify server is running
app.get("/test/route", async (req, res) => {
  try {
    const jobs = await Jobs.find(); // get all jobs

    res.json({
      success: true,
      count: jobs.length,
      data: jobs,
    });
  } catch (error) {
    console.error("❌ Error fetching jobs:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch jobs",
    });
  }
});

// Test ONE route file at a time by uncommenting:

// Test 1: Admin routes only
import adminRoutes from "./routes/admin.js";
app.use("/api/admin", adminRoutes);

// Test 2: Auth routes only (comment out admin first)
import authRoutes from "./routes/auth.js";
app.use("/api/auth", authRoutes);

// Test 3: Profile routes only (comment out others first)

import profileRoutes from "./routes/profile.js";

app.use("/api/profile", profileRoutes);

import jobRoutes from "./routes/job.js";

app.use("/api/job", jobRoutes);

const PORT = parseInt(process.env.PORT || "5001", 10);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log("✅ Route test successful!");
});
