import { Thought } from "../models/index.js";
import { ERRORS } from "../utils/index.js";

export const getThoughtsLikedByUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const thoughts = await Thought.find({ likedBy: userId }).sort({ thoughtCreatedAt: -1 });
    res.json(thoughts);
  } catch (error) {
    res.status(400).json({
      success: false,
      status: 400,
      error: ERRORS.INTERNAL_ERROR,
      details: error.message,
    });
  }
};