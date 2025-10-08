import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { MusicCard } from "./components/MusicCard";
import { Player } from "./components/Player";
import { Button } from "./components/ui/button";
import { ImageWithFallback } from "./components/figma/ImageWithFallback";
import { useTracks } from "./hooks/useTracks";

export default function App() {
  // Use custom hook for dynamic tracks
  const { tracks, featured, currentTrack, loading, playRandomTrack, changeTrack } = useTracks();

  // Data fallbacks
  const recent = tracks;
  const albums = featured;

  return (
    <div className="h-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <Header />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto pb-24">
          {/* Hero Section */}
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

          {/* Main Sections */}
          <div className="p-8 space-y-12 max-w-7xl mx-auto">
            {/* Recently Played */}
            <Section title="Recently Played" items={recent} onSelect={changeTrack} />

            {/* Popular This Week */}
            <Section title="Popular This Week" items={albums} onSelect={changeTrack} />

            {/* Made For You */}
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
                    image={album.album_cover || album.image || ""}
                    type="playlist"
                    onClick={() => changeTrack(album)}
                  />
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>

      {/* Player */}
      <Player track={currentTrack} playlist={recent} onTrackChange={changeTrack} />
    </div>
  );
}

/* 🧩 Reusable Section Component */
function Section({
  title,
  items,
  onSelect,
}: {
  title: string;
  items: any[];
  onSelect: (track: any) => void;
}) {
  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">{title}</h2>
        <Button variant="ghost">Show all</Button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {items.map((item, index) => (
          <MusicCard
            key={index}
            title={item.title}
            artist={item.artist}
            image={item.album_cover || item.image || ""}
            onClick={() => onSelect(item)}
          />
        ))}
      </div>
    </section>
  );
}
