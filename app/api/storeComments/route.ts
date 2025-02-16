import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongo";
import { Comment } from "@/lib/models/comment";

// Ensure this uses the App Router (for Next.js 13+)
export async function POST(req: Request) {
    try {
        await connectDB();
        const { comments } = await req.json();

        if (!comments || !Array.isArray(comments)) {
            return NextResponse.json({ message: "Invalid data format" }, { status: 400 });
        }

        // Delete all old comments
        await Comment.deleteMany({});

        // Insert new comments
        const sanitizedComments = comments.map(({ text, votes, hearted, replies, time }) => ({
            text,
            votes: Number(votes),  
            hearted: Boolean(hearted),
            replies: Number(replies),
            time,
        }));

        const res=await Comment.insertMany(sanitizedComments);
        console.log("Inserted comments: ",res);

        return NextResponse.json({ message: "Comments stored successfully!" }, { status: 200 });
    } catch (error) {
        console.error("Error storing comments:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
