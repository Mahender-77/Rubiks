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
