// src/hooks/useTracks.ts
import { useEffect, useState } from "react";
import { getTracks, getRandomTrack } from "../api";
import { Track } from "../types/track";
import { featuredAlbums, recentlyPlayed } from "../data/tracksData";

export function useTracks() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [featured, setFeatured] = useState<Track[]>(featuredAlbums);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // 🧠 Fetch tracks when component mounts
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const fetched = await getTracks();

        // Fallback: if API returns nothing, use static data
        if (fetched && fetched.length > 0) {
          setTracks(fetched);
        } else {
          setTracks(recentlyPlayed);
        }

        // Start with a random track
        const random = getRandomTrack(fetched?.length ? fetched : recentlyPlayed);
        setCurrentTrack(random);
      } catch (error) {
        console.error("Error fetching tracks:", error);
        setTracks(recentlyPlayed);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // 🎵 Play a random track from available tracks
  const playRandomTrack = () => {
    if (tracks.length === 0) return;
    const random = getRandomTrack(tracks);
    setCurrentTrack(random);
  };

  // 🔁 Change current track manually
  const changeTrack = (track: Track) => setCurrentTrack(track);

  return {
    tracks,
    featured,
    currentTrack,
    loading,
    playRandomTrack,
    changeTrack,
  };
}
