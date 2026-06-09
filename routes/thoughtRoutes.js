import express from "express";
import { authenticateUser } from "../middleware/authMiddleware.js";
import {
  getAllThoughts,
  createThought,
  likeThought,
} from "../controllers/index.js";

const router = express.Router();

router.get("/", getAllThoughts);
router.post("/", authenticateUser, createThought);
router.post("/:id/like", authenticateUser, likeThought);

export default router;
