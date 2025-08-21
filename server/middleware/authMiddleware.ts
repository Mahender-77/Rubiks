import jwt from "jsonwebtoken";
import User from "../models/User.js"; // Assuming User model is defined in models/User.ts
import { Request, Response, NextFunction } from "express";

// Extend Express Request interface to include 'user'
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        user: any;
      };
    }
  }
}

// Main authentication middleware
export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get token from header
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access token is required",
      });
    }

    // Verify token
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return res.status(500).json({
        success: false,
        message: "JWT secret is not configured",
      });
    }
    const decoded = jwt.verify(token, jwtSecret) as {
      userId: string;
      email: string;
    };

    // Check if user still exists
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // Add user info to request object
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      user: user,
    };

    next();
  } catch (error) {
    if (typeof error === "object" && error !== null && "name" in error) {
      if ((error as { name: string }).name === "JsonWebTokenError") {
        return res.status(401).json({
          success: false,
          message: "Invalid token",
        });
      }

      if ((error as { name: string }).name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "Token expired",
        });
      }
    }

    console.error("Auth middleware error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Optional middleware to check if email is verified
export const requireEmailVerification = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user || !req.user.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  if (!req.user.user.isEmailVerified) {
    return res.status(403).json({
      success: false,
      message: "Email not verified",
    });
  }

  next();
};
