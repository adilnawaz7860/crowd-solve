import { connectDB } from "../../../../../lib/db.js";
import Answer from "../../../../../models/Answer";
import Question from "../../../../../models/Question";
import { NextResponse } from "next/server";

export async function GET(_, { params }) {
  await connectDB();
  const { questionId } = params;

  const answers = await Answer.find({ questionId }).sort({ createdAt: -1 }).populate('userId', 'name'); // 👈 populate userId with only the name field;
  return NextResponse.json({ answers });
}

export async function POST(req, context) {
     const { questionId } = context.params; // ✅ correct way
     await connectDB();


 
  const { content, userId } = await req.json();

  const question = await Question.findById(questionId);
  if (!question) {
    return NextResponse.json({ error: "Question not found" }, { status: 404 });
  }

  const newAnswer = new Answer({ content, userId, questionId });
  await newAnswer.save();

  return NextResponse.json(newAnswer, { status: 201 });
}

