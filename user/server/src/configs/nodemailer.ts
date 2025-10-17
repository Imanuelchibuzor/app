import nodemailer from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";

import AppError from "./error";

const { GMAIL_USER, GMAIL_APP_PASSWORD, RECEIVER } = process.env;

if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
   throw new AppError(
     "Missing mailer environment variables. Ensure GMAIL_USER and GMAIL_APP_PASSWORD are set.",
     500,
     { isOperational: false, code: "MISSING_MAILER_ENV" }
   );
}

const transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo> =
  nodemailer.createTransport({
    host: "smtp-relay.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_APP_PASSWORD,
    },
  });

const sendEmail = async (
  to: string | string[],
  subject: string,
  html: string
): Promise<void> => {
  try {
    const mailOptions: nodemailer.SendMailOptions = {
      from: `"no-reply" <${GMAIL_USER}>`,
      to,
      subject,
      html,
      replyTo: RECEIVER,
    };

    await transporter.sendMail(mailOptions);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    // Log for quick debugging, then throw a typed AppError for upstream handling
    // eslint-disable-next-line no-console
    console.error("Error sending email:", msg);

    throw new AppError(`Failed to send email: ${msg}`, 502, {
      isOperational: false,
      code: "MAILER_SEND_FAILED",
      details: err,
    });
  }
};

export default sendEmail;
