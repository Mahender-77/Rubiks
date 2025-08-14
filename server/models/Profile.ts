import mongoose, { Document, Schema, Model, Types } from 'mongoose';

// ---------- Interfaces for sub-documents ----------

interface IEducation {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  description?: string;
  gpa?: string;
  achievements?: string[];
}

interface IExperience {
  id: string;
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  description: string;
  skills?: string[];
  achievements?: string[];
  companyLogo?: string;
}

interface ICertification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  description?: string;
  credentialId?: string;
  expiryDate?: string;
  credentialUrl?: string;
}

interface IProject {
  id: string;
  title: string;
  description: string;
  technologies?: string[];
  url?: string;
  githubUrl?: string;
  startDate?: string;
  endDate?: string;
  current?: boolean;
  image?: string;
  highlights?: string[];
}

interface ILanguage {
  language: string;
  proficiency: 'Beginner' | 'Intermediate' | 'Advanced' | 'Native';
}

interface IPersonalInfo {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  website?: string;
}

interface IResumeContent {
  personalInfo?: IPersonalInfo;
  summary?: string;
  education?: IEducation[];
  experience?: IExperience[];
  skills?: string[];
  certifications?: ICertification[];
  projects?: IProject[];
  languages?: ILanguage[];
}

interface IResume {
  id: string;
  title?: string;
  template?: string;
  content?: IResumeContent;
  createdAt?: Date;
  updatedAt?: Date;
}

// ---------- Main Profile Document Interface ----------

export interface IProfile extends Document {
  userId: Types.ObjectId;
  avatar?: string | null; // base64 image
  headline?: string;
  location?: string;
  bio?: string;
  url?: string;
  skills?: string[];
  education?: IEducation[];
  experience?: IExperience[];
  certifications?: ICertification[];
  projects?: IProject[];
  languages?: ILanguage[];
  socialLinks?: {
    linkedin?: string;
    github?: string;
    portfolio?: string;
    twitter?: string;
    website?: string;
  };
  resume?: IResume;
  profileCompletion: number;
  isPublic: boolean;
  viewCount: number;

  calculateProfileCompletion(): number;
}

// ---------- Schemas ----------

// Helper function to generate ObjectId string
const generateId = () => new mongoose.Types.ObjectId().toString();

const educationSchema = new Schema<IEducation>(
  {
    id: { type: String, default: generateId },
    institution: { type: String, required: true, trim: true },
    degree: { type: String, required: true, trim: true },
    field: { type: String, required: true, trim: true },
    startDate: { type: String, required: true },
    endDate: String,
    current: { type: Boolean, default: false },
    description: String,
    gpa: String,
    achievements: { type: [String], default: [] },
  },
  { _id: false, timestamps: true }
);

const experienceSchema = new Schema<IExperience>(
  {
    id: { type: String, default: generateId },
    title: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    location: String,
    startDate: { type: String, required: true },
    endDate: String,
    current: { type: Boolean, default: false },
    description: { type: String, required: true },
    skills: { type: [String], trim: true, default: [] },
    achievements: { type: [String], default: [] },
    companyLogo: String,
  },
  { _id: false, timestamps: true }
);

const certificationSchema = new Schema<ICertification>(
  {
    id: { type: String, default: generateId },
    name: { type: String, required: true, trim: true },
    issuer: { type: String, required: true, trim: true },
    date: { type: String, required: true },
    description: String,
    credentialId: String,
    expiryDate: String,
    credentialUrl: String,
  },
  { _id: false, timestamps: true }
);

const projectSchema = new Schema<IProject>(
  {
    id: { type: String, default: generateId },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    technologies: { type: [String], trim: true, default: [] },
    url: { type: String, match: /^https?:\/\/.+/, required: false },
    githubUrl: { type: String, match: /^https?:\/\/.+/, required: false },
    startDate: String,
    endDate: String,
    current: { type: Boolean, default: false },
    image: String,
    highlights: { type: [String], default: [] },
  },
  { _id: false, timestamps: true }
);

const languageSchema = new Schema<ILanguage>(
  {
    language: { type: String, required: true, trim: true },
    proficiency: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Native'],
      default: 'Intermediate',
    },
  },
  { _id: false }
);

const resumeSchema = new Schema<IResume>(
  {
    id: { type: String, default: generateId },
    title: { type: String, default: 'My Professional Resume' },
    template: { type: String, default: 'professional' },
    content: {
      personalInfo: {
        name: String,
        email: String,
        phone: String,
        location: String,
        linkedin: String,
        website: String,
      },
      summary: String,
      education: { type: [educationSchema], default: [] },
      experience: { type: [experienceSchema], default: [] },
      skills: { type: [String], default: [] },
      certifications: { type: [certificationSchema], default: [] },
      projects: { type: [projectSchema], default: [] },
      languages: { type: [languageSchema], default: [] },
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const profileSchema = new Schema<IProfile>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    avatar: { type: String, default: null },
    headline: { type: String, trim: true, maxlength: 200 },
    location: { type: String, trim: true },
    bio: { type: String, trim: true, maxlength: 1000 },
    url: { type: String, trim: true, match: /^https?:\/\/.+/ },
    skills: { type: [String], trim: true, default: [] },
    education: { type: [educationSchema], default: [] },
    experience: { type: [experienceSchema], default: [] },
    certifications: { type: [certificationSchema], default: [] },
    projects: { type: [projectSchema], default: [] },
    languages: { type: [languageSchema], default: [] },
    socialLinks: {
      linkedin: { type: String, match: /^https?:\/\/.+/, required: false },
      github: { type: String, match: /^https?:\/\/.+/, required: false },
      portfolio: { type: String, match: /^https?:\/\/.+/, required: false },
      twitter: { type: String, match: /^https?:\/\/.+/, required: false },
      website: { type: String, match: /^https?:\/\/.+/, required: false },
    },
    resume: { type: resumeSchema, default: () => ({}) },
    profileCompletion: { type: Number, default: 0 },
    isPublic: { type: Boolean, default: true },
    viewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// ---------- Methods ----------
profileSchema.methods.calculateProfileCompletion = function (): number {
  const totalFields = 10;
  let completion = 0;

  if (this.avatar) completion++;
  if (this.headline) completion++;
  if (this.location) completion++;
  if (this.bio) completion++;
  if (this.skills?.length) completion++;
  if (this.education?.length) completion++;
  if (this.experience?.length) completion++;
  if (this.certifications?.length) completion++;
  if (this.projects?.length) completion++;
  if (this.languages?.length) completion++;

  return Math.round((completion / totalFields) * 100);
};

// Pre-save hook to auto-update completion
profileSchema.pre('save', function (next) {
  this.profileCompletion = this.calculateProfileCompletion();
  next();
});

const Profile: Model<IProfile> = mongoose.model<IProfile>('Profile', profileSchema);

export default Profile;
