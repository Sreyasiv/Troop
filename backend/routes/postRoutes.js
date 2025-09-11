// backend/routes/postRoutes.js
import express from "express";
import multer from "multer";
import mongoose from "mongoose";
import fs from "fs";
import Post from "../models/PostSchema.js";
import User from "../models/UserSchema.js";
import { uploadToCloudinary } from "../cloudinary/cloudinary.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// GET /api/posts?community=...
router.get("/", async (req, res) => {
  try {
    const q = req.query.community;
    const filter = {};
    if (q && q !== "all") filter.community = q;
    const posts = await Post.find(filter).sort({ createdAt: -1 }).lean();
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

// POST /api/posts  (JSON) - stores community for text-only posts
router.post("/", verifyToken, async (req, res) => {
  try {
    // debug log (optional) - remove when stable
    console.log(">>> SERVER: POST /api/posts body:", JSON.stringify(req.body));

    const { contentHtml, media, community: rawCommunity } = req.body;
    const community = String((rawCommunity || "lounge")).toLowerCase();
    const allowedCommunities = ["lounge", "learn", "market-explore","club-buzz"];
    if (!allowedCommunities.includes(community)) {
      return res.status(400).json({ error: "Invalid community" });
    }

    const hasContent = contentHtml && contentHtml.trim().length > 0;
    const hasMedia = Array.isArray(media) && media.length > 0;
    if (!hasContent && !hasMedia) return res.status(400).json({ error: "Post must have content or media" });

    const newPost = await Post.create({
      userId: req.user.uid,
      contentHtml: contentHtml || "",
      media: hasMedia ? media : [],
      community,
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

    console.log(">>> SERVER: Created post with community:", community, "id:", newPost._id);
    return res.status(201).json(payload);
  } catch (err) {
    console.error("Error creating post:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// POST /api/posts/add  (multipart, files)
router.post(
  "/add",
  verifyToken,
  upload.any(),
  async (req, res) => {
    try {
      const { contentHtml: incomingHtml, title, description, community: rawCommunity } = req.body;

      // normalize community
      const community = String((rawCommunity || "lounge")).toLowerCase();
      const allowedCommunities = ["lounge", "learn", "market-explore","club-buzz"];
      if (!allowedCommunities.includes(community)) {
        return res.status(400).json({ error: "Invalid community" });
      }

      // Normalize contentHtml
      let contentHtml = incomingHtml && String(incomingHtml).trim()
        ? String(incomingHtml).trim()
        : "";

      if (!contentHtml) {
        const parts = [];
        if (title) parts.push(`<h3>${String(title).trim()}</h3>`);
        if (description) parts.push(`<p>${String(description).trim()}</p>`);
        contentHtml = parts.join("\n");
      }

      const files = Array.isArray(req.files) ? req.files : [];
      const MAX_FILES = 5;
      if (files.length > MAX_FILES) {
        return res.status(400).json({ error: `Max ${MAX_FILES} files allowed` });
      }

      const imageMime = /^image\//;
      const videoMime = /^video\//;
      const docMimes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ];

      let media = [];
      let attachments = [];

      const uploadAndCleanup = async (file, folder) => {
        const uploadedUrl = await uploadToCloudinary(file.path, `posts/${folder}`);
        try { fs.unlinkSync(file.path); } catch (e) { /* ignore */ }
        return {
          url: uploadedUrl,
          filename: file.originalname,
          mimeType: file.mimetype,
          size: file.size
        };
      };

      for (const file of files) {
        try {
          if (community === "learn") {
            if (imageMime.test(file.mimetype) || docMimes.includes(file.mimetype)) {
              const up = await uploadAndCleanup(file, "learn");
              attachments.push(up);
              if (imageMime.test(file.mimetype)) {
                const resized = up.url.replace("/upload/", "/upload/w_600,h_400,c_fill/");
                media.push({ url: resized, type: "image", alt: up.filename || "" });
              }
            } else {
              try { fs.unlinkSync(file.path); } catch (e) { /* ignore */ }
            }
          } else {
            if (imageMime.test(file.mimetype)) {
              const up = await uploadAndCleanup(file, community);
              const resized = up.url.replace("/upload/", "/upload/w_600,h_400,c_fill/");
              media.push({ url: resized, type: "image", alt: up.filename || "" });
            } else if (videoMime.test(file.mimetype)) {
              const up = await uploadAndCleanup(file, community);
              media.push({ url: up.url, type: "video", alt: up.filename || "" });
            } else {
              try { fs.unlinkSync(file.path); } catch (e) { /* ignore */ }
            }
          }
        } catch (upErr) {
          console.error("Cloudinary upload failed:", upErr);
          try { fs.unlinkSync(file.path); } catch (e) { /* ignore */ }
        }
      }

      const hasContent = contentHtml && contentHtml.trim().length > 0;
      const hasAnyFile = media.length > 0 || attachments.length > 0;
      if (!hasContent && !hasAnyFile) {
        return res.status(400).json({ error: "Post must have content or attachments/media" });
      }

      const newPost = await Post.create({
        userId: req.user.uid,
        contentHtml,
        media,
        attachments,
        community
      });

      const user = await User.findOne({
        $or: [
          { uid: req.user.uid },
          { firebaseUid: req.user.uid },
          ...(mongoose.Types.ObjectId.isValid(req.user.uid) ? [{ _id: mongoose.Types.ObjectId(req.user.uid) }] : [])
        ],
      }).lean();

      const payload = {
        ...(newPost.toObject ? newPost.toObject() : newPost),
        user: user
          ? {
              username: user.username,
              course: user.course,
              profilePic: user.profilePic,
              email: user.email,
            }
          : null,
      };

      return res.status(201).json({ message: "Post created successfully", post: payload });
    } catch (err) {
      console.error("Error creating multipart post (/add):", err);
      return res.status(500).json({ error: "Server error while creating post" });
    }
  }
);

export default router;
