import { User } from "../models/User";

export const getDashboard = async (request, response) => {
  try {
    const { id } = request.params;
    const user = await User.findById(id);
    if (user) {
      response.status(200).json({
        message:
          "Hej!!!! Välkommen till din hemliga dashboard, " +
          user.firstName +
          "!!!",
        user,
      });
    } else {
      response.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    response.status(400).json({ error: error.message || "Invalid request" });
  }
};
