// src/hooks/useTracks.ts
import { useEffect, useState } from "react";
import { Track } from "../types/track";

const API = "http://127.0.0.1:8000"; // local FastAPI backend

export function useTracks() {
  const [tracks, setTracks] = useState<Track[]>([]);          // search results
  const [trending, setTrending] = useState<Track[]>([]);      // backend trending
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [loading, setLoading] = useState(false);

  /* -----------------------------------------------------------
     🔥 Load Trending Songs on Homepage (Auto load)
  ----------------------------------------------------------- */
  useEffect(() => {
    fetchTrending();
  }, []);

  async function fetchTrending() {
    try {
      const res = await fetch(`${API}/search?q=lofi`);
      const data = await res.json();

      const items: Track[] = data.map((v: any) => ({
        id: v.id,
        title: v.title || "Unknown Track",
        artist: v.artist || "Unknown Artist",
        image: v.thumbnail,
        url: "",
      }));

      setTrending(items);
    } catch (e) {
      console.warn("Trending fetch failed:", e);
      setTrending([]);
    }
  }

  /* -----------------------------------------------------------
     🔍 Search Songs (YouTube Search)
  ----------------------------------------------------------- */
  async function searchTracks(query: string) {
    if (!query) return [];

    setLoading(true);
    try {
      const res = await fetch(`${API}/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();

      const results: Track[] = data.map((v: any) => ({
        id: v.id,
        title: v.title || "Unknown Track",
        artist: v.artist || "Unknown Artist",
        image: v.thumbnail,
        url: "",
      }));

      setTracks(results);
      return results;
    } catch (e) {
      console.error("Search failed:", e);
      return [];
    } finally {
      setLoading(false);
    }
  }

  /* -----------------------------------------------------------
     🎵 PLAY SONG (fetch stream URL)
  ----------------------------------------------------------- */
  async function changeTrack(track: Track) {
    if (!track.id) return;

    setLoading(true);
    try {
      const res = await fetch(`${API}/stream/${track.id}`);
      const data = await res.json();

      const playable: Track = {
        ...track,
        url: data.url,                      // actual audio stream
        title: data.title || track.title,
        artist: data.artist || track.artist,
        image: data.thumbnail || track.image,
      };

      setCurrentTrack(playable);
    } catch (e) {
      console.error("Could not load stream:", e);
    } finally {
      setLoading(false);
    }
  }

  /* -----------------------------------------------------------
     🔀 PLAY RANDOM (search or trending)
  ----------------------------------------------------------- */
  async function playRandomTrack() {
    const list = tracks.length ? tracks : trending;
    if (!list.length) return;

    const random = list[Math.floor(Math.random() * list.length)];
    await changeTrack(random);
  }

  return {
    tracks,          // search results
    trending,        // homepage trending
    currentTrack,
    loading,

    searchTracks,
    changeTrack,
    playRandomTrack,
  };
}
