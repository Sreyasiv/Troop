// backend/routes/postRoutes.js
import express from "express";
import multer from "multer";
import mongoose from "mongoose";
import Post from "../models/PostSchema.js";
import User from "../models/UserSchema.js";
import { uploadToCloudinary } from "../cloudinary/cloudinary.js";
import  { verifyToken }  from "../middleware/verifyToken.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });


router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }).lean();
    const userIds = Array.from(new Set(posts.map(p => p.userId).filter(Boolean)));

    if (userIds.length === 0) {
      return res.json(posts.map(p => ({ ...p, user: null })));
    }

    const objectIdVals = userIds
      .filter(id => mongoose.Types.ObjectId.isValid(id))
      .map(id => mongoose.Types.ObjectId(id));
    const stringIds = userIds.filter(id => !mongoose.Types.ObjectId.isValid(id));

    const userQuery = { $or: [] };
    if (stringIds.length) userQuery.$or.push(
      { uid: { $in: stringIds } },
      { firebaseUid: { $in: stringIds } },
      { email: { $in: stringIds } }
    );
    if (objectIdVals.length) userQuery.$or.push({ _id: { $in: objectIdVals } });

    if (userQuery.$or.length === 0) userQuery.$or.push({ _id: null });

    const users = await User.find(userQuery, {
      username: 1, course: 1, profilePic: 1, uid: 1, firebaseUid: 1, email: 1
    }).lean();

    const userByUid = new Map();
    const userById = new Map();
    users.forEach(u => {
      if (u.uid) userByUid.set(String(u.uid), u);
      if (u.firebaseUid) userByUid.set(String(u.firebaseUid), u);
      if (u._id) userById.set(String(u._id), u);
    });

    const postsWithUser = posts.map(p => {
      const uidMatch = userByUid.get(String(p.userId));
      const idMatch = userById.get(String(p.userId));
      const user = uidMatch || idMatch || null;
      return {
        ...p,
        user: user ? {
          username: user.username,
          course: user.course,
          profilePic: user.profilePic,
          email: user.email
        } : null
      };
    });

    return res.json(postsWithUser);
  } catch (err) {
    console.error("Error fetching posts:", err);
    return res.status(500).json({ error: "Server error" });
  }
});


router.post("/", verifyToken, async (req, res) => {
  try {
    const { contentHtml, media } = req.body;
    const hasContent = contentHtml && contentHtml.trim().length > 0;
    const hasMedia = Array.isArray(media) && media.length > 0;
    if (!hasContent && !hasMedia) return res.status(400).json({ error: "Post must have content or media" });

    const newPost = await Post.create({
      userId: req.user.uid,
      contentHtml: contentHtml || "",
      media: hasMedia ? media : [],
    });

    // attach user for convenience
    const user = await User.findOne({
      $or: [
        { uid: req.user.uid },
        { firebaseUid: req.user.uid },
        ...(mongoose.Types.ObjectId.isValid(req.user.uid) ? [{ _id: mongoose.Types.ObjectId(req.user.uid) }] : [])
      ]
    }).lean();

    const payload = {
      ...(newPost.toObject ? newPost.toObject() : newPost),
      user: user ? {
        username: user.username,
        course: user.course,
        profilePic: user.profilePic,
        email: user.email
      } : null,
    };

    return res.status(201).json(payload);
  } catch (err) {
    console.error("Error creating post:", err);
    return res.status(500).json({ error: "Server error" });
  }
});


router.post(
  "/add",
  verifyToken,                 // verify token first
  upload.array("media", 5),    // then multer
  async (req, res) => {
    try {
      const { contentHtml: incomingHtml, title, description } = req.body;

      // Normalize contentHtml (same as before)
      let contentHtml = incomingHtml && String(incomingHtml).trim()
        ? String(incomingHtml).trim()
        : "";

      if (!contentHtml) {
        const parts = [];
        if (title) parts.push(`<h3>${String(title).trim()}</h3>`);
        if (description) parts.push(`<p>${String(description).trim()}</p>`);
        contentHtml = parts.join("\n");
      }

      // 🔽 Upload each file to Cloudinary
      let media = [];
      if (req.files && req.files.length > 0) {
        for (const file of req.files) {
          try {
            let uploadedUrl = await uploadToCloudinary(file.path, "posts");

            // Resize images only (skip for videos)
            if (file.mimetype.startsWith("image/")) {
              let resizedUrl = uploadedUrl.replace("/upload/", "/upload/w_600,h_400,c_fill/");
              media.push({ url: resizedUrl, type: "image", alt: title || "" });
            } else if (file.mimetype.startsWith("video/")) {
              media.push({ url: uploadedUrl, type: "video", alt: title || "" });
            }
          } catch (uploadErr) {
            console.error("Cloudinary upload failed:", uploadErr);
          }
        }
      }

      // Save post in DB
      const newPost = await Post.create({
        userId: req.user.uid,
        contentHtml,
        media,
      });

      // Attach user info (same as before)
      const user = await User.findOne({
        $or: [
          { uid: req.user.uid },
          { firebaseUid: req.user.uid },
          {
            _id: mongoose.Types.ObjectId.isValid(req.user.uid)
              ? req.user.uid
              : null,
          },
        ],
      }).lean();

      const payload = {
        ...newPost.toObject ? newPost.toObject() : newPost,
        user: user
          ? {
              username: user.username,
              course: user.course,
              profilePic: user.profilePic,
              email: user.email,
            }
          : null,
      };

      return res
        .status(201)
        .json({ message: "Post created successfully", post: payload });
    } catch (err) {
      console.error("Error creating multipart post (/add):", err);
      return res
        .status(500)
        .json({ error: "Server error while creating post" });
    }
  }
);
    
  ;

export default router;
