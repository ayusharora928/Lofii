import React from "react";
import MusicCard from "../components/MusicCard";
import TrackList from "../TrackList";

export default function Home() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Welcome to LoFiChill 🎧</h1>
      <TrackList />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MusicCard />
        <MusicCard />
        <MusicCard />
      </div>
    </div>
  );
}
