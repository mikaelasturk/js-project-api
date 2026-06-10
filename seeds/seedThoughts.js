import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import mongoose from "mongoose";

import { Thought } from "../models/index.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/thoughts";
const dataPath = path.resolve(__dirname, "../data/data.json");
const shouldReset = process.env.RESET_SEED_DB === "true";

const normalizeThought = (item) => {
  const timestamp = item.thoughtCreatedAt || item.createdAt || new Date().toISOString();

  return {
    message: String(item.message || "").trim(),
    hearts: Number.isFinite(item.hearts) ? item.hearts : 0,
    thoughtCreatedAt: new Date(timestamp),
    name: item.name || "Anonymous",
    category: item.category || "General",
    tags: Array.isArray(item.tags) ? item.tags : [],
  };
};

const seedThoughts = async () => {
  await mongoose.connect(mongoUrl);

  try {
    const raw = await fs.readFile(dataPath, "utf8");
    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      throw new Error("data.json must contain an array of thoughts");
    }

    const normalized = parsed
      .map(normalizeThought)
      .filter((item) => item.message.length >= 5 && item.message.length <= 140);

    if (shouldReset) {
      await Thought.deleteMany({});
      console.log("Resetting thoughts collection...");
    }

    if (normalized.length === 0) {
      console.log("No valid thoughts to seed.");
      return;
    }

    await Thought.insertMany(normalized, { ordered: false });
    console.log(`Seeded ${normalized.length} thoughts.`);
  } finally {
    await mongoose.disconnect();
  }
};

seedThoughts().catch((error) => {
  console.error("Failed to seed thoughts:", error.message);
  process.exitCode = 1;
});
