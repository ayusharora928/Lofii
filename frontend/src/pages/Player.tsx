import React from "react";
import { Player } from "../components/Player";
import { useTracks } from "../hooks/useTracks";

export default function PlayerPage() {
  // Use the custom hook to fetch tracks dynamically
  const { tracks, currentTrack, loading, playRandomTrack, changeTrack } = useTracks();

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-background">
      {/* Player */}
      <Player
        track={currentTrack}
        playlist={tracks}
        onTrackChange={changeTrack}
      />

      {/* Optional: Show track grid */}
      {!loading && (
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl">
          {tracks.map((track, index) => (
            <div
              key={index}
              onClick={() => changeTrack(track)}
              className="cursor-pointer p-4 bg-card rounded-md hover:bg-accent/50 transition"
            >
              <img
                src={track.album_cover || track.image || track.cover}
                alt={track.title}
                className="w-full h-24 object-cover rounded-md mb-2"
              />
              <h3 className="font-medium truncate">{track.title}</h3>
              <p className="text-sm text-muted-foreground truncate">{track.artist}</p>
            </div>
          ))}
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <p className="mt-8 text-muted-foreground">Loading tracks...</p>
      )}

      {/* Optional: Button to play a random track */}
      <button
        onClick={playRandomTrack}
        disabled={loading}
        className="mt-6 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition"
      >
        {loading ? "Loading..." : "Play Random Track"}
      </button>
    </div>
  );
}
