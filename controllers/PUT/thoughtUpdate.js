import { Thought } from "../../models/index.js";
import { ERRORS } from "../../utils/index.js";

export const updateThought = async (req, res) => {
  try {
    const { message, tags, category } = req.body;
    const thought = await Thought.findById(req.params.id);
    if (!thought) {
      return res.status(404).json({
        success: false,
        status: 404,
        error: ERRORS.THOUGHT_NOT_FOUND,
        details: `No thought with id ${req.params.id}`,
      });
    }
    // Endast ägaren får uppdatera
    if (thought.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        status: 403,
        error: ERRORS.NOT_AUTHORIZED,
        details: "You are not the owner of this thought",
      });
    }
    if (message) thought.message = message;
    if (tags) thought.tags = tags;
    if (category) thought.category = category;
    thought.updatedAt = new Date();
    await thought.save();
    res.json(thought);
  } catch (error) {
    console.error("UPDATE THOUGHT ERROR:", error);
    res.status(400).json({
      success: false,
      status: 400,
      error: ERRORS.INTERNAL_ERROR,
      details: error.message,
    });
  }
};