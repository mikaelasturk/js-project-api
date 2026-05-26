import Thought from "../models/Thought.js";

export const createThought = async (request, response) => {
  try {
    const { message, name } = request.body;
    const thought = new Thought({
      message,
      name: name || request.user.username,
    });

    const saved = await thought.save();
    response.status(201).json(saved);
  } catch (error) {
    response.status(400).json({
      error: "Could not save thought",
      details: error.message,
    });
  }
};
