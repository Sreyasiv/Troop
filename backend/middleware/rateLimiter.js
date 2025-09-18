
import rateLimit from "express-rate-limit";

export const limiter = rateLimit({
  windowMs: 60 * 1000, 
  max: 100, 
  message: { error: "Too many requests, slow down!" },
  handler: (req, res, next, options) => {
    console.log(`[${new Date().toISOString()}] Blocked request from ${req.ip}`);
    res.status(options.statusCode).json(options.message);
  },
});
