import crypto from "crypto";
import { User } from "../../models/index.js";

export const resetPassword = async (req, res) => {
  try {
    const token = String(req.body?.token || "").trim();
    const newPassword = String(req.body?.newPassword || "");

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Token och nytt lösenord måste anges",
      });
    }

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      passwordResetTokenHash: tokenHash,
      passwordResetExpiresAt: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Länken är ogiltig eller har gått ut",
      });
    }

    user.password = newPassword;
    user.passwordResetTokenHash = null;
    user.passwordResetExpiresAt = null;
    user.passwordChangedAt = new Date();
    user.accessToken = crypto.randomBytes(128).toString("hex");

    await user.save({ validateModifiedOnly: true });

    return res.status(200).json({
      success: true,
      message: "Lösenordet är uppdaterat. Du kan nu logga in.",
    });
  } catch (error) {
    if (error?.name === "ValidationError") {
      const firstValidationError = Object.values(error.errors || {})[0]?.message;
      return res.status(400).json({
        success: false,
        message: firstValidationError || "Ogiltigt lösenord",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Kunde inte återställa lösenordet",
      error: error.message,
    });
  }
};
