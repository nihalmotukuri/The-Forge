import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sendWelcomeEmail  from "@/util/sendWelcomeEmail";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
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
      message: "Login successful",
      user: {
        uid: user.id,
        username: user.username,
        email: user.email,
      },
    });
         sendWelcomeEmail(email);

    res.cookies.set("auth-token", token, cookieOptions);

    return res;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
