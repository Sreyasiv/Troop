
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

export const uploadToCloudinary = async (filePath, folder = "posts") => {
  try {
    const res = await cloudinary.v2.uploader.upload(filePath, {
      folder,
      resource_type: "auto",   
      use_filename: true,
      unique_filename: false,
    });


    fs.unlink(filePath, (err) => {
      if (err) console.warn("Temp file cleanup failed:", err);
    });

    return res.secure_url;
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    try { fs.unlinkSync(filePath); } catch {}
    throw err;
  }
};