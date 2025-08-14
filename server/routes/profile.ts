import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import Profile, { IProfile } from '../models/Profile'; // Ensure Profile model exports IProfile interface
import User, { IUser } from '../models/User'; // Ensure User model exports IUser interface

const router = express.Router();

// Extend Express Request interface to add user property
declare global {
  namespace Express {
    interface Request {
      user?: IUser & { _id: any };
    }
  }
}

// ----------- Middleware: JWT Auth -----------

const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ success: false, message: 'No token provided' });

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ success: false, message: 'No token provided' });

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ success: false, message: 'JWT secret not configured' });
    }

    const decoded = jwt.verify(token, secret) as { userId: string };
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

// ----------- Helper: Get or Create Profile -----------

const getOrCreateProfile = async (userId: string) => {
  let profile = await Profile.findOne({ userId });
  if (!profile) {
    profile = new Profile({ userId });
    await profile.save();
  }
  return profile;
};

// ----------- Get Profile -----------

router.get('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const profile = await getOrCreateProfile(req.user._id.toString());
    res.json({ success: true, profile });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ----------- Update Avatar -----------

router.put(
  '/avatar',
  authenticateToken,
  body('avatar').notEmpty().withMessage('Avatar data is required'),
  async (req: Request, res: Response) => {
    try {
      if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });

      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(400).json({ success: false, message: errors.array()[0].msg });

      const { avatar } = req.body;
      if (!avatar.startsWith('data:image/'))
        return res.status(400).json({ success: false, message: 'Invalid image format' });

      const profile = await getOrCreateProfile(req.user._id.toString());
      profile.avatar = avatar;
      await profile.save();

      res.json({ success: true, message: 'Avatar updated successfully!', profile });
    } catch (error) {
      console.error('Update avatar error:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
);

// ----------- Update Basic Info -----------

router.put(
  '/basic',
  authenticateToken,
  body('headline').optional().trim().isLength({ max: 200 }),
  body('location').optional().trim(),
  body('bio').optional().trim().isLength({ max: 1000 }),
  async (req: Request, res: Response) => {
    try {
      if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });

      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(400).json({ success: false, message: errors.array()[0].msg });

      const { headline, location, bio } = req.body;
      const profile = await getOrCreateProfile(req.user._id.toString());

      if (headline !== undefined) profile.headline = headline;
      if (location !== undefined) profile.location = location;
      if (bio !== undefined) profile.bio = bio;

      await profile.save();
      res.json({ success: true, message: 'Basic info updated successfully!', profile });
    } catch (error) {
      console.error('Update basic info error:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
);

// ----------- Update Contact & Social Links -----------

router.put(
  '/contact',
  authenticateToken,
  body('name').optional().trim(),
  body('phone').optional().trim(),
  body('headline').optional().trim().isLength({ max: 200 }),
  body('location').optional().trim(),
  body('url').optional().trim().isURL().withMessage('URL must be a valid URL'),
  async (req: Request, res: Response) => {
    try {
      if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });

      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(400).json({ success: false, message: errors.array()[0].msg });

      const { name, phone, headline, location, url, socialLinks } = req.body;

      // Update user details
      if (name !== undefined) req.user.name = name;
      if (phone !== undefined) req.user.phone = phone;
      await req.user.save();

      // Update profile details
      const profile = await getOrCreateProfile(req.user._id.toString());
      if (headline !== undefined) profile.headline = headline;
      if (location !== undefined) profile.location = location;
      if (url !== undefined) profile.url = url;
      if (socialLinks) profile.socialLinks = { ...profile.socialLinks, ...socialLinks };

      await profile.save();
      res.json({ success: true, message: 'Profile contact info updated!', profile });
    } catch (error) {
      console.error('Update profile info error:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
);

// ----------- Update Skills -----------

router.put(
  '/skills',
  authenticateToken,
  body('skills').isArray().withMessage('Skills must be an array'),
  async (req: Request, res: Response) => {
    try {
      if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });

      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(400).json({ success: false, message: errors.array()[0].msg });

      const { skills } = req.body;
      const profile = await getOrCreateProfile(req.user._id.toString());
      profile.skills = skills;
      await profile.save();

      res.json({ success: true, message: 'Skills updated successfully!', profile });
    } catch (error) {
      console.error('Update skills error:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
);

// ----------- Add Education -----------

router.post(
  '/education',
  authenticateToken,
  body('institution').notEmpty().withMessage('Institution is required'),
  body('degree').notEmpty().withMessage('Degree is required'),
  body('field').notEmpty().withMessage('Field is required'),
  body('startDate').notEmpty().withMessage('Start date is required'),
  async (req: Request, res: Response) => {
    try {
      if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });

      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(400).json({ success: false, message: errors.array()[0].msg });

      const profile = await getOrCreateProfile(req.user._id.toString());
      profile.education.push(req.body);
      await profile.save();

      res.json({ success: true, message: 'Education added successfully!', profile });
    } catch (error) {
      console.error('Add education error:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
);

// ----------- Add Experience -----------

router.post(
  '/experience',
  authenticateToken,
  body('title').notEmpty().withMessage('Title is required'),
  body('company').notEmpty().withMessage('Company is required'),
  body('startDate').notEmpty().withMessage('Start date is required'),
  body('description').notEmpty().withMessage('Description is required'),
  async (req: Request, res: Response) => {
    try {
      if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });

      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(400).json({ success: false, message: errors.array()[0].msg });

      const profile = await getOrCreateProfile(req.user._id.toString());
      profile.experience.push(req.body);
      await profile.save();

      res.json({ success: true, message: 'Experience added successfully!', profile });
    } catch (error) {
      console.error('Add experience error:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
);

export default router;
