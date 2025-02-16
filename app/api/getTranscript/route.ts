import { NextResponse } from "next/server";
import { YoutubeTranscript } from "youtube-transcript";

export async function POST(req: Request) {
  try {
    const { youtubeLink } = await req.json();

    if (!youtubeLink) {
      return NextResponse.json({ error: "Missing YouTube link" }, { status: 400 });
    }

    // Extract videoId from the provided YouTube link
    const videoId = extractVideoId(youtubeLink);

    if (!videoId) {
      return NextResponse.json({ error: "Invalid YouTube URL" }, { status: 400 });
    }

    console.log("Fetching transcript for video ID:", videoId);

    // Fetch transcript server-side (to bypass CORS issues)
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);

    // Convert transcript into a full text string
    const fullText = transcript.map(entry => entry.text).join(" ");
    console.log("Full Transcript Text:", fullText);

    // Enable CORS headers
    return NextResponse.json(
      { transcript, fullText },
      {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      }
    );
  } catch (error) {
    console.error("Transcript Fetch Error:", error);
    return NextResponse.json({ error: "Failed to fetch transcript" }, { status: 500 });
  }
}

// ✅ Extracts video ID from different YouTube URL formats
function extractVideoId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/(?:[^/]+\/.*|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
  return match ? match[1] : null;
}
