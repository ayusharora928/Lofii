from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import httpx
import random

app = FastAPI(title="Ayush's LoFi Backend")

# Allow all origins for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Jamendo API setup
JAMENDO_API_URL = "https://api.jamendo.com/v3.0/tracks"
JAMENDO_CLIENT_ID = "2c3bc555"  # Your Jamendo Client ID

# Endpoint to get tracks from Jamendo
@app.get("/tracks")
async def get_tracks():
    params = {
        "client_id": JAMENDO_CLIENT_ID,
        "limit": 10,   # Number of tracks to fetch
        "format": "json"
    }
    async with httpx.AsyncClient() as client:
        response = await client.get(JAMENDO_API_URL, params=params)
        tracks = response.json().get("results", [])
        # Return only necessary info for frontend
        return [
            {
                "title": track["name"],
                "artist": track["artist_name"],
                "url": track["audio"],
                "album_cover": track.get("album_image")  # optional, if you want album art
            } 
            for track in tracks
        ]

# Endpoint to get a random track
@app.get("/random-track")
async def get_random_track():
    tracks = await get_tracks()
    return random.choice(tracks)

# Root endpoint
@app.get("/")
def root():
    return {"message": "Ayush's LoFi Backend is running!"}
