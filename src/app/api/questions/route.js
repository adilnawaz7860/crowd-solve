import { connectDB } from "../../../lib/db.js";
import Question from "../../../models/Question.js";
import User from '../../../models/User.js'
import { NextResponse } from "next/server";



export async function GET(req) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const skip = (page - 1) * limit;

  try {
    // Get total count of all questions
    const total = await Question.countDocuments();

    // Paginated query
    const questions = await Question.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("userId", "name email"); // optional if you want user info

    // Return both questions and pagination metadata
    return NextResponse.json({
      questions,
      pagination: {
        total,               // total number of documents
        page,                // current page
        limit,               // questions per page
        totalPages: Math.ceil(total / limit), // total pages
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Failed to fetch questions:", error);
    return NextResponse.json(
      { error: "Failed to fetch questions" },
      { status: 500 }
    );
  }
}


// Optional: handle POST for new question creation
export async function POST(req) {
  await connectDB();
  const { title, description , userId } = await req.json();


    if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }


  const question = await Question.create({ title, description , userId});
  return NextResponse.json(question, { status: 201 });
}
