import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendVerificationEmail } from "@/util/EmailVerification";
import { authValidatorEmail } from "@/zod/authValidations";


export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    const validatedData = authValidatorEmail.safeParse({ email });
    if (!validatedData.success) {
      return NextResponse.json(
        { message: "Invalid email", errors: validatedData.error.message },
        { status: 400 }
      );
    }

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    await prisma.user.upsert({
      where: { email },
      update: { otp, otpExpiry },
      create: { email, username: '', password: '', otp, otpExpiry }
    });

    await sendVerificationEmail(email, otp);

    return NextResponse.json({ message: "OTP sent successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
