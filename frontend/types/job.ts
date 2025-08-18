interface Salary {
  min: number;
  max: number;
  currency: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: Salary;
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  skills: string[];
  experience: string;
  education: string;
  postedDate: string;
  isActive: boolean;
  applications: number;
  views: number;
}
export interface JobApplication {
  id: string;
  jobId: string;
  userId: string;
  status: 'reviewing' | 'shortlisted' | 'rejected' | 'hired';
  appliedDate: string;
  coverLetter: string;
  job: Job; // The full job object
}


// types/job.ts

export interface Jobs {
  id?: string; // optional, in case your backend provides it
  title: string;
  company: string;
  location: string;
  type: "full-time" | "part-time" | "contract" | "internship" | "freelance"; 
  salaryMin: string; // you can use number if backend sends numeric values
  salaryMax: string;
  currency: "USD" | "INR" | "EUR" | string; // extend as per your app
  salaryPeriod: "hourly" | "monthly" | "yearly"; // maps to salaryType in backend
  description: string;
  requirements: string;
  responsibilities: string;
  benefits: string;
  skills: string;
  experience: string;
  education: string;
  isActive: boolean;
}
