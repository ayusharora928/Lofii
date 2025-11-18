from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import yt_dlp
from youtubesearchpython import VideosSearch

app = FastAPI(title="LoFiChill Universal Backend")

# CORS — allow everything during development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ------------------------------------------------------------
# 🔍 SEARCH SONGS (YouTube API replacement)
# ------------------------------------------------------------
@app.get("/search")
def search_tracks(q: str):
    """Search YouTube using a stable library (no HTML parsing)"""

    search = VideosSearch(q, limit=10)
    results = search.result()["result"]

    tracks = []

    for v in results:
        tracks.append({
            "id": v["id"],
            "title": v["title"],
            "artist": v.get("channel", {}).get("name", "Unknown Artist"),
            "thumbnail": v["thumbnails"][0]["url"],
        })

    return tracks


# ------------------------------------------------------------
# 🎵 GET DIRECT AUDIO STREAM URL
# ------------------------------------------------------------
@app.get("/stream/{video_id}")
def get_stream(video_id: str):
    """Return direct MP3/Opus streaming URL from YouTube"""

    try:
        ydl_opts = {
            "quiet": True,
            "format": "bestaudio"
        }

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(
                f"https://www.youtube.com/watch?v={video_id}",
                download=False
            )

        return {
            "url": info["url"],
            "title": info["title"],
            "artist": info.get("uploader"),
            "thumbnail": info.get("thumbnail")
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ------------------------------------------------------------
# 🎧 GET FULL TRACK DETAILS (search + stream)
# ------------------------------------------------------------
@app.get("/track/{video_id}")
def track_details(video_id: str):
    """Return title + artist + thumbnail + audio stream"""
    return get_stream(video_id)


@app.get("/")
def root():
    return {"message": "LoFiChill backend running with YouTube music!"}
