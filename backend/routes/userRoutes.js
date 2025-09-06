// backend/routes/userRoutes.js
import express from "express";
import multer from "multer";
import fs from "fs";
import User from "../models/UserSchema.js";
import { uploadToCloudinary } from "../cloudinary/cloudinary.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" }); // temp storage for multer

// -------------------------
// GET /api/users/check-username/:username
// -------------------------
router.get("/check-username/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    return res.json({ available: !user });
  } catch (error) {
    console.error("Error checking username:", error);
    return res.status(500).json({ error: "Server error" });
  }
});

// -------------------------
// POST /api/users   (Create full user directly — optional)
// body: { uid, email, username }
// -------------------------
router.post("/", async (req, res) => {
  try {
    const { uid, email, username } = req.body;
    if (!uid || !email || !username) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const existing = await User.findOne({ $or: [{ uid }, { email }, { username }] });
    if (existing) {
      return res.status(400).json({ error: "User with given uid/email/username already exists" });
    }

    const user = new User({ uid, email, username });
    await user.save();
    return res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ error: "Could not create user" });
  }
});

// -------------------------
// POST /api/users/draft (Step 2 -> Firebase signup only)
// body: { uid, email, username }
// -------------------------
router.post("/draft", async (req, res) => {
  try {
    const { uid, email, username } = req.body;
    if (!uid || !email || !username) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const existing = await User.findOne({ $or: [{ uid }, { email }, { username }] });
    if (existing) {
      return res.status(400).json({ error: "User with given uid/email/username already exists" });
    }

    const user = new User({
      uid,
      email,
      username,
      step: 2,
      isSetupComplete: false,
    });

    await user.save();
    return res.status(201).json({ message: "Draft user created", user });
  } catch (error) {
    console.error("Error creating draft user:", error);
    return res.status(500).json({ error: "Could not create draft user" });
  }
});

// -------------------------
// PATCH /api/users/profile/:uid (Step 3 -> Profile setup - JSON variant)
// body: { username, course, bio, profilePic, clubs }
// -------------------------
router.patch("/profile/:uid", async (req, res) => {
  try {
    const { uid } = req.params;
    const { username, course, bio, profilePic, clubs } = req.body;

    const updatedUser = await User.findOneAndUpdate(
      { uid },
      { username, course, bio, profilePic, clubs, step: 3 },
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ error: "User not found" });

    return res.json({ message: "Profile setup completed", user: updatedUser });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({ error: "Could not update profile" });
  }
});

router.put("/setup/:uid", upload.single("profilePic"), async (req, res) => {
  try {
    const { uid } = req.params;

    // text fields
    let { course = "", bio = "", ownsBusiness = false } = req.body;
    let { clubs } = req.body;

    // normalize ownsBusiness
    if (typeof ownsBusiness === "string") {
      ownsBusiness = ownsBusiness === "true" || ownsBusiness === "yes";
    } else {
      ownsBusiness = Boolean(ownsBusiness);
    }

    // normalize clubs
    if (!clubs) clubs = [];
    else if (typeof clubs === "string") clubs = [clubs];
    else if (Array.isArray(clubs)) clubs = clubs;

    // handle file upload
    let profilePicUrl = "";
    if (req.file) {
      profilePicUrl = await uploadToCloudinary(req.file.path, "profile_pics");
    }

    // Build updates
    const updates = {
      course,
      clubs,
      bio,
      ownsBusiness,
      step: 3,
      ...(profilePicUrl && { profilePic: profilePicUrl }),
    };

    // If user does NOT own business, mark setup complete
    if (!ownsBusiness) {
      updates.isSetupComplete = true;
    } else {
      // ensure isSetupComplete remains false (frontend will handle business flow)
      updates.isSetupComplete = false;
    }

    const user = await User.findOneAndUpdate({ uid }, updates, { new: true });
    if (!user) return res.status(404).json({ error: "User not found" });

    // Return the updated user and a flag to the frontend
    return res.json({
      message: "Setup saved",
      user,
      next: ownsBusiness ? "business" : "done", // helpful hint for frontend
    });
  } catch (error) {
    console.error("Error in setup route:", error);
    return res.status(500).json({ error: "Could not update setup" });
  }
});



// -------------------------
// POST /api/users/upload-logo/:uid (multipart/form-data: file field name = "logo")
// -------------------------
// POST /api/users/upload-logo/:uid
// POST /api/users/upload-logo/:uid
router.post("/upload-logo/:uid", upload.single("logo"), async (req, res) => {
  try {
    const { uid } = req.params;
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    // upload to cloudinary
    const url = await uploadToCloudinary(req.file.path, "business_logos");

    // update user's business.logo if a business object exists, otherwise set profilePic
    const user = await User.findOne({ uid });
    if (!user) return res.status(404).json({ error: "User not found" });

    // If the request came from business flow, we expect client to set a flag or call /business afterwards.
    // For general use, update business.logo if ownsBusiness true, else update profilePic.
    const updateObj = user.ownsBusiness ? { "business.logo": url } : { profilePic: url };

    const updatedUser = await User.findOneAndUpdate({ uid }, { $set: updateObj }, { new: true });

    return res.status(200).json({ url, user: updatedUser });
  } catch (err) {
    console.error("Logo upload error:", err);
    return res.status(500).json({ error: "Logo upload failed" });
  }
});



// -------------------------
// PATCH /api/users/business/:uid (Step 4 -> Business setup)
// body: { name, tagline, logo, whatsapp, instagram }
// -------------------------
// PATCH /api/users/business/:uid
// body: { name, tagline, logo, whatsapp, instagram }
// PATCH /api/users/business/:uid
// body: { name, tagline, logo, whatsapp, instagram }
router.patch("/business/:uid", async (req, res) => {
  try {
    const { uid } = req.params;
    const { name, tagline, logo, whatsapp, instagram } = req.body;

    const updates = {
      ownsBusiness: true,
      business: { name, tagline, logo, whatsapp, instagram },
      step: 4,
      isSetupComplete: true,
    };

    const updatedUser = await User.findOneAndUpdate({ uid }, { $set: updates }, { new: true });

    if (!updatedUser) return res.status(404).json({ error: "User not found" });

    return res.json({ message: "Business setup completed", user: updatedUser });
  } catch (error) {
    console.error("Error updating business:", error);
    return res.status(500).json({ error: "Could not update business" });
  }
});



export default router;
