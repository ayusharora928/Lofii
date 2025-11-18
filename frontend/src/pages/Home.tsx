import { featuredAlbums, recentlyPlayed, tracks as staticTracks } from "../data/appData";
import { Track } from "../types/track";
import { MusicCard } from "../components/MusicCard";
import { useTracks } from "../hooks/useTracks";
import { Button } from "../components/ui/button";

export default function Home() {
  const { tracks, changeTrack } = useTracks();

  // Merge backend + static fallback
  const recent: Track[] = tracks.length ? tracks : recentlyPlayed;
  const trending: Track[] = staticTracks.slice(0, 6); // top 6 trending tracks (demo)
  const albums = featuredAlbums;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12">
      {/* TITLE */}
      <h1 className="text-3xl font-bold">Welcome to LoFiChill 🎧</h1>

      {/* RECENTLY PLAYED */}
      <HomeSection title="Recently Played">
        <CardGrid items={recent} onSelect={changeTrack} />
      </HomeSection>

      {/* FEATURED ALBUMS */}
      <HomeSection title="Featured Albums">
        <CardGrid
          items={albums.map((a) => ({
            ...a,
            id: a.id,
            title: a.title,
            artist: a.artist,
            cover: a.cover,
          }))}
          onSelect={changeTrack}
        />
      </HomeSection>

      {/* TRENDING */}
      <HomeSection title="Trending Now">
        <CardGrid items={trending} onSelect={changeTrack} />
      </HomeSection>
    </div>
  );
}

/* ----------------------------------------------------- */
/* 🟦 Reusable Section Component                         */
/* ----------------------------------------------------- */
function HomeSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">{title}</h2>
        <Button variant="ghost">Show all</Button>
      </div>
      {children}
    </section>
  );
}

/* ----------------------------------------------------- */
/* 🟩 Reusable Card Grid                                 */
/* ----------------------------------------------------- */
function CardGrid({ items, onSelect }: { items: Track[]; onSelect: (t: Track) => void }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {items.map((item) => (
        <MusicCard
          key={item.id}
          title={item.title}
          artist={item.artist}
          image={item.cover || item.image || item.album_cover || ""}
          track={item}
          onClick={() => onSelect(item)}
        />
      ))}
    </div>
  );
}
