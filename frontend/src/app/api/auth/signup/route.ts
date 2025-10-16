import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authValidatorSignup } from "@/zod/authValidations";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { email, otp, username, password, confirmpassword } =
      await req.json();

    if (!email || !otp || !username || !password || !confirmpassword) {
      return NextResponse.json(
        { message: "All fields including OTP are required" },
        { status: 400 }
      );
    }

    if (password !== confirmpassword) {
      return NextResponse.json(
        { message: "Passwords do not match" },
        { status: 400 }
      );
    }

    const validatedData = authValidatorSignup.safeParse({ email, password,username,confirmpassword });
    if (!validatedData.success) {
      return NextResponse.json(
        { message: "Invalid data", errors: validatedData.error },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.otp || !user.otpExpiry) {
      return NextResponse.json(
        { message: "OTP not sent or expired" },
        { status: 400 }
      );
    }

    if (user.otp !== otp) {
      return NextResponse.json({ message: "Invalid OTP" }, { status: 400 });
    }

    if (user.otpExpiry < new Date()) {
      await prisma.user.delete({ where: { email } });
      return NextResponse.json(
        { message: "OTP expired, please request again" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const updatedUser = await prisma.user.update({
      where: { email },
      data: {
        username,
        password: hashedPassword,
        otp: null,
        otpExpiry: null,
      },
    });

    return NextResponse.json({
      message: "User verified and signup complete",
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
