import crypto from "crypto";
import { User } from "../../models/index.js";

export const verifyEmail = async (req, res) => {
  try {
    const token = String(req.body?.token || "").trim();
    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Verifieringstoken saknas",
      });
    }

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      emailVerificationTokenHash: tokenHash,
      emailVerificationExpiresAt: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Verifieringslänken är ogiltig eller har gått ut",
      });
    }

    user.emailVerified = true;
    user.emailVerificationTokenHash = null;
    user.emailVerificationExpiresAt = null;

    await user.save({ validateModifiedOnly: true });

    return res.status(200).json({
      success: true,
      message: "E-post verifierad. Du kan nu logga in.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Kunde inte verifiera e-post",
      error: error.message,
    });
  }
};
