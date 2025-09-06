import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true }, // Firebase UID
  email: { type: String, required: true, unique: true },
  username: { type: String, unique: true },
  course: { type: String },
  clubs: { type: [String], default: [] },
  bio: { type: String },
  profilePic: { type: String },
  ownsBusiness: { type: Boolean, default: false },
  business: {
    name: String,
    tagline: String,
    logo: String,
    whatsapp: String,
    instagram: String,
  },
  step: { type: Number, default: 2 }, // Start after Firebase signup
  isSetupComplete: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model("User", userSchema);
