import { NextResponse } from "next/server";
import { connectDB } from "../../../../../lib/db";
import Answer from "../../../../../models/Answer";
import mongoose from "mongoose";

export async function POST(req, { params }) {
  await connectDB();

  const { answerId } = params;
  const { type, userId } = await req.json(); // type = "UPVOTE" | "DOWNVOTE"

  if (!["UPVOTE", "DOWNVOTE"].includes(type)) {
    return NextResponse.json({ error: "Invalid vote type" }, { status: 400 });
  }

  const answer = await Answer.findById(answerId);
  if (!answer) {
    return NextResponse.json({ error: "Answer not found" }, { status: 404 });
  }

  const userObjectId = new mongoose.Types.ObjectId(userId);

  if (!Array.isArray(answer.votes)) {
    answer.votes = [];
  }

  // Find existing vote by this user
  const existingVoteIndex = answer.votes.findIndex((vote) =>
    vote.userId.toString() === userObjectId.toString()
  );

if (existingVoteIndex > -1) {
  const existingVote = answer.votes[existingVoteIndex];

  if (existingVote.type === type) {
    // Remove vote (toggle off)
    answer.votes.splice(existingVoteIndex, 1);
  } else {
    // Switch vote
    answer.votes[existingVoteIndex].type = type;
  }
} else {
  // New vote
  answer.votes.push({ userId: userObjectId, type });
}

// ✅ Force Mongoose to recognize the change
answer.markModified("votes");

await answer.save();

  // Calculate totals
  const upvotes = answer.votes.filter((v) => v.type === "UPVOTE").length;
  const downvotes = answer.votes.filter((v) => v.type === "DOWNVOTE").length;
  const netVotes = upvotes - downvotes;

  return NextResponse.json({
    message: "Vote recorded",
    netVotes,
    upvotes,
    downvotes,
    votes: answer.votes,
  });
}
