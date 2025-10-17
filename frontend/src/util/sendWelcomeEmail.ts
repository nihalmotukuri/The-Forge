import nodemail from 'nodemailer';
function generateEmailHTML(code: string): string {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>  
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Login Successful</title>
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
                    Login Successful
                </td>
                </tr>
                <tr>
                <td style="font-size: 16px; color: #555;">
                    Hello,
                    <br /><br />
                    We wanted to inform you that your account was successfully accessed. If this was you, no further action is needed.
                    <br /><br />
                    If you did not log in, please reset your password immediately and contact our support team.
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
export default function sendWelcomeEmail(email: string) {
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
        subject: 'Login Successful - The Forge',
        html: generateEmailHTML(''),
        text: `Hello,
        We wanted to inform you that your account was successfully accessed. If this was you, no further action is needed.
        If you did not log in, please reset your password immediately and contact our support team.
        Stay secure,
        The Forge Team`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending login notification email:', error);
        }
        else {
            console.log('Login notification email sent:', info.response);
        }
    });
}