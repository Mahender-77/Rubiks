import mongoose, { Schema, Document } from "mongoose";

// TypeScript interface for Job
export interface IJob extends Document {
  title: string;
  company: string;
  location: string;
  type: "full-time" | "part-time" | "contract" | "internship";
  salary: {
    min: number;   // ✅ should be number, not { type: Number }
    max: number;
    currency: string;
    salaryType: "monthly" | "yearly"; // ✅ matches schema enum
  };
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  skills: string[];
  experience: string;
  education: string;
  postedDate: Date;
  isActive: boolean;
  applications: number;
  views: number;
}

const JobSchema: Schema<IJob> = new Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    type: {
      type: String,
      enum: ["full-time", "part-time", "contract", "internship"],
      required: true,
    },
    salary: {
      min: { type: Number, required: true },
      max: { type: Number, required: true },
      currency: { type: String, default: "USD" },
      salaryType: {
        type: String,
        enum: ["monthly", "yearly"], // ✅ restrict values
        required: true,
      },
    },
    description: { type: String, required: true },
    requirements: [{ type: String }],
    responsibilities: [{ type: String }],
    benefits: [{ type: String }],
    skills: [{ type: String }],
    experience: { type: String },
    education: { type: String },
    postedDate: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
    applications: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<IJob>("Job", JobSchema);
