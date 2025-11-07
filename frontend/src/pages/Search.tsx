import { useTracks } from "../hooks/useTracks";
import { MusicCard } from "../components/MusicCard";
import { useState } from "react";

export default function SearchPage() {
  const { tracks, changeTrack } = useTracks();
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = tracks.filter((t) =>
    t.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8">
      <input
        placeholder="Search songs..."
        className="w-full p-3 rounded-lg bg-muted text-foreground mb-6"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filtered.map((t) => (
          <MusicCard
            key={t.id}
            title={t.title}
            artist={t.artist}
            image={t.cover || t.image}
            onClick={() => changeTrack(t)}
          />
        ))}
      </div>
    </div>
  );
}
