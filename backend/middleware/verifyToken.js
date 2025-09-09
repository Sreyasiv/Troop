// middleware/verifyToken.js
import admin from "../config/firebaseAdmin.js";

export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const idToken = authHeader.split(" ")[1];

  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    req.user = { uid: decoded.uid, email: decoded.email }; 
    return next();
  } catch (err) {
    console.error("verifyToken failed:", err);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
