import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
    text: { type: String, required: true },
    votes: { type: Number, required: true, default: 0 },
    hearted: { type: Boolean, required: true, default: false },
    replies: { type: Number, required: true, default: 0 },
    time: { type: String, required: true },
    sentiment: { type: String, enum: ["Positive", "Negative", "Neutral"], default: "Neutral" }, // Added sentiment field
});

export const Comment = mongoose.models.Comment || mongoose.model("Comment", CommentSchema);
