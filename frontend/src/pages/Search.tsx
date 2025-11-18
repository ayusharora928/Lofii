// src/pages/Search.tsx

import { useState, useEffect } from "react";
import { MusicCard } from "../components/MusicCard";
import { useTracks } from "../hooks/useTracks";
import { Track } from "../types/track";

export default function SearchPage() {
  const { searchTracks, changeTrack, tracks, loading } = useTracks();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Track[]>([]);

  /* ------------------------------------------------------------
     🔍 Call backend search as user types
  ------------------------------------------------------------ */
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      const r = await searchTracks(query);
      setResults(r);
    }, 400); // debounce input

    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* SEARCH BAR */}
      <input
        placeholder="Search any song from YouTube..."
        className="w-full p-3 rounded-lg bg-muted text-foreground mb-6 focus:outline-none"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {/* LOADING STATE */}
      {loading && (
        <p className="text-muted-foreground text-lg">Searching...</p>
      )}

      {/* EMPTY */}
      {!loading && query && results.length === 0 && (
        <p className="text-muted-foreground text-lg mt-8">
          No results for <strong>"{query}"</strong> 😔
        </p>
      )}

      {/* RESULTS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {results.map((track) => (
          <MusicCard
            key={track.id}
            title={track.title}
            artist={track.artist}
            image={track.image}
            track={track}
            onClick={() => changeTrack(track)}
          />
        ))}
      </div>
    </div>
  );
}
