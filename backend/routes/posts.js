import express from "express";
import multer from "multer";
import fs from "fs";
import Post from "../models/PostSchema.js";
import { uploadToCloudinary } from "../cloudinary/cloudinary.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Create Post
router.post("/add", upload.single("picture"), async (req, res) => {
  const { title, description, links } = req.body;
  if (!title || !description) {
    return res.status(400).json({ error: "Title and description are required." });
  }

  let imageUrl = "";
  try {
    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.path, "posts");
      fs.unlink(req.file.path, () => {});
    }

    const newPost = new Post({
      title,
      description,
      picture: imageUrl,
      links: links ? (Array.isArray(links) ? links : [links]) : [],
    });

    await newPost.save();
    res.status(201).json({ message: "Post created successfully", post: newPost });
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).json({ error: "Server error while creating post" });
  }
});

export default router;
