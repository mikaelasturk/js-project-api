import Thought from "../models/Thought.js";

export const getAllThoughts = async (request, response) => {
  try {
    const thoughts = await Thought.find().sort({ createdAt: -1 });
    response.json(thoughts);
  } catch (error) {
    response
      .status(400)
      .json({ error: "Could not fetch thoughts", details: error.message });
  }
};
