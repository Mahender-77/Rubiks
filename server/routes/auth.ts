
import express from 'express';
import {body,param} from 'express-validator';
import {
  login,
  register,
  forgotPassword,
  resetPassword,
  resendVerification,
  verifyEmail,
 

} from '../controllers/authController';
import { authenticateToken } from '../middleware/authMiddleware';
import { Request,Response } from 'express';


const router = express.Router();

// Login route
router.post('/login', 
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password is required')
  ], 
  login
);

// Register route
router.post('/register', 
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('phone').optional().trim()
  ],
  register
);

// Forgot password route
router.post('/forgot-password',
  [body('email').isEmail().withMessage('Valid email required')],
forgotPassword
);

// Reset password route
router.post('/reset-password',
  [
    body('token').notEmpty().withMessage('Reset token is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ],
  resetPassword
);

// Resend verification email route
router.post('/resend-verification',
  [body('email').isEmail().withMessage('Valid email required')],
 resendVerification
);

// Verify email route
router.get('/verify-email/:token',
  [param('token').notEmpty().withMessage('Verification token is required')],
 verifyEmail
);

// Get current user (protected route)
router.get('/me', authenticateToken, async (req, res) => {
  try {
    if (!req.user || !req.user.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: User not found'
      });
    }
    res.json({
      success: true,
      data: {
        user: {
          id: req.user.user._id,
          name: req.user.user.name,
          email: req.user.user.email,
          phone: req.user.user.phone,
          isEmailVerified: req.user.user.isEmailVerified,
          profileCompletion: req.user.user.profile?.profileCompletion || 0,
          settings: req.user.user.settings,
          createdAt: req.user.user.createdAt
        }
      }
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Logout route (optional - mainly for client-side token cleanup)
router.post('/logout', authenticateToken, (req, res) => {
  // In a stateless JWT system, logout is mainly handled client-side
  // You might want to implement a token blacklist here if needed
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

// Change password (protected route)
router.put('/change-password',
  [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
  ],
  authenticateToken,
  async (req : Request, res : Response ) => {
    try {
      const { currentPassword, newPassword } = req.body;
      if (!req.user || !req.user.userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized: User not found'
        });
      }
      const userId = req.user.userId;

      const User = require('../models/User');
      const user = await User.findById(userId);

      // Verify current password
      const isCurrentPasswordValid = await user.comparePassword(currentPassword);
      if (!isCurrentPasswordValid) {
        return res.status(400).json({
          success: false,
          message: 'Current password is incorrect'
        });
      }

      // Update password
      user.password = newPassword;
      await user.save();

      res.json({
        success: true,
        message: 'Password changed successfully'
      });

    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
);

export default router;