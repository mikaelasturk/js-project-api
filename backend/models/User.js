import crypto from "crypto";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

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

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: 2,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      minlength: 2,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      minlength: 3,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      minlength: 5,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format"],
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      match: [
        /^(?=.*[A-ZÅÄÖ])(?=.*[a-zåäö])(?=.*\d).{8,}$/,
        "Invalid password format",
      ],
    },
    accessToken: {
      type: String,
      default: () => crypto.randomBytes(128).toString("hex"),
    },
    city: {
      type: String,
      required: true,
    },
    userCreatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.userCreatedAt = formatToStockholmTime(ret.userCreatedAt);
        delete ret.password;
        delete ret.accessToken;
        return ret;
      },
    },
  },
);

// Hasha lösenord innan spara
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

export const User = mongoose.model("User", userSchema);
