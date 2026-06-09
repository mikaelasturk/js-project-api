import Thought from "../models/Thought.js";

export const getAllTags = async (req, res) => {
  try {
    const tags = await Thought.distinct("tags");
    res.json({ tags });
  } catch (error) {
    res.status(400).json({ error: "Could not fetch tags", details: error.message });
  }
};