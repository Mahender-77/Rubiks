import jwt from "jsonwebtoken";

import User from "../models/User.js"; // Assuming User model is defined in models/User.ts

import { Request, Response, NextFunction } from "express";

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        user: any; // you can replace `any` with Document & IUser if you have the interface
      };
    }
  }
}


// ✅ Auth middleware
export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ success: false, message: "Access token is required" });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return res.status(500).json({ success: false, message: "JWT secret not configured" });
    }

    const decoded = jwt.verify(token, jwtSecret) as { userId: string; email: string };
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    // ✅ Attach both decoded info + user doc
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      user: user,
    };

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

// ✅ Role middleware
export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.user?.role !== "admin") {
    return res.status(403).json({ success: false, message: "Forbidden: Admin access required" });
  }
  next();
};

// ✅ Optional email verification check
export const requireEmailVerification = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user?.user) {
    return res.status(401).json({ success: false, message: "Authentication required" });
  }

  if (!req.user.user.isEmailVerified) {
    return res.status(403).json({ success: false, message: "Email not verified" });

  }

  next();
};
