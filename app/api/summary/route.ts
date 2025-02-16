import { NextResponse } from "next/server";

// Global variable to store the computed summary
let computedSummary: any = null;

export async function POST(req: Request) {
  try {
    // Expecting the following input:
    // { likes, views, commentsDB, transcript }
    const { likes, views, commentsDB, transcript } = await req.json();
    console.log(commentsDB);

    if (!Array.isArray(commentsDB)) {
      return NextResponse.json({ error: "Invalid commentsDB input" }, { status: 400 });
    }

    // 1. Sentiment Distribution (for a Pie Chart)
    const sentimentDistribution = {
        positive: commentsDB.filter(
          (c: any) => c.sentiment && c.sentiment.toLowerCase().trim() === "positive"
        ).length,
        neutral: commentsDB.filter(
          (c: any) => c.sentiment && c.sentiment.toLowerCase().trim() === "neutral"
        ).length,
        negative: commentsDB.filter(
          (c: any) => c.sentiment && c.sentiment.toLowerCase().trim() === "negative"
        ).length,
      };
  
      // 2. Engagement Metrics (for a Grouped Bar Chart)
      const engagementMetrics = {
        positive: {
          votes: commentsDB
            .filter((c: any) => c.sentiment && c.sentiment.toLowerCase().trim() === "positive")
            .reduce((sum: number, c: any) => sum + (c.votes || 0), 0),
          hearted: commentsDB
            .filter((c: any) => c.sentiment && c.sentiment.toLowerCase().trim() === "positive")
            .reduce((sum: number, c: any) => sum + (c.hearted ? 1 : 0), 0),
          replies: commentsDB
            .filter((c: any) => c.sentiment && c.sentiment.toLowerCase().trim() === "positive")
            .reduce((sum: number, c: any) => sum + (c.replies || 0), 0),
        },
        neutral: {
          votes: commentsDB
            .filter((c: any) => c.sentiment && c.sentiment.toLowerCase().trim() === "neutral")
            .reduce((sum: number, c: any) => sum + (c.votes || 0), 0),
          hearted: commentsDB
            .filter((c: any) => c.sentiment && c.sentiment.toLowerCase().trim() === "neutral")
            .reduce((sum: number, c: any) => sum + (c.hearted ? 1 : 0), 0),
          replies: commentsDB
            .filter((c: any) => c.sentiment && c.sentiment.toLowerCase().trim() === "neutral")
            .reduce((sum: number, c: any) => sum + (c.replies || 0), 0),
        },
        negative: {
          votes: commentsDB
            .filter((c: any) => c.sentiment && c.sentiment.toLowerCase().trim() === "negative")
            .reduce((sum: number, c: any) => sum + (c.votes || 0), 0),
          hearted: commentsDB
            .filter((c: any) => c.sentiment && c.sentiment.toLowerCase().trim() === "negative")
            .reduce((sum: number, c: any) => sum + (c.hearted ? 1 : 0), 0),
          replies: commentsDB
            .filter((c: any) => c.sentiment && c.sentiment.toLowerCase().trim() === "negative")
            .reduce((sum: number, c: any) => sum + (c.replies || 0), 0),
        },
      };
  
      // 3. Time Analysis (for Line/Bar Charts)
      const sentimentOverTime: { hour: number; positive: number; neutral: number; negative: number }[] = [];
      for (let h = 0; h < 24; h++) {
        sentimentOverTime.push({ hour: h, positive: 0, neutral: 0, negative: 0 });
      }
      commentsDB.forEach((comment: any) => {
        if (comment.timestamp) {
          const date = new Date(comment.timestamp);
          const hour = date.getUTCHours();
          const sentimentValue = comment.sentiment ? comment.sentiment.toLowerCase().trim() : "";
          if (sentimentValue === "positive") {
            sentimentOverTime[hour].positive++;
          } else if (sentimentValue === "neutral") {
            sentimentOverTime[hour].neutral++;
          } else if (sentimentValue === "negative") {
            sentimentOverTime[hour].negative++;
          }
        }
      });
      let peakCommentingHour = 0;
      let maxCount = 0;
      sentimentOverTime.forEach(entry => {
        const total = entry.positive + entry.neutral + entry.negative;
        if (total > maxCount) {
          maxCount = total;
          peakCommentingHour = entry.hour;
        }
      });
  

    // 4. Word & Emoji Trends (for Word Cloud and Bar Charts)
    const stopWords = new Set(["the", "and", "a", "to", "of", "in", "is", "it", "that", "this"]);
    const wordFrequency: Record<string, number> = {};
    const hashtagFrequency: Record<string, number> = {};
    const emojiFrequency: Record<string, number> = {};

    const hashtagRegex = /#[\w]+/g;
    const emojiRegex = /[\u{1F600}-\u{1F64F}]/gu; // basic emoji regex

    commentsDB.forEach((comment: any) => {
      const words = comment.text.split(/\s+/);
      words.forEach(word => {
        const lower = word.toLowerCase();
        // Count hashtags
        const hashtags = lower.match(hashtagRegex);
        if (hashtags) {
          hashtags.forEach(tag => {
            hashtagFrequency[tag] = (hashtagFrequency[tag] || 0) + 1;
          });
        }
        // Count emojis
        const emojis = word.match(emojiRegex);
        if (emojis) {
          emojis.forEach(emo => {
            emojiFrequency[emo] = (emojiFrequency[emo] || 0) + 1;
          });
        }
        // Count normal words (exclude stop words)
        if (!stopWords.has(lower) && lower.length > 1) {
          wordFrequency[lower] = (wordFrequency[lower] || 0) + 1;
        }
      });
    });

    const wordFrequencyArray = Object.entries(wordFrequency).map(([word, count]) => ({ word, count }));
    const hashtagFrequencyArray = Object.entries(hashtagFrequency).map(([hashtag, count]) => ({ hashtag, count }));
    const emojiFrequencyArray = Object.entries(emojiFrequency).map(([emoji, count]) => ({ emoji, count }));

    const summary = {
      sentimentDistribution,
      engagementMetrics,
      timeAnalysis: {
        sentimentOverTime,
        peakCommentingHour,
      },
      wordAndEmojiTrends: {
        wordFrequency: wordFrequencyArray,
        hashtagFrequency: hashtagFrequencyArray,
        emojiFrequency: emojiFrequencyArray,
      }
    };

    // Store computed summary in global variable
    computedSummary = summary;
    return NextResponse.json({ summary });
  } catch (error) {
    console.error("Error computing summary:", error);
    return NextResponse.json({ error: "Failed to compute summary" }, { status: 500 });
  }
}



export async function GET() {
  if (!computedSummary) {
    return NextResponse.json({ error: "No summary available. Please submit data via POST first." }, { status: 404 });
  }
  return NextResponse.json({ summary: computedSummary });
}
