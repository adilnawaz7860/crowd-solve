import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "../../../../lib/db";
import User from "../../../../models/User";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return NextResponse.json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
