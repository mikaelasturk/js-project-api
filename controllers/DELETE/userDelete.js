import { Thought, User } from "../../models/index.js";
import { ERRORS } from "../../utils/index.js";

export const deleteUser = async (req, res) => {
  try {
    const userId = req.user._id;

    await Thought.deleteMany({ userId });
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        status: 404,
        error: ERRORS.USER_NOT_FOUND,
        details: `No user with id ${userId}`,
      });
    }

    return res.json({
      success: true,
      message: "User deleted",
    });
  } catch (error) {
    console.error("DELETE USER ERROR:", error);
    return res.status(400).json({
      success: false,
      status: 400,
      error: ERRORS.INTERNAL_ERROR,
      details: error.message,
    });
  }
};
