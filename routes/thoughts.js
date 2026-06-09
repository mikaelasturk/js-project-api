import express from "express";
import { authenticateUser } from "../middleware/authMiddleware.js";
import { apiLimiter, authLimiter } from "../middleware/rateLimiters.js";
import {
  getAllThoughts,
  createThought,
  likeThought,
  getThoughtById,
  updateThought,
  deleteThought,
  getThoughtsLikedByUser,
  getAllCategories,
  getAllTags,
  getThoughtsByUser,
} from "../controllers/index.js";

const router = express.Router();
router.use(apiLimiter);

router.get("/", getAllThoughts);
router.get("/categories", getAllCategories);
router.get("/tags", getAllTags);
router.get("/by-user/:username", getThoughtsByUser);
router.post("/", authLimiter, authenticateUser, createThought);
router.get("/:id", getThoughtById);
router.put("/:id", authLimiter, authenticateUser, updateThought);
router.post("/:id/like", authLimiter, authenticateUser, likeThought);
router.get("/liked/by-me", authenticateUser, getThoughtsLikedByUser);
router.delete("/:id", authLimiter, authenticateUser, deleteThought);

export default router;