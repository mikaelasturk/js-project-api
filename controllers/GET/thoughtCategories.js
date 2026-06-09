import Thought from "../models/Thought.js";

export const getAllCategories = async (req, res) => {
  try {
    const categories = await Thought.distinct("category");
    res.json({ categories });
  } catch (error) {
    res.status(400).json({ error: "Could not fetch categories", details: error.message });
  }
};