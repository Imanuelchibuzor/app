import { ServerClient } from "postmark";
import dotenv from "dotenv"
dotenv.config();

const client = new ServerClient(process.env.POSTMARK_API_TOKEN as string);

type Mail = {
  email: string,
  subject: string,
  html: string
}

export async function sendEmail({ email, subject, html }: Mail) {
  try {
    const response = await client.sendEmail({
      From: "emmanuel@saerv.com",
      To: email,
      Subject: subject,
      HtmlBody: html,
      MessageStream: "outbound",
    });

    console.log("✅ Email sent:", response);
    return response;
  } catch (error: any) {
    console.error("❌ Postmark error:", error.message);
    throw new Error("Email sending failed");
  }
}

