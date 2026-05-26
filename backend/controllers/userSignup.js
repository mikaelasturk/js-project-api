import { User } from "../models/User";

export const signupUser = async (request, response) => {
  try {
    const { email, password, firstName, lastName, cityValue, username } =
      request.body;
    if (
      !email ||
      !password ||
      !firstName ||
      !lastName ||
      !cityValue ||
      !username
    ) {
      return response
        .status(400)
        .json({ success: false, message: "Alla fält måste fyllas i" });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return response
        .status(400)
        .json({ success: false, message: "Ogiltigt e-postformat" });
    }
    if (password.length < 8) {
      return response.status(400).json({
        success: false,
        message: "Lösenordet måste vara minst 8 tecken",
      });
    }
    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username }],
    });
    if (existingUser) {
      return response.status(409).json({
        success: false,
        message: "Email address already exists",
      });
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
    response.status(201).json({
      success: true,
      message: "User created successfully",
      response: savedUser,
    });
  } catch (error) {
    response.status(400).json({
      success: false,
      message: "Failed to create user",
      error: error.message,
    });
  }
};
