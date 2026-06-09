import { User } from "../../models/index.js";
import { ERRORS } from "../../utils/index.js";

export const updateUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const { firstName, lastName, username, email, city } = req.body;
    const updates = {};
    if (firstName) updates.firstName = firstName;
    if (lastName) updates.lastName = lastName;
    if (username) updates.username = username;
    if (email) updates.email = email;
    if (city) updates.city = city;

    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    });
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        status: 404,
        error: ERRORS.USER_NOT_FOUND,
        details: `No user with id ${userId}`,
      });
    }
    res.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("UPDATE USER ERROR:", error);
    res.status(400).json({
      success: false,
      status: 400,
      error: ERRORS.INTERNAL_ERROR,
      details: error.message,
      status: 400,
      error: "Could not update user",
      details: error.message,
    });
  }
};
