import { useEffect, useState } from "react";
import { Track } from "../types/track";
import { MusicCard } from "../components/MusicCard";
import { Trash2 } from "lucide-react";

interface LikedSongsProps {
  onPlayTrack: (track: Track, playlist: Track[]) => void;
}

export default function LikedSongs({ onPlayTrack }: LikedSongsProps) {
  const [likedTracks, setLikedTracks] = useState<Track[]>([]);

  // Load favorites safely
  useEffect(() => {
    try {
      const saved = localStorage.getItem("lofichill-favorites");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setLikedTracks(parsed);
        }
      }
    } catch (e) {
      console.error("Failed to load favorites:", e);
      localStorage.removeItem("lofichill-favorites");
    }
  }, []);

  // Remove track from liked
  const removeFromLiked = (id: string | number | undefined) => {
    const updated = likedTracks.filter((t) => t.id !== id);
    setLikedTracks(updated);
    localStorage.setItem("lofichill-favorites", JSON.stringify(updated));
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">❤️ Liked Songs</h1>

      {/* Empty */}
      {likedTracks.length === 0 && (
        <p className="text-muted-foreground text-lg">
          You haven't liked any songs yet.
        </p>
      )}

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {likedTracks.map((track, index) => (
          <div key={track.id || index} className="relative group">
            <MusicCard
              title={track.title}
              artist={track.artist}
              image={track.cover || track.album_cover || track.image || ""}
              onClick={() => onPlayTrack(track, likedTracks)}
            />

            {/* Remove button */}
            <button
              onClick={() => removeFromLiked(track.id)}
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition bg-background/80 p-1 rounded-full shadow"
            >
              <Trash2 size={16} className="text-red-500" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
