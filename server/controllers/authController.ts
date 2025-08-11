import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { validationResult } from 'express-validator';
import User from '../models/User'; // Assuming User model is defined in models/User.ts
import process from 'process';
import { sendVerificationEmail, sendPasswordResetEmail } from '../utils/emailService';
; 
  // Register new user
  export const register = async (req: Request, res: Response)=> {
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

      const { name, email, password, phone } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'User with this email already exists'
        });
      }

      // Generate email verification token
      const emailVerificationToken = crypto.randomBytes(32).toString('hex');
      const emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

      // Create new user
      const user = new User({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        phone: phone?.trim(),
        password,
        emailVerificationToken,
        emailVerificationExpires
      });

      await user.save();

      // Create separate profile if using separate Profile model
      // Uncomment if you're using the separate Profile model from document 1
      /*
      const profile = new Profile({
        userId: user._id,
        content: {
          personalInfo: {
            name: user.name,
            email: user.email,
            phone: user.phone
          }
        }
      });
      await profile.save();
      */

      // Send verification email (implement this utility)
      try {
        await sendVerificationEmail(user.email, user.name, emailVerificationToken);
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
        // Don't fail registration if email fails
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

      // Remove sensitive data from response
      const userResponse = {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isEmailVerified: user.isEmailVerified,
        profileCompletion: user.profile?.profileCompletion || 0,
        createdAt: user.createdAt
      };

      res.status(201).json({
        success: true,
        message: 'User registered successfully. Please check your email to verify your account.',
        data: {
          user: userResponse,
          token
        }
      });

    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error during registration'
      });
    }
  }

  // Login user
  export const login = async (req:Request, res:Response)=> {
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

      const { email, password } = req.body;

      // Find user by email
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      // Check password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
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

      // Remove sensitive data from response
      const userResponse = {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isEmailVerified: user.isEmailVerified,
        profileCompletion: user.profile?.profileCompletion || 0,
        settings: user.settings,
        createdAt: user.createdAt
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
        await sendPasswordResetEmail(user.email, user.name, resetToken);
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
        await sendVerificationEmail(user.email, user.name, emailVerificationToken);
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
  export const verifyEmail = async (req:Request, res:Response)=> {
    try {
      const { token } = req.params;

      if (!token) {
        return res.status(400).json({
          success: false,
          message: 'Verification token is required'
        });
      }

      // Find user with valid verification token
      const user = await User.findOne({
        emailVerificationToken: token,
        emailVerificationExpires: { $gt: Date.now() }
      });

      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or expired verification token'
        });
      }

      // Update user verification status
      user.isEmailVerified = true;
      user.emailVerificationToken = undefined;
      user.emailVerificationExpires = undefined;
      await user.save();

      res.json({
        success: true,
        message: 'Email verified successfully'
      });

    } catch (error) {
      console.error('Email verification error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
