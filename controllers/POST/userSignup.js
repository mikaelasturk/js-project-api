import crypto from "crypto";
import { User } from "../../models/index.js";
import { ERRORS } from "../../utils/index.js";
import { validateEmail, validatePassword, validateRequired } from "../../middleware/validation.js";
import { sendEmailVerificationEmail } from "../../utils/mailer.js";

export const signupUser = async (req, res) => {
  try {
    const { email, password, firstName, lastName, cityValue, username } = req.body;
    const cleanEmail = String(email || "").trim().toLowerCase();
    const cleanUsername = String(username || "").trim();
    const errors = {};
    Object.assign(errors, validateRequired(["email", "password", "firstName", "lastName", "cityValue", "username"], req.body));
    if (cleanEmail && !validateEmail(cleanEmail)) errors.email = ERRORS.INVALID_EMAIL;
    if (password && !validatePassword(password)) errors.password = ERRORS.SHORT_PASSWORD;
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ success: false, errors });
    }
    const existingUser = await User.findOne({
      $or: [{ email: cleanEmail }, { username: cleanUsername }],
    });
    if (existingUser) {
      if (existingUser.email === cleanEmail) errors.email = ERRORS.EMAIL_EXISTS;
      if (existingUser.username === cleanUsername) errors.username = ERRORS.USERNAME_EXISTS;
      return res.status(409).json({ success: false, errors });
    }
    const user = new User({
      email: cleanEmail,
      password,
      firstName,
      lastName,
      city: cityValue,
      username: cleanUsername,
    });

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenHash = crypto
      .createHash("sha256")
      .update(verificationToken)
      .digest("hex");

    user.emailVerified = false;
    user.emailVerificationTokenHash = verificationTokenHash;
    user.emailVerificationExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const savedUser = await user.save();

    const frontendBaseUrl = process.env.FRONTEND_BASE_URL || "http://localhost:5173";
    const verificationLink = `${frontendBaseUrl}/verify-email?token=${encodeURIComponent(verificationToken)}`;

    const mailResult = await sendEmailVerificationEmail({
      toEmail: cleanEmail,
      verificationLink,
    });

    if (!mailResult.sent) {
      console.warn(`Email verification not sent for ${cleanEmail}: ${mailResult.reason}`);
    }

    res.status(201).json({
      success: true,
      message: "Konto skapat. Verifiera din e-post innan du loggar in.",
      devVerificationLink: process.env.NODE_ENV !== "production" && !mailResult.sent
        ? verificationLink
        : undefined,
      devEmailPreviewUrl: process.env.NODE_ENV !== "production"
        ? mailResult.previewUrl
        : undefined,
      response: savedUser,
    });
  } catch (error) {
    // Hantera Mongoose valideringsfel per fält
    if (error.name === "ValidationError") {
      const errors = {};
      for (const field in error.errors) {
        errors[field] = error.errors[field].message;
      }
      return res.status(400).json({ success: false, errors });
    }
    if (error.code === 11000) {
      const errors = {};
      if (error.keyPattern?.email) errors.email = ERRORS.EMAIL_EXISTS;
      if (error.keyPattern?.username) errors.username = ERRORS.USERNAME_EXISTS;
      return res.status(409).json({ success: false, errors });
    }
    res.status(400).json({
      success: false,
      message: "Failed to create user",
      error: error.message,
    });
  }
};