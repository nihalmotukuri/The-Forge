import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function pageNavigatorMiddleware(req: NextRequest) {
  const authHeader = req.headers.get("Authorization");
  const bearerToken = authHeader?.split(" ")[1];

  if (bearerToken) {
    try {
      jwt.verify(bearerToken, process.env.JWT_SECRET!);

      const response = NextResponse.next();
      response.cookies.set("auth-token", bearerToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 24 * 60 * 60, 
        path: "/", 
      });
      return response;
    } catch {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }
  }
}