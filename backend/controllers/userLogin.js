import bcrypt from "bcrypt";
import { User } from "../models/User";

export const loginUser = async (request, response) => {
  try {
    const { email, password } = request.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (user && bcrypt.compareSync(password, user.password)) {
      response.status(200).json({
        success: true,
        message: "Login successful",
        response: {
          email: user.email,
          id: user._id,
          accessToken: user.accessToken,
        },
      });
    } else {
      response.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }
  } catch (error) {
    response.status(500).json({
      success: false,
      message: "Something went wrong during login",
      error: error.message,
    });
  }
};
