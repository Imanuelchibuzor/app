export const buildWelcomeEmail = (name: string, otp: number) => {
  return `
    <div dir="ltr" style="font-family:Verdana,sans-serif;text-align:left;line-height:1.5;">
      <p>Hello ${name},</p>

      <p>Welcome to Saerv! To complete your registration and verify your email address, please use the verification code below:</p>

      <p style="font-family:Courier,monospace;font-size:24px;letter-spacing:2px;margin:20px 0;">
        <strong>${otp}</strong>
      </p>

      <p>This code will expire in 15 minutes. If you did not request this, you can safely ignore this email.</p>

      <p>If you have any questions, please contact us at emmanuel@saerv.com.</p>

      <p>Welcome aboard!<br/>The Saerv Team</p>
    </div>
  `;
};

export const buildResetPasswordEmail = (name: string, otp: number) => {
  return `
    <div dir="ltr" style="font-family:Verdana,sans-serif;text-align:left;line-height:1.5;">
      <p>Hello ${name},</p>

      <p>You requested a password reset. Please use the code below to set a new password:</p>

      <p style="font-family:Courier,monospace;font-size:24px;letter-spacing:2px;margin:20px 0;">
        <strong>${otp}</strong>
      </p>

      <p>This code will expire in 15 minutes for security reasons. If you did not request a password reset, you can safely ignore this email or contact us at emmanuel@saerv.com.</p>

      <p>Thank you,<br>The Saerv Security Team</p>
    </div>
  `;
};