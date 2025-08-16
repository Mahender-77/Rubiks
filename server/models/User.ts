import mongoose, { Document, Model, ObjectId, Schema } from "mongoose";
import bcrypt from "bcryptjs";

// Instance methods
interface IUserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// User fields (no embedded profile now, just profile reference)
export interface IUser {
  name: string;
  email: string;
  phone?: string;
  password: string;
  role?: string; // Added role field
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  profile?: ObjectId; // Reference to Profile document

  settings?: any;

  createdAt: Date;
  updatedAt: Date;
}

// Model type
type UserModel = Model<IUser, {}, IUserMethods>;

// Schema
const userSchema = new mongoose.Schema<IUser, UserModel, IUserMethods>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: { type: String, trim: true },
    password: { type: String, required: true, minlength: 6 },
    role: {
      type: String,
      enum: ["user", "admin"], // optional restriction
      default: "user",
    },
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    profile: { type: Schema.Types.ObjectId, ref: "Profile" }, // Reference to Profile model
    settings: {},
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model<IUser, UserModel>("User", userSchema);

export default User;
