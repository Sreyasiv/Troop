// backend/models/Post.js
import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema({
  url: { type: String, required: true },
  type: { type: String, enum: ["image", "video"], default: "image" },
  alt: { type: String, default: "" }
}, { _id: false });

const postSchema = new mongoose.Schema({
  userId: { type: String, required: true },       // firebase uid
  contentHtml: { type: String, default: "" },     // rich HTML from editor
  media: { type: [mediaSchema], default: [] },    // array of {url, type}
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model("Post", postSchema);
