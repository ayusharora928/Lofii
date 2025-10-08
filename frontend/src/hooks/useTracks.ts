import { useEffect, useState } from "react";
import { getTracks, getRandomTrack } from "../api"; // your API calls
import { Track } from "../types/track";

interface UseTracksReturn {
  tracks: Track[];
  featured: Track[];
  currentTrack: Track | null;
  loading: boolean;
  playRandomTrack: () => void;
  changeTrack: (track: Track) => void;
}

export function useTracks(): UseTracksReturn {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [featured, setFeatured] = useState<Track[]>([]);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch tracks from backend
  useEffect(() => {
    const loadTracks = async () => {
      try {
        const data = await getTracks();
        setTracks(data.slice(0, 4));       // Recently played
        setFeatured(data.slice(0, 6));     // Featured / Popular
      } catch (err) {
        console.error("❌ Failed to fetch tracks:", err);
      } finally {
        setLoading(false);
      }
    };
    loadTracks();
  }, []);

  // Play a random track
  const playRandomTrack = async () => {
    try {
      const track = await getRandomTrack();
      setCurrentTrack(track);
    } catch (err) {
      console.error("❌ Failed to play random track:", err);
    }
  };

  // Change current track
  const changeTrack = (track: Track) => {
    setCurrentTrack(track);
  };

  return {
    tracks,
    featured,
    currentTrack,
    loading,
    playRandomTrack,
    changeTrack,
  };
}
