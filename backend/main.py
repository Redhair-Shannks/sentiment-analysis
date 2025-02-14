import sys

# ✅ Force UTF-8 encoding to avoid Windows cmd Unicode issues
sys.stdout.reconfigure(encoding='utf-8')


import pandas as pd
import sys
import os
from itertools import islice
from youtube_comment_downloader import YoutubeCommentDownloader
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch

# Ensure a YouTube link is provided
if len(sys.argv) < 2:
    print("❌ Error: No YouTube link provided")
    sys.exit(1)

youtube_link = sys.argv[1]
print(f"🔗 Fetching comments from: {youtube_link}")

# Load RoBERTa sentiment analysis model
MODEL_NAME = "cardiffnlp/twitter-roberta-base-sentiment"
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModelForSequenceClassification.from_pretrained(MODEL_NAME)

LABELS = ["Negative", "Neutral", "Positive"]

def analyze_sentiment(text):
    """Analyze sentiment using RoBERTa model."""
    inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True, max_length=512)
    with torch.no_grad():
        outputs = model(**inputs)
    probs = torch.nn.functional.softmax(outputs.logits, dim=-1)
    return LABELS[probs.argmax().item()]

# Initialize YouTube Comment Downloader
downloader = YoutubeCommentDownloader()
comments = downloader.get_comments_from_url(youtube_link, sort_by=1)  # SORT_BY_RECENT

# Collect data
data = []
for comment in islice(comments, 1000):  
    text = comment['text']
    likes = comment.get('votes', 0)
    sentiment = analyze_sentiment(text)
    hearted = bool(comment.get('heart', False))  
    replies = comment.get('reply_count', 0) or (1 if comment.get('reply', False) else 0)
    date_time = comment.get('time', "Unknown")  
    
    data.append([text, sentiment, likes, hearted, replies, date_time])

# Convert to DataFrame and save as CSV
csv_path = os.path.join("public", "youtube_comments_sentiment.csv")
df = pd.DataFrame(data, columns=["Comment", "Sentiment", "Votes", "Hearted", "Replies", "Date/Time"])
df.to_csv(csv_path, index=False)

print(f"✅ Data saved to {csv_path}")
