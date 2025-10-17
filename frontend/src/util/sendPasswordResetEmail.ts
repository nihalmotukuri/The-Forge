import nodemail from 'nodemailer';

function generatePasswordResetHTML(): string {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>  
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Password Reset Successful</title>
  </head>
  <body
      style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;"
  >
      <table width="100%" cellspacing="0" cellpadding="0">
      <tr>
          <td align="center" style="padding: 40px 10px;">
          <table
              width="600"
              cellpadding="30"
              cellspacing="0"
              style="background: #ffffff; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);"
          >
              <tr>
              <td style="font-size: 24px; font-weight: bold; color: #333;">
                  Password Reset Successful
              </td>
              </tr>
              <tr>
              <td style="font-size: 16px; color: #555;">
                  Hello,
                  <br /><br />
                  We wanted to let you know that your password was successfully reset.
                  If this was you, no further action is needed.
                  <br /><br />
                  If you did not request a password reset, please contact our support team immediately.
                  <br /><br />
                  Stay secure,
                  <br />
                  The Forge Team
              </td>
              </tr>
          </table>
          </td>
      </tr>
      </table>
  </body>
  </html>
  `;
}
export default function sendPasswordResetEmail(email: string) {
  const transporter = nodemail.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Password Reset Successful - The Forge',
    html: generatePasswordResetHTML(),
    text: `Hello,
    We wanted to let you know that your password was successfully reset.
    If this was you, no further action is needed.
    If you did not request a password reset, please contact our support team immediately.
    Stay secure,
    The Forge Team`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending password reset email:', error);
    } else {
      console.log('Password reset email sent:', info.response);
    }
  });
}
