const mongoose = require('mongoose');

// ---------- Reusable Sub-Schemas ----------
const educationSchema = new mongoose.Schema({
  id: { type: String, default: () => Math.random().toString(36).substr(2, 9) },
  institution: { type: String, required: true, trim: true },
  degree: { type: String, required: true, trim: true },
  field: { type: String, required: true, trim: true },
  startDate: { type: String, required: true },
  endDate: String,
  current: { type: Boolean, default: false },
  description: String,
  gpa: String,
  achievements: [String]
}, { _id: false });

const experienceSchema = new mongoose.Schema({
  id: { type: String, default: () => Math.random().toString(36).substr(2, 9) },
  title: { type: String, required: true, trim: true },
  company: { type: String, required: true, trim: true },
  location: String,
  startDate: { type: String, required: true },
  endDate: String,
  current: { type: Boolean, default: false },
  description: { type: String, required: true },
  skills: [{ type: String, trim: true }],
  achievements: [String],
  companyLogo: String
}, { _id: false });

const certificationSchema = new mongoose.Schema({
  id: { type: String, default: () => Math.random().toString(36).substr(2, 9) },
  name: { type: String, required: true, trim: true },
  issuer: { type: String, required: true, trim: true },
  date: { type: String, required: true },
  description: String,
  credentialId: String,
  expiryDate: String,
  credentialUrl: String
}, { _id: false });

const projectSchema = new mongoose.Schema({
  id: { type: String, default: () => Math.random().toString(36).substr(2, 9) },
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  technologies: [{ type: String, trim: true }],
  url: String,
  githubUrl: String,
  startDate: String,
  endDate: String,
  current: { type: Boolean, default: false },
  image: String,
  highlights: [String]
}, { _id: false });

const languageSchema = new mongoose.Schema({
  language: { type: String, required: true, trim: true },
  proficiency: { 
    type: String, 
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Native'], 
    default: 'Intermediate' 
  }
}, { _id: false });

// ---------- Resume Schema ----------
const resumeSchema = new mongoose.Schema({
  id: { type: String, default: () => Math.random().toString(36).substr(2, 9) },
  title: { type: String, default: 'My Professional Resume' },
  template: { type: String, default: 'professional' },
  content: {
    personalInfo: {
      name: String,
      email: String,
      phone: String,
      location: String,
      linkedin: String,
      website: String
    },
    summary: String,
    education: [educationSchema],
    experience: [experienceSchema],
    skills: [String],
    certifications: [certificationSchema],
    projects: [projectSchema],
    languages: [languageSchema]
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { _id: false });

// ---------- Main Profile Schema ----------
const profileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  avatar: { type: String, default: null }, // base64 image
  headline: { type: String, trim: true, maxlength: 200 },
  location: { type: String, trim: true },
  bio: { type: String, trim: true, maxlength: 1000 },
  url: { type: String, trim: true },
  skills: [{ type: String, trim: true }],
  education: [educationSchema],
  experience: [experienceSchema],
  certifications: [certificationSchema],
  projects: [projectSchema],
  languages: [languageSchema],
  socialLinks: {
    linkedin: String,
    github: String,
    portfolio: String,
    twitter: String,
    website: String
  },
  resume: resumeSchema,
  profileCompletion: { type: Number, default: 0 },
  isPublic: { type: Boolean, default: true },
  viewCount: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now }
}, { timestamps: true });

// ---------- Methods ----------
profileSchema.methods.calculateProfileCompletion = function () {
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

// Pre-save hook to auto-update completion & lastUpdated
profileSchema.pre('save', function (next) {
  this.profileCompletion = this.calculateProfileCompletion();
  this.lastUpdated = new Date();
  next();
});

module.exports = mongoose.model('Profile', profileSchema);
