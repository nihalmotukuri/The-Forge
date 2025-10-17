import nodemailer from "nodemailer";

/**
 * Generates the HTML content for the animated neon-green cyberpunk OTP email.
 * Fully inline CSS for best compatibility in modern email clients.
 */
function getCyberpunkAnimatedHtml(code: string): string {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>System Verification Code</title>
    <link href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap" rel="stylesheet" />
  </head>
  <body
    style="background-color:#000; font-family:'Share Tech Mono',monospace; margin:0; padding:0; color:#e3ff04; text-align:center;"
  >
    <table width="100%" cellspacing="0" cellpadding="0">
      <tr>
        <td align="center" style="padding:40px 10px;">
          <table
            width="600"
            cellpadding="30"
            cellspacing="0"
            style="background:#0a0a0a; border:2px solid #e3ff04; border-radius:8px; box-shadow:0 0 20px rgba(227,255,4,0.8);"
          >
            <tr>
              <td style="font-size:26px; text-transform:uppercase; letter-spacing:6px;">
                <span style="animation: glowTitle 2s infinite alternate;">&lt;System_Alert&gt;</span>
              </td>
            </tr>
            <tr>
              <td style="font-size:18px;">Authentication Sequence Initiated</td>
            </tr>
            <tr>
              <td style="font-size:15px; color:#ccc;">
                Verification required. Use the secure passkey below within
                <span style="color:#e3ff04;">5 minutes</span>.
              </td>
            </tr>
            <tr>
              <td style="padding:30px 0;">
                <div
                  style="display:inline-block; background:#000; border:2px dashed #e3ff04; padding:15px 30px; border-radius:10px;
                         font-size:42px; letter-spacing:15px; animation: pulseGlow 1.5s infinite alternate;">
                  ${code}
                </div>
              </td>
            </tr>
            <tr>
              <td style="font-size:13px; color:#999;">
                Warning: Do not share this code. If this wasn’t you, contact The Forge immediately.
              </td>
            </tr>
            <tr>
              <td style="padding-top:30px; font-size:12px; color:#666;">
                — The Forge Team <br /> System Security Division
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <style>
      @keyframes glowTitle {
        0% { text-shadow: 0 0 5px #e3ff04, 0 0 10px #e3ff04; color:#e3ff04; }
        100% { text-shadow: 0 0 20px #e3ff04, 0 0 40px #e3ff04; color:#f7ff88; }
      }
      @keyframes pulseGlow {
        0% { box-shadow: 0 0 10px rgba(227,255,4,0.6); color:#e3ff04; }
        100% { box-shadow: 0 0 30px rgba(227,255,4,1); color:#ffffff; }
      }
    </style>
  </body>
  </html>
  `;
}

export async function sendVerificationEmail(email: string, code: string) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: `"The Forge Team" <${process.env.EMAIL}>`,
    to: email,
    subject: "⚡ The Forge Verification Code | Secure Access",
    html: getCyberpunkAnimatedHtml(code),
    text: `SYSTEM ALERT: Use code ${code} within 5 minutes to verify your identity. Sent by The Forge Team.`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Email error:", error);
  }
}
