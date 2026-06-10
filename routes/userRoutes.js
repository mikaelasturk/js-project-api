import express from "express";
import {
	getAllUsers,
	signupUser,
	loginUser,
	forgotPassword,
	resetPassword,
	verifyEmail,
	updateUser,
	deleteUser,
	getThoughtsByUser,
} from "../controllers/index.js";
import { authenticateUser } from "../middleware/index.js";

const router = express.Router();

router.get("/", getAllUsers);
router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/verify-email", verifyEmail);
router.get("/:username/profile", getThoughtsByUser);
router.patch("/me", authenticateUser, updateUser);
router.delete("/me", authenticateUser, deleteUser);

export default router;
