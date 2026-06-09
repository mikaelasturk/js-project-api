import { Thought } from "../models/index.js";
import { ERRORS } from "../utils/index.js";

export const likeThought = async (req, res) => {
  try {
    const thought = await Thought.findById(req.params.id);
    if (!thought) {
      return res.status(404).json({
        success: false,
        status: 404,
        error: ERRORS.THOUGHT_NOT_FOUND,
        details: `No thought with id ${req.params.id}`,
      });
    }
    if (!thought.likedBy.includes(req.user._id)) {
      thought.hearts += 1;
      thought.likedBy.push(req.user._id);
      await thought.save();
    }
    res.json(thought);
  } catch (error) {
    console.error("LIKE THOUGHT ERROR:", error);
    res.status(400).json({
      success: false,
      status: 400,
      error: ERRORS.INTERNAL_ERROR,
      details: error.message,
    });
  }
};