// src/api.ts

export const API_BASE = "http://localhost:8000";

/* -------------------------------------------
   🔍 SEARCH TRACKS (YouTube → Backend)
-------------------------------------------- */
export async function searchTracks(query: string) {
  const res = await fetch(`${API_BASE}/search?q=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error("Search failed");
  return await res.json();
}

/* -------------------------------------------
   🎵 GET STREAM URL FOR A TRACK
-------------------------------------------- */
export async function getStream(videoId: string) {
  const res = await fetch(`${API_BASE}/stream/${videoId}`);
  if (!res.ok) throw new Error("Stream lookup failed");
  return await res.json();
}
