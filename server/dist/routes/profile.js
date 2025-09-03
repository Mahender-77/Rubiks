import express from "express";
import { body, validationResult } from "express-validator";
import Profile from "../models/Profile.js";
import User from "../models/User.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
const router = express.Router();
// Validation middleware for Express 5
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: "Validation error",
            errors: errors.array(),
        });
    }
    next();
};
// Build user response shape expected by the app (User + nested Profile)
const buildUserResponse = async (userId) => {
    const user = await User.findById(userId).select("-password");
    if (!user)
        return null;
    let profile = await Profile.findOne({ userId });
    if (!profile) {
        profile = new Profile({ userId });
        await profile.save();
    }
    return {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
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
};
// Helper to ensure a profile exists
const getOrCreateProfile = async (userId) => {
    let profile = await Profile.findOne({ userId });
    if (!profile) {
        profile = new Profile({ userId });
        await profile.save();
    }
    return profile;
};
// ----------- Get Profile -----------
router.get("/", authenticateToken, async (req, res, next) => {
    try {
        if (!req.user || !req.user.userId) {
            return res
                .status(401)
                .json({ success: false, message: "Unauthorized" });
        }
        const user = await buildUserResponse(req.user.userId);
        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: "User not found" });
        }
        res.json({ success: true, user });
    }
    catch (error) {
        console.error("Get profile error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});
// ----------- Update Avatar -----------
router.put("/avatar", authenticateToken, [
    body("avatar").notEmpty().withMessage("Avatar data is required"),
    handleValidationErrors,
], async (req, res, next) => {
    try {
        if (!req.user || !req.user.userId) {
            return res
                .status(401)
                .json({ success: false, message: "Unauthorized" });
        }
        const { avatar } = req.body;
        if (!avatar.startsWith("data:image/")) {
            return res
                .status(400)
                .json({ success: false, message: "Invalid image format" });
        }
        const profile = await getOrCreateProfile(req.user.userId);
        profile.avatar = avatar;
        await profile.save();
        const user = await buildUserResponse(req.user.userId);
        res.json({
            success: true,
            message: "Avatar updated successfully!",
            user,
        });
    }
    catch (error) {
        console.error("Update avatar error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});
// ----------- Update Basic Info -----------
router.put("/basic", authenticateToken, [
    body("headline").optional().trim().isLength({ max: 200 }),
    body("location").optional().trim(),
    body("bio").optional().trim().isLength({ max: 1000 }),
    handleValidationErrors,
], async (req, res, next) => {
    try {
        if (!req.user || !req.user.userId) {
            return res
                .status(401)
                .json({ success: false, message: "Unauthorized" });
        }
        const { headline, location, bio, skills, experience, education } = req.body;
        const profile = await getOrCreateProfile(req.user.userId);
        if (headline !== undefined)
            profile.headline = headline;
        if (location !== undefined)
            profile.location = location;
        if (bio !== undefined)
            profile.bio = bio;
        if (Array.isArray(skills))
            profile.skills = skills;
        if (Array.isArray(experience))
            profile.experience = experience;
        if (Array.isArray(education))
            profile.education = education;
        await profile.save();
        const user = await buildUserResponse(req.user.userId);
        res.json({
            success: true,
            message: "Basic info updated successfully!",
            user,
        });
    }
    catch (error) {
        console.error("Update basic info error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});
// ----------- Update Contact & Social Links -----------
router.put("/contact", authenticateToken, [
    body("name").optional().trim(),
    body("phone").optional().trim(),
    body("headline").optional().trim().isLength({ max: 200 }),
    body("location").optional().trim(),
    body("url")
        .optional()
        .trim()
        .isURL()
        .withMessage("URL must be a valid URL"),
    handleValidationErrors,
], async (req, res, next) => {
    try {
        if (!req.user || !req.user.userId) {
            return res
                .status(401)
                .json({ success: false, message: "Unauthorized" });
        }
        const { name, phone, headline, location, url, socialLinks } = req.body;
        // Update user details
        const userDoc = await User.findById(req.user.userId);
        if (!userDoc) {
            return res
                .status(404)
                .json({ success: false, message: "User not found" });
        }
        if (name !== undefined)
            userDoc.name = name;
        if (phone !== undefined)
            userDoc.phone = phone;
        await userDoc.save();
        // Update profile details
        const profile = await getOrCreateProfile(req.user.userId);
        if (headline !== undefined)
            profile.headline = headline;
        if (location !== undefined)
            profile.location = location;
        if (url !== undefined)
            profile.url = url;
        if (socialLinks)
            profile.socialLinks = { ...profile.socialLinks, ...socialLinks };
        await profile.save();
        const user = await buildUserResponse(req.user.userId);
        res.json({
            success: true,
            message: "Profile contact info updated!",
            user,
        });
    }
    catch (error) {
        console.error("Update profile info error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});
// ----------- Update Skills -----------
router.put("/skills", authenticateToken, [
    body("skills").isArray().withMessage("Skills must be an array"),
    handleValidationErrors,
], async (req, res, next) => {
    try {
        if (!req.user || !req.user.userId) {
            return res
                .status(401)
                .json({ success: false, message: "Unauthorized" });
        }
        const { skills } = req.body;
        const profile = await getOrCreateProfile(req.user.userId);
        profile.skills = skills;
        await profile.save();
        const user = await buildUserResponse(req.user.userId);
        res.json({
            success: true,
            message: "Skills updated successfully!",
            user,
        });
    }
    catch (error) {
        console.error("Update skills error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});
// ----------- Add Education -----------
router.post("/education", authenticateToken, [
    body("institution").notEmpty().withMessage("Institution is required"),
    body("degree").notEmpty().withMessage("Degree is required"),
    body("field").notEmpty().withMessage("Field is required"),
    body("startDate").notEmpty().withMessage("Start date is required"),
    handleValidationErrors,
], async (req, res, next) => {
    try {
        if (!req.user || !req.user.userId) {
            return res
                .status(401)
                .json({ success: false, message: "Unauthorized" });
        }
        const profile = await getOrCreateProfile(req.user.userId);
        profile.education = [...(profile.education ?? []), req.body];
        await profile.save();
        const user = await buildUserResponse(req.user.userId);
        res.json({
            success: true,
            message: "Education added successfully!",
            user,
        });
    }
    catch (error) {
        console.error("Add education error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});
// ----------- Add Experience -----------
router.post("/experience", authenticateToken, [
    body("title").notEmpty().withMessage("Title is required"),
    body("company").notEmpty().withMessage("Company is required"),
    body("startDate").notEmpty().withMessage("Start date is required"),
    body("description").notEmpty().withMessage("Description is required"),
    handleValidationErrors,
], async (req, res, next) => {
    try {
        if (!req.user || !req.user.userId) {
            return res
                .status(401)
                .json({ success: false, message: "Unauthorized" });
        }
        const profile = await getOrCreateProfile(req.user.userId);
        profile.experience = [...(profile.experience ?? []), req.body];
        await profile.save();
        const user = await buildUserResponse(req.user.userId);
        res.json({
            success: true,
            message: "Experience added successfully!",
            user,
        });
    }
    catch (error) {
        console.error("Add experience error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});
export default router;
