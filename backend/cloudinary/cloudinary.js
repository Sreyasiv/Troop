
const { v2: cloudinary } = require('cloudinary');

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload Function (from buffer)
// Function to upload file from path (Multer needs to save to disk for this)
const uploadToCloudinary = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath);
    return result.secure_url;
  } catch (err) {
    throw err;
  }
};

module.exports = { uploadToCloudinary };
