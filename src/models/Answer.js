import mongoose from "mongoose";

const AnswerSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isDeleted: { type: Boolean, default: false },
    deletedAt: Date,
    votes: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        type: { type: String, enum: ["UPVOTE", "DOWNVOTE"] },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Answer ||
  mongoose.model("Answer", AnswerSchema);
