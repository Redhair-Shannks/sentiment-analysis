from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from youtube_comment_downloader import YoutubeCommentDownloader, SORT_BY_RECENT

# ✅ Define FastAPI instance BEFORE using it
app = FastAPI(title="YouTube Comments Scraper API")

# Define request model
class VideoURL(BaseModel):
    url: str

@app.post("/comments/")
def get_comments(video: VideoURL):
    """
    Fetches YouTube comments for a given video URL.
    """
    try:
        # Initialize the YouTube comment downloader
        downloader = YoutubeCommentDownloader()
        print(f"Fetching comments for: {video.url}")

        comments = downloader.get_comments_from_url(video.url, sort_by=SORT_BY_RECENT)
        if not comments:
            print("No comments found.")
            return {"message": "No comments available for this video."}

        data = []
        for comment in comments:
            data.append({
                "text": comment.get('text', ''),
                "votes": comment.get('votes', 0),
                "hearted": comment.get('heart', False),
                "replies": comment.get('reply_count', 0) or (1 if comment.get('reply', False) else 0),
                "time": comment.get('time', "Unknown")
            })

        print(f"Fetched {len(data)} comments successfully.")
        return {"comments": data}

    except Exception as e:
        print("Error:", str(e))
        raise HTTPException(status_code=500, detail=str(e))

# ✅ Add a check to run FastAPI only if script is executed directly
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
