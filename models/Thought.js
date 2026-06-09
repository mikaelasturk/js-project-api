import crypto from "crypto";
import mongoose from "mongoose";

const formatToStockholmTime = (date) =>
  date
    ? new Intl.DateTimeFormat("sv-SE", {
        timeZone: "Europe/Stockholm",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }).format(date)
    : undefined;

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
        ret.thoughtCreatedAt = formatToStockholmTime(ret.thoughtCreatedAt);
        ret.updatedAt = formatToStockholmTime(ret.updatedAt);
      },
    },
  },
);

export const Thought = mongoose.model("Thought", thoughtSchema);
