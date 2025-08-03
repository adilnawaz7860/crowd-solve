import { NextResponse } from "next/server";
import {connectDB} from "../../../../lib/db.js";
import Question from "../../../../models/Question.js";

export async function GET(req, { params }) {
  await connectDB();
  const { questionId } = params;

  try {
    const question = await Question.findById(questionId).populate("userId", "name email");
    if (!question) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }
    return NextResponse.json(question);
  } catch (error) {
    return NextResponse.json({ error: "Invalid question ID" }, { status: 400 });
  }
}

// put 
export async function PUT(req, { params }) {
  await connectDB();
  const { questionId } = params;
  const { title, description } = await req.json();

  try {
    const updated = await Question.findByIdAndUpdate(
      questionId,
      { title, description },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Question updated", question: updated });
  } catch (err) {
    console.error("PUT error:", err);
    return NextResponse.json({ error: "Failed to update question" }, { status: 500 });
  }
}

// DELETE /api/question/[questionId] — delete a question
export async function DELETE(req, { params }) {
  await connectDB();
  const { questionId } = params;

  try {
    const deleted = await Question.findByIdAndDelete(questionId);
    if (!deleted) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Question deleted" });
  } catch (err) {
    console.error("DELETE error:", err);
    return NextResponse.json({ error: "Failed to delete question" }, { status: 500 });
  }
}

