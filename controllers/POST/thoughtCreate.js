import { Thought } from "../models/index.js";
import { ERRORS } from "../utils/index.js";

export const createThought = async (req, res) => {
  try {
    const { message, name, tags, category } = req.body;
    let userId = undefined;
    let username = name;
    if (req.user) {
      userId = req.user._id;
      username = name || req.user.username;
    }
    const thought = new Thought({
      message,
      name: username || "Anonym",
      userId,
      tags,
      category,
    });
    const saved = await thought.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error("CREATE THOUGHT ERROR:", error);
    res.status(400).json({
      success: false,
      status: 400,
      error: ERRORS.INTERNAL_ERROR,
      details: error.message,
    });
  }
};