import React from "react";
import MusicCard from "../components/MusicCard";

export default function Library() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Your Library</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MusicCard />
        <MusicCard />
        <MusicCard />
      </div>
    </div>
  );
}
