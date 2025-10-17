import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authValidatorSignup } from "@/zod/authValidations";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sendWelcomeEmail from "@/util/sendWelcomeEmail";

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

    const validatedData = authValidatorSignup.safeParse({
      email,
      password,
      username,
      confirmpassword,
    });
    if (!validatedData.success) {
      return NextResponse.json(
        { message: "Invalid data", errors: validatedData.error },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json(
        { message: "OTP not sent or user does not exist" },
        { status: 400 }
      );
    }

    if (!user.otp || !user.otpExpiry) {
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
    let profilePic: string | undefined;
    if (username.split(" ").length > 1) {
      profilePic = username
        .split(" ")
        .map((n: string) => n.charAt(0).toUpperCase())
        .join("");
    } else {
      profilePic = username.charAt(0).toUpperCase();
    }

    const updatedUser = await prisma.user.update({
      where: { email },
      data: {
        username,
        password: hashedPassword,
        otp: null,
        otpExpiry: null,
        profilePic,
      },
    });
    const token = jwt.sign(
      { uid: updatedUser.id, email: updatedUser.email },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );
    const cookieOptions = {
      httpOnly: true,
      secure: false,
      sameSite: "lax" as const,
      maxAge: 24 * 60 * 60,
      path: "/",
    };

    const res = NextResponse.json({
      message: "User verified and signup complete",
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
      },
    });
    sendWelcomeEmail(updatedUser.email);

    res.cookies.set("auth-token", token, cookieOptions);

    return res;
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
