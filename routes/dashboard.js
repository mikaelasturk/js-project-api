import express from "express";
import { getDashboard } from "../controllers/index.js";
import { authenticateUser } from "../middleware/authMiddleware.js";
const router = express.Router();
router.get("/:id", authenticateUser, getDashboard);

export default router;
