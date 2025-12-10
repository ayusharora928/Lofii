from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import yt_dlp
import json
import subprocess

app = FastAPI(title="LoFiChill Backend (Python 3.13 Compatible)")

# ------------------------------------------------------------
# CORS
# ------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ------------------------------------------------------------
# 🔍 SEARCH USING YT-DLP (works on all Python versions)
# ------------------------------------------------------------
@app.get("/search")
async def search_tracks(q: str):
    """
    Search YouTube using yt-dlp --dump-json
    """
    try:
        cmd = [
            "yt-dlp",
            f"ytsearch10:{q}",
            "--dump-json",       # return JSON output
            "--skip-download"
        ]

        result = subprocess.check_output(cmd).decode("utf-8")

        # yt-dlp prints multiple JSON objects line-by-line → split
        lines = result.strip().split("\n")
        videos = [json.loads(line) for line in lines]

        tracks = []
        for v in videos:
            tracks.append({
                "id": v.get("id"),
                "title": v.get("title") or "Unknown Title",
                "artist": v.get("uploader") or "Unknown Artist",
                "thumbnail": v.get("thumbnail"),
            })

        return tracks

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ------------------------------------------------------------
# 🎵 GET DIRECT STREAM URL
# ------------------------------------------------------------
@app.get("/stream/{video_id}")
async def get_stream(video_id: str):
    """
    Convert video → streaming URL
    """
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
            "url": info.get("url"),
            "title": info.get("title"),
            "artist": info.get("uploader"),
            "thumbnail": info.get("thumbnail")
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ------------------------------------------------------------
# FULL METADATA + STREAM (optional)
# ------------------------------------------------------------
@app.get("/track/{video_id}")
async def track_details(video_id: str):
    return await get_stream(video_id)


@app.get("/")
def root():
    return {"message": "LoFiChill backend running!"}
