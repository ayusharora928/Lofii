// ✅ App.tsx (FINAL with Search + LikedSongs support)

import { Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { MusicCard } from "./components/MusicCard";
import { Player } from "./components/Player";
import { Button } from "./components/ui/button";
import { ImageWithFallback } from "./components/figma/ImageWithFallback";
import { useTracks } from "./hooks/useTracks";
import { featuredAlbums, recentlyPlayed } from "./data/tracksData";
import { Track } from "./types/track";
import LikedSongs from "./pages/LikedSongs";
import SearchPage from "./pages/Search"; // ✅ SEARCH PAGE IMPORT

export default function App() {
  const {
    tracks,
    currentTrack,
    loading,
    playRandomTrack,
    changeTrack,
  } = useTracks();

  // Backend tracks (if available) or fallback static data
  const recent: Track[] = tracks.length ? tracks : recentlyPlayed;
  const albums: Track[] = featuredAlbums;

  return (
    <div className="h-screen flex flex-col bg-background text-foreground">
      {/* HEADER */}
      <Header />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        {/* ROUTING */}
        <main className="flex-1 overflow-y-auto pb-24">
          <Routes>
            {/* ✅ HOME PAGE */}
            <Route
              path="/"
              element={
                <>
                  {/* HERO SECTION */}
                  <section className="relative h-80 overflow-hidden">
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1681149341674-45fd772fd463?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                      alt="Featured concert"
                      className="w-full h-full object-cover"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

                    <div className="absolute bottom-8 left-8 right-8">
                      <h1 className="text-4xl font-bold mb-2">Welcome back!</h1>
                      <p className="text-xl text-muted-foreground mb-4">
                        Discover new music and enjoy your favorites
                      </p>
                      <Button size="lg" onClick={playRandomTrack} disabled={loading}>
                        {loading ? "Loading..." : "Play Random Track"}
                      </Button>
                    </div>
                  </section>

                  {/* HOME SECTIONS */}
                  <div className="p-8 space-y-12 max-w-7xl mx-auto">
                    <Section title="Recently Played" items={recent} onSelect={changeTrack} />
                    <Section title="Popular This Week" items={albums} onSelect={changeTrack} />

                    {/* MADE FOR YOU */}
                    <section>
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-semibold">Made For You</h2>
                        <Button variant="ghost">Show all</Button>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {albums.slice(0, 4).map((album, index) => (
                          <MusicCard
                            key={index}
                            title={`Mix ${index + 1}`}
                            artist="Personalized for you"
                            image={album.cover || album.image || ""}
                            type="playlist"
                            onClick={() => changeTrack(album)}
                          />
                        ))}
                      </div>
                    </section>
                  </div>
                </>
              }
            />

            {/* ✅ SEARCH ROUTE */}
            <Route path="/search" element={<SearchPage />} />

            {/* ✅ LIKED SONGS ROUTE */}
            <Route
              path="/liked"
              element={
                <LikedSongs
                  onPlayTrack={(track, playlist) => {
                    changeTrack(track);
                  }}
                />
              }
            />
          </Routes>
        </main>
      </div>

      {/* ✅ ALWAYS SHOW PLAYER */}
      <Player
        track={currentTrack}
        playlist={tracks.length ? tracks : recentlyPlayed}
        onTrackChange={changeTrack}
      />
    </div>
  );
}

/* ---------------- SECTION COMPONENT ---------------- */
function Section({
  title,
  items,
  onSelect,
}: {
  title: string;
  items: Track[];
  onSelect: (track: Track) => void;
}) {
  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">{title}</h2>
        <Button variant="ghost">Show all</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {items.map((item) => (
          <MusicCard
            key={item.id}
            title={item.title}
            artist={item.artist}
            image={item.cover || item.image || ""}
            onClick={() => onSelect(item)}
          />
        ))}
      </div>
    </section>
  );
}
