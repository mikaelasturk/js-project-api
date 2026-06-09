import rateLimit from "express-rate-limit";

// Limit to 100 requests per 15 min per IP (adjust as needed)
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    success: false,
    status: 429,
    error: "Too many requests, please try again later."
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter limit for auth or posting routes
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: {
    success: false,
    status: 429,
    error: "Too many attempts, please slow down."
  },
  standardHeaders: true,
  legacyHeaders: false,
});
