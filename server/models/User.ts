import mongoose, { Document, Model, ObjectId } from 'mongoose';
import bcrypt from 'bcryptjs';

// Instance methods
interface IUserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
  calculateProfileCompletion(): number;
}

// User fields
interface IUser {
  name: string;
  email: string;
  phone?: string;
  password: string;
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  profile: {
    avatar?: string | null;
    headline?: string;
    location?: string;
    bio?: string;
    skills?: string[];
    education?: any[];
    experience?: any[];
    resume?: any;
    profileCompletion?: number;
  };
  settings?: any;

  // ✅ Added timestamps here so TS knows they exist
  createdAt: Date;
  updatedAt: Date;
}

// Model type
type UserModel = Model<IUser, {}, IUserMethods>;

// Schema
const userSchema = new mongoose.Schema<IUser, UserModel, IUserMethods>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    password: { type: String, required: true, minlength: 6 },
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    profile: {
      avatar: { type: String, default: null },
      headline: String,
      location: String,
      bio: String,
      skills: [String],
      education: [{}],
      experience: [{}],
      resume: {},
      profileCompletion: { type: Number, default: 0 }
    },
    settings: {}
  },
  { timestamps: true } // ✅ This tells Mongoose to create createdAt & updatedAt
);

// Hash password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Calculate profile completion
userSchema.methods.calculateProfileCompletion = function () {
  let completion = 0;
  const totalFields = 8;
  if (this.profile?.headline) completion++;
  if (this.profile?.location) completion++;
  if (this.profile?.bio) completion++;
  if (this.profile?.skills?.length) completion++;
  if (this.profile?.education?.length) completion++;
  if (this.profile?.experience?.length) completion++;
  if (this.profile?.avatar) completion++;
  if (this.profile?.resume) completion++;
  return Math.round((completion / totalFields) * 100);
};

// Update profileCompletion before saving
userSchema.pre('save', function (next) {
  if (this.isModified('profile')) {
    this.profile.profileCompletion = this.calculateProfileCompletion();
  }
  next();
});

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model<IUser, UserModel>('User', userSchema);
export default User;
