// userRoutes.js
import express from "express";
import multer from "multer";

import User from "../models/UserSchema.js";
import { uploadToCloudinary } from "../cloudinary/cloudinary.js";



const router = express.Router();
const upload = multer({ dest: "uploads/" }); 


async function uidFromAuthHeader(req) {
  try {
    const auth = req.headers.authorization || "";
    if (!auth.startsWith("Bearer ")) return null;
    const idToken = auth.split(" ")[1];
    if (!idToken) return null;


    if (typeof admin === "undefined") return null;

    const decoded = await admin.auth().verifyIdToken(idToken);
    return decoded?.uid ?? null;
  } catch (err) {
    return null;
  }
}

router.get("/check-username/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    return res.json({ available: !user });
  } catch (error) {
    console.error("Error checking username:", error);
    return res.status(500).json({ error: "Server error" });
  }
});

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

    let { course = "", bio = "", ownsBusiness = false } = req.body;
    let { clubs } = req.body;

    if (typeof ownsBusiness === "string") {
      ownsBusiness = ownsBusiness === "true" || ownsBusiness === "yes";
    } else {
      ownsBusiness = Boolean(ownsBusiness);
    }

    if (!clubs) clubs = [];
    else if (typeof clubs === "string") clubs = [clubs];
    else if (Array.isArray(clubs)) clubs = clubs;

    let profilePicUrl = "";
    if (req.file) {
      profilePicUrl = await uploadToCloudinary(req.file.path, "profile_pics");
    }

    const updates = {
      course,
      clubs,
      bio,
      ownsBusiness,
      step: 3,
      ...(profilePicUrl && { profilePic: profilePicUrl }),
    };

    if (!ownsBusiness) {
      updates.isSetupComplete = true;
    } else {
      updates.isSetupComplete = false;
    }

    const user = await User.findOneAndUpdate({ uid }, updates, { new: true });
    if (!user) return res.status(404).json({ error: "User not found" });

    return res.json({
      message: "Setup saved",
      user,
      next: ownsBusiness ? "business" : "done",
    });
  } catch (error) {
    console.error("Error in setup route:", error);
    return res.status(500).json({ error: "Could not update setup" });
  }
});

router.post("/upload-logo/:uid", upload.single("logo"), async (req, res) => {
  try {
    const { uid } = req.params;
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const url = await uploadToCloudinary(req.file.path, "business_logos");

    const user = await User.findOne({ uid });
    if (!user) return res.status(404).json({ error: "User not found" });

    const updateObj = user.ownsBusiness ? { "business.logo": url } : { profilePic: url };

    const updatedUser = await User.findOneAndUpdate({ uid }, { $set: updateObj }, { new: true });

    return res.status(200).json({ url, user: updatedUser });
  } catch (err) {
    console.error("Logo upload error:", err);
    return res.status(500).json({ error: "Logo upload failed" });
  }
});

// PATCH /business/:uid — update and also return business explicitly
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

    // Ensure business object contains ownerUid for frontend convenience
    const businessWithOwner = {
      ...(updatedUser.business || {}),
      ownerUid: updatedUser.uid ?? updatedUser._id,
    };

    return res.json({ message: "Business setup completed", user: updatedUser, business: businessWithOwner });
  } catch (error) {
    console.error("Error updating business:", error);
    return res.status(500).json({ error: "Could not update business" });
  }
});

// GET /businesses — include tagline in response cards and ensure consistent ownerUid/id
router.get("/businesses", async (req, res) => {
  try {
    const businesses = await User.find(
      { ownsBusiness: true, "business.name": { $exists: true, $ne: "" } },
      {
        "business.name": 1,
        "business.logo": 1,
        "business.tagline": 1,
        "business.whatsapp": 1,
        "business.instagram": 1,
        uid: 1,
        _id: 1,
      }
    )
      .lean()
      .exec();

    const cards = businesses.map((u) => {
      const b = u.business || {};
      const ownerId = u.uid ?? u._id;
      return {
        id: ownerId,                
        ownerUid: ownerId,
        name: b.name ?? "Unnamed Business",
        tagline: b.tagline || "",
        image:
          b.logo && b.logo.length > 0
            ? b.logo
            : "https://via.placeholder.com/600x400?text=Business+Logo",
        whatsapp: b.whatsapp || "#",
        instagram: b.instagram || "#",
      };
    });

    return res.json({ businesses: cards });
  } catch (err) {
    console.error("GET /businesses error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// GET /profile — returns user and business (business.ownerUid ensured)
router.get("/profile", async (req, res) => {
  try {
    const tokenUid = await uidFromAuthHeader(req);
    const uid = tokenUid || req.query.uid || null;

    if (!uid) {
      return res.status(400).json({ error: "uid query param required or provide Authorization Bearer token" });
    }

    let user = await User.findOne({ uid }).lean();

    if (!user && /^[0-9a-fA-F]{24}$/.test(uid)) {
      user = await User.findById(uid).lean();
    }

    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.business) {
      user.business.ownerUid = user.uid ?? user._id;
    }

    return res.json({ user, business: user.business ?? null });
  } catch (err) {
    console.error("GET /profile error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

router.get("/progress/:uid", async (req, res) => {
  try {
    const { uid } = req.params;
    let user = await User.findOne({ uid }).lean();

    if (!user && /^[0-9a-fA-F]{24}$/.test(uid)) {
      user = await User.findById(uid).lean();
    }

    if (!user) return res.status(404).json({ message: "User not found" });

    return res.json({
      step: user.step ?? null,
      ownsBusiness: user.ownsBusiness ?? false,
      uid: user.uid ?? user._id,
      raw: user,
    });
  } catch (err) {
    console.error("GET /progress/:uid error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

router.get("/by-email", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: "email is required" });

    const user = await User.findOne({ email }).lean();
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.json({
      step: user.step ?? null,
      ownsBusiness: user.ownsBusiness ?? false,
      uid: user.uid ?? user._id,
      raw: user,
    });
  } catch (err) {
    console.error("GET /by-email error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});


export default router;
