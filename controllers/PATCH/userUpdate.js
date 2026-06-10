import { User } from "../../models/index.js";
import { ERRORS } from "../../utils/index.js";

export const updateUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const { firstName, lastName, username, email, city, cityValue } = req.body;
    const cleanEmail = email ? String(email).trim().toLowerCase() : undefined;
    const cleanUsername = username ? String(username).trim() : undefined;
    const updates = {};
    if (firstName) updates.firstName = firstName;
    if (lastName) updates.lastName = lastName;
    if (cleanUsername) updates.username = cleanUsername;
    if (cleanEmail) updates.email = cleanEmail;
    if (city || cityValue) updates.city = city || cityValue;

    if (cleanEmail || cleanUsername) {
      const conflictQuery = { _id: { $ne: userId } };
      const orConditions = [];
      if (cleanEmail) orConditions.push({ email: cleanEmail });
      if (cleanUsername) orConditions.push({ username: cleanUsername });
      if (orConditions.length > 0) {
        conflictQuery.$or = orConditions;
      }

      const existingUser = await User.findOne(conflictQuery);
      if (existingUser) {
        const errors = {};
        if (cleanEmail && existingUser.email === cleanEmail) {
          errors.email = ERRORS.EMAIL_EXISTS;
        }
        if (cleanUsername && existingUser.username === cleanUsername) {
          errors.username = ERRORS.USERNAME_EXISTS;
        }
        return res.status(409).json({ success: false, errors });
      }
    }

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
    if (error.code === 11000) {
      const errors = {};
      if (error.keyPattern?.email) errors.email = ERRORS.EMAIL_EXISTS;
      if (error.keyPattern?.username) errors.username = ERRORS.USERNAME_EXISTS;
      return res.status(409).json({ success: false, errors });
    }
    res.status(400).json({
      success: false,
      status: 400,
      error: ERRORS.INTERNAL_ERROR,
      details: error.message,
    });
  }
};
