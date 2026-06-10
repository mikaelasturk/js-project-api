import crypto from "crypto";
import { User } from "../../models/index.js";
import { sendPasswordResetEmail } from "../../utils/mailer.js";

const TOKEN_BYTES = 32;
const TOKEN_EXPIRY_MINUTES = 30;

export const forgotPassword = async (req, res) => {
  try {
    const email = String(req.body?.email || "").trim().toLowerCase();

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "E-post måste anges",
      });
    }

    const user = await User.findOne({ email });

    if (user) {
      const rawToken = crypto.randomBytes(TOKEN_BYTES).toString("hex");
      const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
      const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_MINUTES * 60 * 1000);

      user.passwordResetTokenHash = tokenHash;
      user.passwordResetExpiresAt = expiresAt;
      await user.save({ validateModifiedOnly: true });

      const frontendBaseUrl = process.env.FRONTEND_BASE_URL || "http://localhost:5173";
      const resetLink = `${frontendBaseUrl}/reset-password?token=${encodeURIComponent(rawToken)}`;

      const mailResult = await sendPasswordResetEmail({
        toEmail: email,
        resetLink,
      });

      if (!mailResult.sent) {
        console.warn(`Password reset email not sent for ${email}: ${mailResult.reason}`);
      }

      if (process.env.NODE_ENV !== "production") {
        return res.status(200).json({
          success: true,
          message: "Om kontot finns har instruktioner skickats till e-postadressen.",
          devResetLink: mailResult.sent ? undefined : resetLink,
          devEmailPreviewUrl: mailResult.previewUrl,
          devEmailWarning: mailResult.sent ? undefined : "E-post skickades inte. Kontrollera SMTP-inställningar i .env",
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: "Om kontot finns har instruktioner skickats till e-postadressen.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Kunde inte hantera återställning av lösenord",
      error: error.message,
    });
  }
};
