import nodemailer from "nodemailer";

export async function sendVerificationEmail(email: string, code: string) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
    const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Email Verification Code",
    text: `Your verification code is: ${code}`,
  };
   transporter.sendMail(mailOptions, (error, info) => {
      if (error) console.log("Email error:", error);
      else console.log("Email sent:", info.response);
    });
}
    