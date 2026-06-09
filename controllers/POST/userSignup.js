import { User } from "../models/index.js";
import { ERRORS } from "../utils/index.js";
import { validateEmail, validatePassword, validateRequired } from "../middleware/validation.js";

export const signupUser = async (req, res) => {
  try {
    const { email, password, firstName, lastName, cityValue, username } = req.body;
    const errors = {};
    Object.assign(errors, validateRequired(["email", "password", "firstName", "lastName", "cityValue", "username"], req.body));
    if (email && !validateEmail(email)) errors.email = ERRORS.INVALID_EMAIL;
    if (password && !validatePassword(password)) errors.password = ERRORS.SHORT_PASSWORD;
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ success: false, errors });
    }
    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username }],
    });
    if (existingUser) {
      if (existingUser.email === email.toLowerCase()) errors.email = ERRORS.EMAIL_EXISTS;
      if (existingUser.username === username) errors.username = ERRORS.USERNAME_EXISTS;
      return res.status(409).json({ success: false, errors });
    }
    const user = new User({
      email,
      password,
      firstName,
      lastName,
      city: cityValue,
      username,
    });
    const savedUser = await user.save();
    res.status(201).json({
      success: true,
      message: "User created successfully",
      response: savedUser,
    });
  } catch (error) {
    // Hantera Mongoose valideringsfel per fält
    if (error.name === "ValidationError") {
      const errors = {};
      for (const field in error.errors) {
        errors[field] = error.errors[field].message;
      }
      return res.status(400).json({ success: false, errors });
    }
    res.status(400).json({
      success: false,
      message: "Failed to create user",
      error: error.message,
    });
  }
};