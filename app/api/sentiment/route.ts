import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { comments } = await req.json();

    if (!comments || !Array.isArray(comments)) {
      return NextResponse.json({ error: "Invalid input data" }, { status: 400 });
    }

    // Hugging Face API Key (Ensure it's stored in .env.local)
    const HF_API_KEY = process.env.HF_API_KEY;
    if (!HF_API_KEY) {
      return NextResponse.json({ error: "Hugging Face API Key is missing" }, { status: 500 });
    }

    // Make request to Hugging Face Sentiment Model
    const response = await fetch("https://api-inference.huggingface.co/models/cardiffnlp/twitter-roberta-base-sentiment", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HF_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: comments }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Hugging Face API Error: ${response.status} - ${errorText}`);
    }

    const sentimentResults = await response.json();
    return NextResponse.json({ results: sentimentResults }, { status: 200 });

  } catch (error: any) {
    console.error("Error processing sentiment analysis:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
