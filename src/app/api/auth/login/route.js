// /app/api/login/route.ts
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { connectDB } from "../../../../lib/db";
import User from "../../../../models/User"; // your mongoose model

const JWT_SECRET = process.env.JWT_SECRET

export async function POST(req) {
  const { email, password } = await req.json();
  await connectDB();

  const user = await User.findOne({ email });

  if (!user) {
    return NextResponse.json(
      { message: "User does not exist. Please register first." },
      { status: 404 }
    );
  }

  const isPasswordValid = bcrypt.compareSync(password, user.password);
  if (!isPasswordValid) {
    return NextResponse.json(
      { message: "Invalid password. Please try again." },
      { status: 401 }
    );
  }

  const token = jwt.sign(
    { id: user._id, email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  return NextResponse.json({
    token,
    user: { name: user.name, email: user.email },
  });
}

