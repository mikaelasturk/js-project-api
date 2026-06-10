import crypto from "crypto";
import mongoose from "mongoose";

const thoughtSchema = new mongoose.Schema(
  {
    thoughtId: {
      type: String,
      default: () => crypto.randomBytes(16).toString("hex"),
      required: true,
      unique: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // Tillåter anonyma thoughts
    },
    name: {
      type: String,
      default: "Anonymous",
      trim: true,
    },
    thoughtCreatedAt: {
      type: Date,
      default: Date.now,
    },
    message: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 140,
      trim: true,
    },
    hearts: {
      type: Number,
      default: 0,
    },
    likedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    likedByAnonymous: {
      type: [String],
      default: [],
    },
    tags: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      default: "General",
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },

  {
    toJSON: {
      transform(doc, ret) {
        ret.thoughtCreatedAt = ret.thoughtCreatedAt
          ? new Date(ret.thoughtCreatedAt).toISOString()
          : ret.thoughtCreatedAt;
        ret.updatedAt = ret.updatedAt
          ? new Date(ret.updatedAt).toISOString()
          : ret.updatedAt;
      },
    },
  },
);

export const Thought = mongoose.model("Thought", thoughtSchema);
