import express from "express";
import { authenticateUser, optionalAuth } from "../middleware/authMiddleware.js";
import {
  getAllThoughts,
  getThoughtById,
  createThought,
  likeThought,
  patchThought,
  deleteThought,
} from "../controllers/index.js";

const router = express.Router();

router.get("/", getAllThoughts);
router.post("/", optionalAuth, createThought);
router.get("/:id", getThoughtById);
router.patch("/:id", authenticateUser, patchThought);
router.post("/:id/like", likeThought);
router.delete("/:id", authenticateUser, deleteThought);

export default router;
