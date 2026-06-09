import express from "express";
import { getDashboard } from "../controllers/index.js";

const router = express.Router();

router.get("/:id", getDashboard);

export default router;
