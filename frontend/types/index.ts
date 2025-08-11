// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  isEmailVerified: boolean;
  profile: UserProfile;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  avatar?: string; // base64 image
  headline?: string;
  location?: string;
  bio?: string;
  skills: string[];
  education: Education[];
  experience: Experience[];
  resume?: Resume;
  profileCompletion: number;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  skills: string[];
}

export interface Resume {
  id: string;
  title: string;
  template: string;
  content: ResumeContent;
  createdAt: string;
  updatedAt: string;
}

export interface ResumeContent {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    website?: string;
  };
  summary: string;
  education: Education[];
  experience: Experience[];
  skills: string[];
  certifications?: Certification[];
  projects?: Project[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  description?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  url?: string;
  startDate: string;
  endDate?: string;
}

// Job Types
export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship' | 'remote';
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  skills: string[];
  experience: string;
  education: string;
  postedDate: string;
  deadline?: string;
  isActive: boolean;
  applications: number;
  views: number;
}

export interface JobApplication {
  id: string;
  jobId: string;
  userId: string;
  status: 'applied' | 'reviewing' | 'shortlisted' | 'interview' | 'rejected' | 'accepted';
  appliedDate: string;
  resumeId?: string;
  coverLetter?: string;
  notes?: string;
  job: Job;
}

export interface JobSearchFilters {
  location?: string;
  type?: string[];
  experience?: string[];
  salary?: {
    min: number;
    max: number;
  };
  skills?: string[];
  remote?: boolean;
}

// Resume Templates
export interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  preview: string;
  category: 'professional' | 'creative' | 'minimal' | 'modern';
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  type: 'application_update' | 'job_recommendation' | 'profile_view' | 'message';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  data?: any;
}

// Settings Types
export interface UserSettings {
  notifications: {
    email: boolean;
    push: boolean;
    jobAlerts: boolean;
    applicationUpdates: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private' | 'connections';
    showContactInfo: boolean;
  };
  preferences: {
    jobTypes: string[];
    locations: string[];
    salaryRange: {
      min: number;
      max: number;
    };
  };
}
