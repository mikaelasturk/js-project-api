import { User } from "../models/User";

export const getAllUsers = async (request, response) => {
  try {
    const users = await User.find().sort({ userCreatedAt: "desc" });
    response.json({ success: true, response: users });
  } catch (error) {
    response.status(400).json({
      success: false,
      message: "Kunde inte hämta användare",
      error: error.message,
    });
  }
};
