// src/api.ts
const API_BASE_URL = "http://localhost:8000";

export async function getTracks() {
  const response = await fetch(`${API_BASE_URL}/tracks`);
  if (!response.ok) throw new Error("Failed to fetch tracks");
  return response.json();
}

export async function getRandomTrack() {
  const response = await fetch(`${API_BASE_URL}/random-track`);
  if (!response.ok) throw new Error("Failed to fetch random track");
  return response.json();
}
