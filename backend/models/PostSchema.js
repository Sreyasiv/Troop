
import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema({
  url: { type: String, required: true },
  type: { type: String, enum: ["image", "video"], default: "image" },
  alt: { type: String, default: "" }
}, { _id: false });

const attachmentSchema = new mongoose.Schema({
  url: { type: String, required: true },
  filename: { type: String },
  mimeType: { type: String },
  size: { type: Number }
}, { _id: false });

const postSchema = new mongoose.Schema({
  userId: { type: String, required: true },       // Firebase UID
  contentHtml: { type: String, default: "" },     
  media: { type: [mediaSchema], default: [] },   
  attachments: { type: [attachmentSchema], default: [] },
  community: { type: String, enum: ["lounge","learn","market-explore","club-buzz"], default: "lounge" },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model("Post", postSchema);
