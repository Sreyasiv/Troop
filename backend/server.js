import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import compaRoutes from "./routes/compaRoutes.js";
import postRoutes from "./routes/posts.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());

// ✅ CORS setup
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://thetroops.netlify.app", // deployed frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like Postman or server-to-server)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  })
);

// ✅ MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ DB connected"))
  .catch((err) => console.error("❌ Error connecting to DB:", err));

// ✅ Root route
app.get("/", (req, res) => {
  res.json("SERVER is runningggg!!!!");
});

// ✅ API routes
app.use("/api", postRoutes);
app.use("/compa", compaRoutes);

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
