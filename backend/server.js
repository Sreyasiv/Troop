import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import compaRoutes from "./routes/compaRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { verifyToken } from "./middleware/verifyToken.js";
import { startCronJobs } from "./cronjobs/cronJobs.js"; 
import { limiter } from "./middleware/rateLimiter.js";

dotenv.config();

startCronJobs();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(limiter);

app.use(express.json());

//CORS setup
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://thetroops.netlify.app", 
];

app.use(
  cors({
    origin: function (origin, callback) {
      
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS","PATCH"],
    allowedHeaders: ["Content-Type","Authorization","Accept", "Origin"],
    credentials: true,
  })
);
//  MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("DB connected"))
  .catch((err) => console.error("Error connecting to DB:", err));

//Root route
app.get("/", (req, res) => {
  res.json("SERVER is runningggg!!!!");
});



// API routes
app.use("/api/posts", postRoutes);
app.use("/compa", compaRoutes);
app.use("/api/users", userRoutes);


app.get("/token/protected-route", verifyToken, (req, res) => {
  // if token is good, middleware sets req.user.uid
  res.json({ ok: true, uid: req.user.uid });
});

//Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});