import express from "express";
import { getAllUsers, signupUser, loginUser } from "../controllers/index.js";
import { authLimiter } from "../middleware/rateLimiters.js";

const router = express.Router();

router.get("/", getAllUsers);
router.post("/signup", authLimiter, signupUser);
router.post("/login", authLimiter, loginUser);
// Add protected user endpoints here if needed (e.g. update, delete)

export default router;
