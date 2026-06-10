import nodemailer from "nodemailer";

const getSmtpConfig = () => ({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: String(process.env.SMTP_SECURE || "false") === "true",
  user: process.env.SMTP_USER,
  pass: process.env.SMTP_PASS,
  from: process.env.MAIL_FROM,
});

const hasSmtpConfig = (config) =>
  Boolean(config.host && config.user && config.pass && config.from);

let transporter;

const isProduction = () => process.env.NODE_ENV === "production";

const getTransporter = () => {
  if (transporter) return transporter;

  const config = getSmtpConfig();
  if (!hasSmtpConfig(config)) return null;

  transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.pass,
    },
  });

  return transporter;
};

export const sendPasswordResetEmail = async ({ toEmail, resetLink }) => {
  const config = getSmtpConfig();
  const client = getTransporter();

  if (!client) {
    if (isProduction()) {
      return {
        sent: false,
        reason: "SMTP config is missing",
      };
    }

    // Dev fallback: create an Ethereal test inbox and return preview URL.
    const testAccount = await nodemailer.createTestAccount();
    const testTransport = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    const info = await testTransport.sendMail({
      from: config.from || "no-reply@happy-thoughts.local",
      to: toEmail,
      subject: "Återställ ditt lösenord",
      text: `Du har begärt återställning av lösenord. Klicka på länken för att fortsätta: ${resetLink}`,
      html: `
        <p>Du har begärt återställning av lösenord.</p>
        <p>Klicka på länken nedan för att fortsätta:</p>
        <p><a href="${resetLink}">${resetLink}</a></p>
        <p>Länken gäller i 30 minuter.</p>
        <p>Om du inte begärde detta kan du ignorera mailet.</p>
      `,
    });

    return {
      sent: true,
      previewUrl: nodemailer.getTestMessageUrl(info),
      transport: "ethereal",
    };
  }

  const info = await client.sendMail({
    from: config.from,
    to: toEmail,
    subject: "Återställ ditt lösenord",
    text: `Du har begärt återställning av lösenord. Klicka på länken för att fortsätta: ${resetLink}`,
    html: `
      <p>Du har begärt återställning av lösenord.</p>
      <p>Klicka på länken nedan för att fortsätta:</p>
      <p><a href="${resetLink}">${resetLink}</a></p>
      <p>Länken gäller i 30 minuter.</p>
      <p>Om du inte begärde detta kan du ignorera mailet.</p>
    `,
  });

  return {
    sent: true,
    messageId: info.messageId,
    transport: "smtp",
  };
};

export const sendEmailVerificationEmail = async ({ toEmail, verificationLink }) => {
  const config = getSmtpConfig();
  const client = getTransporter();

  if (!client) {
    if (isProduction()) {
      return {
        sent: false,
        reason: "SMTP config is missing",
      };
    }

    const testAccount = await nodemailer.createTestAccount();
    const testTransport = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    const info = await testTransport.sendMail({
      from: config.from || "no-reply@happy-thoughts.local",
      to: toEmail,
      subject: "Verifiera din e-post",
      text: `Välkommen! Verifiera din e-post genom att klicka här: ${verificationLink}`,
      html: `
        <p>Välkommen!</p>
        <p>Verifiera din e-post genom att klicka på länken nedan:</p>
        <p><a href="${verificationLink}">${verificationLink}</a></p>
        <p>Länken gäller i 24 timmar.</p>
      `,
    });

    return {
      sent: true,
      previewUrl: nodemailer.getTestMessageUrl(info),
      transport: "ethereal",
    };
  }

  const info = await client.sendMail({
    from: config.from,
    to: toEmail,
    subject: "Verifiera din e-post",
    text: `Välkommen! Verifiera din e-post genom att klicka här: ${verificationLink}`,
    html: `
      <p>Välkommen!</p>
      <p>Verifiera din e-post genom att klicka på länken nedan:</p>
      <p><a href="${verificationLink}">${verificationLink}</a></p>
      <p>Länken gäller i 24 timmar.</p>
    `,
  });

  return {
    sent: true,
    messageId: info.messageId,
    transport: "smtp",
  };
};
