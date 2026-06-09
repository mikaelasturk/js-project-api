import { Thought, User } from "../models/index.js";
import { ERRORS } from "../utils/index.js";

export const getThoughtsByUser = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({
        success: false,
        status: 404,
        error: ERRORS.USER_NOT_FOUND,
        details: `No user with username ${username}`,
      });
    }
    const thoughts = await Thought.find({ userId: user._id }).sort({ thoughtCreatedAt: -1 });
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