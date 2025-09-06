// backend/cloudinary/cloudinary.js
import dotenv from "dotenv";
dotenv.config();

import cloudinary from "cloudinary";
import fs from "fs";

const CLOUD_NAME = process.env.CLOUDINARY_NAME;
const API_KEY = process.env.CLOUDINARY_KEY;
const API_SECRET = process.env.CLOUDINARY_SECRET;

if (CLOUD_NAME && API_KEY && API_SECRET) {
  cloudinary.v2.config({
    cloud_name: CLOUD_NAME,
    api_key: API_KEY,
    api_secret: API_SECRET,
    secure: true,
  });
  console.info("Cloudinary: configured.");
} else {
  console.warn("Cloudinary: missing credentials. Set CLOUDINARY_NAME, CLOUDINARY_KEY, CLOUDINARY_SECRET in backend .env");
}

export const uploadToCloudinary = async (filePath, folder = "troop") => {
  if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
    try { fs.unlinkSync(filePath); } catch (e) {}
    throw new Error("Cloudinary not configured. Set CLOUDINARY_NAME, CLOUDINARY_KEY, CLOUDINARY_SECRET in backend .env");
  }

  try {
    const res = await cloudinary.v2.uploader.upload(filePath, {
      folder,
      use_filename: true,
      unique_filename: false,
      overwrite: false,
    });
    // cleanup temp file
    fs.unlink(filePath, (err) => { if (err) console.warn("Failed to unlink temp file:", err); });
    return res.secure_url;
  } catch (err) {
    try { fs.unlinkSync(filePath); } catch (e) {}
    console.error("Cloudinary upload error:", err.message || err);
    throw err;
  }
};
