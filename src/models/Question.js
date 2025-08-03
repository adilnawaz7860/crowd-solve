import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  tags: [String],
  isDeleted: { type: Boolean, default: false },
  deletedAt: Date,
}, { timestamps: true });

export default mongoose.models.Question || mongoose.model("Question", QuestionSchema);
