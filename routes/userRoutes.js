import express from "express";
import { getAllUsers, signupUser, loginUser } from "../controllers/index.js";

const router = express.Router();

router.get("/", getAllUsers);
router.post("/signup", signupUser);

router.post("/login", loginUser);

export default router;
