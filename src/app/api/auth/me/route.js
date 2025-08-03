import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "../../../../lib/db.js";
import User from "../../../../models/User.js"; // your mongoose model

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(req) {
  try {
    await connectDB();

    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "No token provided" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (err) {
    console.error("Auth /me error:", err);
    return NextResponse.json({ message: "Invalid or expired token" }, { status: 401 });
  }
}
