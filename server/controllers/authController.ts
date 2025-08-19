import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { validationResult } from 'express-validator';
import User from '../models/User'; // Assuming User model is defined in models/User.ts
import Profile from '../models/Profile';
import process from 'process';
import { sendVerificationEmail, sendPasswordResetEmail } from '../utils/emailService';
; 
  // Register new user


export const register = async (req: Request, res: Response) => {
  const { name, email, password, phone } = req.body;

  // Check if email already exists
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    return res.status(400).json({ success: false, message: 'Email already registered' });
  }

  // Create a verification token with user data (not yet stored in DB)
  const jwtSecret = process.env.JWT_SECRET!;
  const verificationToken = jwt.sign(
    { name, email, password, phone },
    jwtSecret,
    { expiresIn: '24h' }
  );

  // Send verification email
  await sendVerificationEmail(email, verificationToken, name);

  return res.status(200).json({
    success: true,
    message: 'Verification email sent. Please check your inbox.'
  });
};

  // Login user
  export const login = async (req:Request, res:Response)=> {
    console.log('Login request body:', req.body);
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
        return;
      }

      const { email, password } = req.body;

      // Find user by email
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
        return;
      }
      
      // Check password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
         res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
        return;
      }

      // Generate JWT token
      const jwtSecret = process.env.JWT_SECRET as string;
      if (!jwtSecret) {
        throw new Error('JWT_SECRET is not defined in environment variables');
      }
      const token = jwt.sign(
        { 
          userId: user._id,
          email: user.email 
        },
        jwtSecret,
        { expiresIn: '7d' }
      );

      // Ensure profile exists and build response
      let profile = await Profile.findOne({ userId: user._id });
      if (!profile) {
        profile = new Profile({ userId: user._id });
        await profile.save();
      }
     
      const userResponse = {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role:user.role,
        isEmailVerified: user.isEmailVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        profile: {
          avatar: profile.avatar || undefined,
          headline: profile.headline || undefined,
          location: profile.location || undefined,
          bio: profile.bio || undefined,
          url: profile.url || undefined,
          skills: profile.skills || [],
          education: profile.education || [],
          experience: profile.experience || [],
          resume: profile.resume || undefined,
          profileCompletion: profile.profileCompletion || 0,
        },
      };

     
      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user: userResponse,
          token
        }
      });

    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error during login'
      });
    }
  }

  // Forgot password
 export const forgotPassword =  async (req:Request, res:Response) =>{
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { email } = req.body;

      // Find user by email
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        // Don't reveal if email exists or not
        return res.json({
          success: true,
          message: 'If an account with that email exists, we have sent a password reset link.'
        });
      }

      // Generate password reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      // Save reset token to user
      user.passwordResetToken = resetToken;
      user.passwordResetExpires = resetExpires;
      await user.save();

      // Send password reset email (implement this utility)
      try {
        await sendPasswordResetEmail(user.email, resetToken, user.name);
      } catch (emailError) {
        console.error('Password reset email sending failed:', emailError);
        return res.status(500).json({
          success: false,
          message: 'Failed to send password reset email'
        });
      }

      res.json({
        success: true,
        message: 'Password reset link sent to your email'
      });

    } catch (error) {
      console.error('Forgot password error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Reset password (you'll need to add this route)
  export const resetPassword = async (req:Request, res:Response)=> {
    try {
      const { token, newPassword } = req.body;

      if (!token || !newPassword) {
        return res.status(400).json({
          success: false,
          message: 'Token and new password are required'
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Password must be at least 6 characters'
        });
      }

      // Find user with valid reset token
      const user = await User.findOne({
        passwordResetToken: token,
        passwordResetExpires: { $gt: Date.now() }
      });

      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or expired reset token'
        });
      }

      // Update password
      user.password = newPassword;
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save();

      res.json({
        success: true,
        message: 'Password reset successfully'
      });

    } catch (error) {
      console.error('Reset password error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Resend email verification
  export const resendVerification = async (req:Request, res:Response)=> {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { email } = req.body;

      // Find user by email
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      if (user.isEmailVerified) {
        return res.status(400).json({
          success: false,
          message: 'Email is already verified'
        });
      }

      // Generate new verification token
      const emailVerificationToken = crypto.randomBytes(32).toString('hex');
      const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      user.emailVerificationToken = emailVerificationToken;
      user.emailVerificationExpires = emailVerificationExpires;
      await user.save();

      // Send verification email (implement this utility)
      try {
        await sendVerificationEmail(user.email, emailVerificationToken, user.name);
      } catch (emailError) {
        console.error('Verification email sending failed:', emailError);
        return res.status(500).json({
          success: false,
          message: 'Failed to send verification email'
        });
      }

      res.json({
        success: true,
        message: 'Verification email sent successfully'
      });

    } catch (error) {
      console.error('Resend verification error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Verify email (you'll need to add this route)
 export const verifyEmail = async (req: Request, res: Response) => {
  const { token } = req.params;

  try {
    const jwtSecret = process.env.JWT_SECRET!;
    const decoded = jwt.verify(token, jwtSecret) as {
      name: string;
      email: string;
      password: string;
      phone?: string;
    };

    // Check again if user already exists
    const existingUser = await User.findOne({ email: decoded.email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already verified' });
    }

    // Create the user now
    const user = new User({
      name: decoded.name.trim(),
      email: decoded.email.toLowerCase().trim(),
      phone: decoded.phone?.trim(),
      password: decoded.password, // hash inside User model pre-save hook
      isEmailVerified: true,
    });

    await user.save();

    return res.status(200).json({ success: true, message: 'Email verified and account created' });
  } catch (error) {
    return res.status(400).json({ success: false, message: 'Invalid or expired token' });
  }
};

