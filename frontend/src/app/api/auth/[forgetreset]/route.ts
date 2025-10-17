import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import sendPasswordResetEmail from "@/util/sendPasswordResetEmail";

export async function POST(
  req: NextRequest,
  { params }: { params: { forgetreset: string } }
) {
  const { otp } = await req.json();
  if (!otp) {
    return NextResponse.json(
      { error: "OTP is required", status: 400 },
      { status: 400 }
    );
  }
  const url = new URL(req.url);
  const param = params.forgetreset;
  const uid = url.searchParams.get("uid");
  const forgetPassword = url.searchParams.get("forget-password");
  const resetPassword = url.searchParams.get("reset-password");
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  if (!uid) {
    return NextResponse.json(
      { error: "UID is required", status: 400 },
      { status: 400 }
    );
  }
  const existingUser = await prisma.user.findUnique({
    where: { id: uid },
  });
  if (!existingUser) {
    return NextResponse.json(
      { error: "User not found", status: 404 },
      { status: 404 }
    );
  }
  if (!existingUser.otp || !existingUser.otpExpiry) {
    return NextResponse.json(
      { message: "OTP not sent or expired" },
      { status: 400 }
    );
  }

  if (existingUser.otp !== otp) {
    return NextResponse.json({ message: "Invalid OTP" }, { status: 400 });
  }
  if (existingUser.otpExpiry < new Date()) {
    return NextResponse.json({ message: "OTP has expired" }, { status: 400 });
  }

  if (forgetPassword === "true" && existingUser.otp === otp && param === "forget") {
      sendPasswordResetEmail(existingUser.email);

    return NextResponse.json({
      message: `Forget password requested for UID: ${uid}`,
      status: 200,
    });
  } else if (resetPassword === "true" && existingUser.otp === otp && param === "reset") {
    sendPasswordResetEmail(existingUser.email);
    return NextResponse.json({
      message: `Reset password requested for UID: ${uid}`,
      status: 200,
    });
  } else if (
    forgetPassword === "false" ||
    resetPassword === "false" ||
    (!forgetPassword && !resetPassword)
  ) {
    return NextResponse.json(
      {
        error: "No action requested",
        status: 400,
      },
      { status: 400 }
    );
  } else {
    return NextResponse.json(
      {
        error: "Invalid request parameters",
        status: 400,
      },
      { status: 400 }
    );
  }
}
