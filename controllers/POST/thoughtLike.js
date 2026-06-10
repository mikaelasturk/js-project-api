import { Thought } from "../../models/index.js";
import { User } from "../../models/index.js";
import { ERRORS } from "../../utils/index.js";

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
    const authHeader = req.header("Authorization");
    const accessToken = authHeader?.startsWith("Bearer ")
      ? authHeader.replace("Bearer ", "")
      : null;
    const user = accessToken ? await User.findOne({ accessToken }) : null;

    if (user) {
      const userId = user._id.toString();
      const likedIndex = thought.likedBy.findIndex(
        (id) => id.toString() === userId,
      );

      if (likedIndex >= 0) {
        thought.likedBy.splice(likedIndex, 1);
        thought.hearts = Math.max(0, thought.hearts - 1);
      } else {
        thought.hearts += 1;
        thought.likedBy.push(user._id);
      }
    } else {
      const anonId = req.header("X-Anonymous-Id");
      if (!anonId) {
        return res.status(400).json({
          success: false,
          status: 400,
          error: ERRORS.INVALID_REQUEST || "Invalid request",
          details: "Missing X-Anonymous-Id",
        });
      }

      const likedIndex = thought.likedByAnonymous.findIndex((id) => id === anonId);

      if (likedIndex >= 0) {
        thought.likedByAnonymous.splice(likedIndex, 1);
        thought.hearts = Math.max(0, thought.hearts - 1);
      } else {
        thought.hearts += 1;
        thought.likedByAnonymous.push(anonId);
      }
    }

    await thought.save();
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