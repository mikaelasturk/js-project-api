import Thought from "../models/Thought.js";

export const likeThought = async (req, res) => {
  try {
    const thought = await Thought.findById(req.params.id);
    if (!thought) return res.status(404).json({ error: "Thought not found" });
    if (!thought.likedBy.includes(req.user._id)) {
      thought.hearts += 1;
      thought.likedBy.push(req.user._id);
      await thought.save();
    }
    res.json(thought);
  } catch (error) {
    res
      .status(400)
      .json({ error: "Could not like thought", details: error.message });
  }
};
