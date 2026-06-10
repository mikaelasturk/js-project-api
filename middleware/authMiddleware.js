import { User } from "../models/User";

// Optional: attaches user if token is present, but never blocks the request
export const optionalAuth = async (request, response, next) => {
  try {
    const authHeader = request.header("Authorization");
    if (authHeader) {
      const accessToken = authHeader.replace("Bearer ", "");
      const user = await User.findOne({ accessToken });
      if (user) request.user = user;
    }
  } catch {
    // ignore auth errors — treat as anonymous
  }
  next();
};

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
