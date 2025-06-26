const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const Post = require('../models/PostSchema');
const { uploadToCloudinary } = require('../cloudinary/cloudinary');

// Multer stores file temporarily in 'uploads/' folder
const upload = multer({ dest: 'uploads/' });

router.post('/add', upload.single('picture'), async (req, res) => {
  const { title, description, links } = req.body;

  if (!title || !description) {
    return res.status(400).json({ error: "Title and description are required." });
  }

  let imageUrl = '';

  try {
    // Upload image to Cloudinary if picture is included
    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.path);

      // Delete the local file after upload
      fs.unlink(req.file.path, (err) => {
        if (err) {
          console.error('Error deleting file:', err);
        }
      });
    }

    // Create new post
    const newPost = new Post({
      title,
      description,
      picture: imageUrl,
      links: links ? (Array.isArray(links) ? links : [links]) : [],
    });

    await newPost.save();

    res.status(201).json({ message: 'Post created successfully', post: newPost });
  } catch (err) {
    console.error('Error creating post:', err);
    res.status(500).json({ error: 'Server error while creating post' });
  }
});


router.get('/get', async (req, res) => {
  try {
    const posts = await Post.find().sort({createdAt:-1}).limit(10);
    res.status(200).json(posts);
  } catch (err) {
    console.error('Error fetching posts:', err);
    res.status(500).json({ error: 'Server error while fetching posts' });
  }
});

router.put('/update/:id', upload.single('picture'), async (req, res) => {
  const { title, description, links } = req.body;
  const { id } = req.params;

  try {
    const updateData = {
      ...(title && { title }),
      ...(description && { description }),
      ...(links && { links: Array.isArray(links) ? links : [links] }),
    };

    if (req.file) {
      const imageUrl = await uploadToCloudinary(req.file.path);
      updateData.picture = imageUrl;

      // Delete local file after upload
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }

    const updatedPost = await Post.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedPost) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.status(200).json({ message: 'Post updated successfully', post: updatedPost });
  } catch (err) {
    console.error('Error updating post:', err);
    res.status(500).json({ error: 'Server error while updating post' });
  }
});



module.exports = router;
