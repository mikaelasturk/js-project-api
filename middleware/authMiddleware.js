import { User } from "../models/User";

export const authenticateUser = async (request, response, next) => {
  try {
    const authHeader = request.header("Authorization");
    if (!authHeader) {
      return response.status(401).json({
        message: "Authorization header saknas",
        loggedOut: true,
      });
    }
    const accessToken = authHeader.replace("Bearer ", "");
    const user = await User.findOne({ accessToken });

    if (user) {
      request.user = user;
      next();
    } else {
      response.status(401).json({
        message: "Authentication missing or invalid",
        loggedOut: true,
      });
    }
  } catch (error) {
    response.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
