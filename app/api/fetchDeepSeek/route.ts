import { NextResponse } from "next/server";

let aiAnalysis: string | null = null;

// Utility function to extract only the final output from the model's response.
function extractFinalOutput(text: string): string {
  // Define a marker that the model uses to indicate its final answer.
  const marker = "Final Answer:";
  const index = text.indexOf(marker);
  if (index !== -1) {
    return text.slice(index + marker.length).trim();
  }
  return text.trim();
}

function formatTranscript(transcript: any): string {
    if (!Array.isArray(transcript)) return "No transcript available.";
  
    return transcript
      .map((entry) => entry.text) // Extract the text from each object
      .join(" "); // Combine into a single string
  }

export async function POST(req: Request) {
  try {
    const { likes, views, commentsDB, transcript } = await req.json();
    console.log("Received transcript:", transcript);
    const transcriptText = transcript?.fullText || "No transcript available.";
    console.log(transcriptText);

    // Validate API Key
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      throw new Error("OpenRouter API key is missing in environment variables.");
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "google/gemini-2.0-pro-exp-02-05:free",
        "messages": [
          {
            "role": "user",
            "content": `Analyze this YouTube video data:
            
- Likes: ${likes}
- Views: ${views}
- Transcript text: ${transcriptText}
- Comments: ${JSON.stringify(commentsDB, null, 2)}
I have given you some parameters of a youtube video like:
Likes on the video,Views on the video,the comments data that we fetched with their intent and the videos transcript text it represent what the creator is speaking in the video.
Act as an professional Youtube Reviewer and Advisor and give advice and insights using sentiment and engagement.
Thoroughly analyze these parameters one by one and give an overall report in the structure.

Pros of the video:
Cons of the video:
A final Advice to creator what to Improve:


`
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    const rawOutput = data.choices?.[0]?.message?.content || "No response from model.";
    const finalOutput = extractFinalOutput(rawOutput);
    aiAnalysis = finalOutput;
    return NextResponse.json({ result: aiAnalysis });
  } catch (error) {
    console.error("Error in DeepSeek API:", error);
    return NextResponse.json({ error: "Failed to fetch AI analysis" }, { status: 500 });
  }
}

export async function GET() {
  if (!aiAnalysis) {
    return NextResponse.json({ error: "No AI analysis available. Submit data first." }, { status: 404 });
  }
  return NextResponse.json({ result: aiAnalysis });
}
