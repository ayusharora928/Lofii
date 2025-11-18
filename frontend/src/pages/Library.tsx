import { useEffect, useState } from "react";
import { Track } from "../types/track";
import { MusicCard } from "../components/MusicCard";
import { Heart, Music, ListMusic } from "lucide-react";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Library() {
  const navigate = useNavigate();
  const [likedTracks, setLikedTracks] = useState<Track[]>([]);

  const playlists = [
    { name: "Chill Vibes", icon: Music },
    { name: "My Playlist #1", icon: Music },
    { name: "Workout Mix", icon: Music },
  ];

  // Load liked songs
  useEffect(() => {
    try {
      const saved = localStorage.getItem("lofichill-favorites");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setLikedTracks(parsed);
      }
    } catch {
      localStorage.removeItem("lofichill-favorites");
    }
  }, []);

  return (
    <div className="p-8 space-y-10 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Your Library</h1>

      {/* ❤️ LIKED SONGS */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Heart className="h-5 w-5 text-pink-500" /> Liked Songs
          </h2>
          <Button variant="ghost" onClick={() => navigate("/liked")}>
            View All
          </Button>
        </div>

        {likedTracks.length === 0 ? (
          <p className="text-muted-foreground">You haven't liked any songs yet.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {likedTracks.slice(0, 6).map((track, i) => (
              <MusicCard
                key={track.id || i}
                title={track.title}
                artist={track.artist}
                image={track.cover || track.album_cover || track.image || ""}
                onClick={() => navigate("/liked")}
              />
            ))}
          </div>
        )}
      </section>

      {/* 🎵 PLAYLISTS */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <ListMusic className="h-5 w-5 text-blue-500" /> Your Playlists
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {playlists.map((p, i) => (
            <div
              key={i}
              className="p-4 rounded-lg bg-accent/40 hover:bg-accent cursor-pointer transition flex flex-col items-center justify-center gap-2"
            >
              <p.icon className="h-8 w-8" />
              <p className="font-medium">{p.name}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
