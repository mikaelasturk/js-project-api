import Thought from "../models/Thought.js";

export const getAllThoughts = async (req, res) => {
  try {
    // Paginering
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Filtrering
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.minLikes) filter.hearts = { $gte: parseInt(req.query.minLikes) };
    if (req.query.since) filter.thoughtCreatedAt = { $gte: new Date(req.query.since) };
    if (req.query.tags) filter.tags = { $in: req.query.tags.split(",") };
    if (req.query.username) filter.name = req.query.username;

    // Sortering
    let sort = { thoughtCreatedAt: -1 };
    if (req.query.sortBy === "likes") sort = { hearts: -1 };
    if (req.query.sortBy === "date") sort = { thoughtCreatedAt: -1 };

    const thoughts = await Thought.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Thought.countDocuments(filter);

    res.json({
      thoughts,
      page,
      totalPages: Math.ceil(total / limit),
      totalThoughts: total,
    });
  } catch (error) {
    console.error("GET ALL THOUGHTS ERROR:", error);
    res.status(400).json({
      success: false,
      status: 400,
      error: "Could not fetch thoughts",
      details: error.message,
    });
  }
};