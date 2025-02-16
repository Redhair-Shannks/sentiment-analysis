import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { youtubeLink } = req.body;
    if (!youtubeLink) {
      return res.status(400).json({ error: "Missing YouTube link" });
    }

    // Run Python script or process comments (adjust as needed)
    // Example: const result = await runSentimentAnalysis(youtubeLink);

    return res.status(200).json({ message: "Analysis started successfully!" });
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
