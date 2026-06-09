import Thought from "../models/Thought.js";

export const getThoughtById = async (req, res) => {
  try {
    const thought = await Thought.findById(req.params.id);
    if (!thought) {
      return res.status(404).json({
        success: false,
        status: 404,
        error: "Thought not found",
        details: `No thought with id ${req.params.id}`,
      });
    }
    res.json(thought);
  } catch (error) {
    console.error("GET ONE THOUGHT ERROR:", error);
    res.status(400).json({
      success: false,
      status: 400,
      error: "Could not fetch thought",
      details: error.message,
    });
  }
};