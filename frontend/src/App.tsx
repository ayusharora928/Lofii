import { useEffect, useState } from "react";
import { getTracks, getRandomTrack } from "./api"; // backend API
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { MusicCard } from "./components/MusicCard";
import { Player } from "./components/Player";
import { Button } from "./components/ui/button";
import { ImageWithFallback } from "./components/figma/ImageWithFallback";

export default function App() {
  // --- Existing static data ---
  const featuredAlbums = [
    {
      title: "Electric Nights",
      artist: "Synthwave Collective",
      image: "https://images.unsplash.com/photo-1692176548571-86138128e36c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJvbmljJTIwbXVzaWMlMjBkanxlbnwxfHx8fDE3NTkxMTMxODR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    {
      title: "Acoustic Sessions",
      artist: "Mountain Strings",
      image: "https://images.unsplash.com/photo-1626406212623-c35452f5c6ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhY291c3RpYyUyMGd1aXRhciUyMG11c2ljaWFufGVufDF8fHx8MTc1OTE1OTQ2MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    {
      title: "Vinyl Collection",
      artist: "Classic Grooves",
      image: "https://images.unsplash.com/photo-1629923759854-156b88c433aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW55bCUyMHJlY29yZCUyMGFsYnVtJTIwY292ZXJ8ZW58MXx8fHwxNzU5MTU1Mzk3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    {
      title: "Studio Sessions",
      artist: "Audio Engineers",
      image: "https://images.unsplash.com/photo-1598488035252-042a85bc8e5a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGhlYWRwaG9uZXMlMjBzdHVkaW98ZW58MXx8fHwxNzU5MDgzMTczfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    {
      title: "Festival Hits",
      artist: "Various Artists",
      image: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGZlc3RpdmFsJTIwY3Jvd2R8ZW58MXx8fHwxNzU5MDc4MDM4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    }
  ];

  const recentlyPlayed = [
    {
      title: "Midnight Jazz",
      artist: "Cool Cat Trio",
      image: "https://images.unsplash.com/photo-1598488035252-042a85bc8e5a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGhlYWRwaG9uZXMlMjBzdHVkaW98ZW58MXx8fHwxNzU5MDgzMTczfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    {
      title: "Rock Anthems",
      artist: "Thunder Road",
      image: "https://images.unsplash.com/photo-1681149341674-45fd772fd463?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGNvbmNlcnQlMjBzdGFnZSUyMGxpZ2h0c3xlbnwxfHx8fDE3NTkwNzgxNzF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    {
      title: "Folk Stories",
      artist: "Wandering Souls",
      image: "https://images.unsplash.com/photo-1626406212623-c35452f5c6ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhY291c3RpYyUyMGd1aXRhciUyMG11c2ljaWFufGVufDF8fHx8MTc1OTE1OTQ2MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    {
      title: "Electronic Dreams",
      artist: "Neon Pulse",
      image: "https://images.unsplash.com/photo-1692176548571-86138128e36c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJvbmljJTIwbXVzaWMlMjBkanxlbnwxfHx8fDE3NTkxMTMxODR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    }
  ];

  // --- Backend state ---
  const [recentlyPlayedBackend, setRecentlyPlayedBackend] = useState<any[]>([]);
  const [featuredAlbumsBackend, setFeaturedAlbumsBackend] = useState<any[]>([]);
  const [currentTrack, setCurrentTrack] = useState<{
    title: string;
    artist: string;
    url: string;
    album_cover?: string;
  } | null>(null);

  // Fetch backend tracks
  useEffect(() => {
    getTracks()
      .then((tracks) => {
        setRecentlyPlayedBackend(tracks.slice(0, 4));
        setFeaturedAlbumsBackend(tracks.slice(0, 6));
      })
      .catch((err) => console.error("Failed to fetch tracks:", err));
  }, []);

  // Play random track
  const playRandomTrack = async () => {
    try {
      const track = await getRandomTrack();
      setCurrentTrack({
        title: track.title,
        artist: track.artist,
        url: track.url,
        album_cover: track.album_cover,
      });
    } catch (err) {
      console.error("Failed to play random track:", err);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto pb-24">
          {/* Hero Section */}
          <div className="relative h-80 overflow-hidden">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1681149341674-45fd772fd463?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGNvbmNlcnQlMjBzdGFnZSUyMGxpZ2h0c3xlbnwxfHx8fDE3NTkwNzgxNzF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Featured concert"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8">
              <h1 className="text-4xl font-bold mb-2">Welcome back!</h1>
              <p className="text-xl text-muted-foreground mb-4">
                Discover new music and enjoy your favorites
              </p>
              <Button size="lg" onClick={playRandomTrack}>
                Play Random Track
              </Button>
            </div>
          </div>

          <div className="p-8 space-y-8">
            {/* Recently Played */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">Recently Played</h2>
                <Button variant="ghost">Show all</Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {(recentlyPlayedBackend.length > 0 ? recentlyPlayedBackend : recentlyPlayed).map(
                  (item, index) => (
                    <MusicCard
                      key={index}
                      title={item.title}
                      artist={item.artist}
                      image={item.album_cover || item.image}
                      onClick={() =>
                        setCurrentTrack({
                          title: item.title,
                          artist: item.artist,
                          url: item.url,
                          album_cover: item.album_cover || item.image,
                        })
                      }
                    />
                  )
                )}
              </div>
            </section>

            {/* Popular This Week */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">Popular This Week</h2>
                <Button variant="ghost">Show all</Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {(featuredAlbumsBackend.length > 0 ? featuredAlbumsBackend : featuredAlbums).map(
                  (album, index) => (
                    <MusicCard
                      key={index}
                      title={album.title}
                      artist={album.artist}
                      image={album.album_cover || album.image}
                      onClick={() =>
                        setCurrentTrack({
                          title: album.title,
                          artist: album.artist,
                          url: album.url,
                          album_cover: album.album_cover || album.image,
                        })
                      }
                    />
                  )
                )}
              </div>
            </section>

            {/* Made For You */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">Made For You</h2>
                <Button variant="ghost">Show all</Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {featuredAlbums.slice(0, 4).map((album, index) => (
                  <MusicCard
                    key={index}
                    title={`Mix ${index + 1}`}
                    artist="Personalized for you"
                    image={album.image}
                    type="playlist"
                    onClick={() =>
                      setCurrentTrack({
                        title: `Mix ${index + 1}`,
                        artist: "Personalized for you",
                        url: album.url || "",
                        album_cover: album.image,
                      })
                    }
                  />
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>

      {/* Player with backend playlist */}
      <Player
        track={currentTrack}
        playlist={recentlyPlayedBackend.length ? recentlyPlayedBackend : recentlyPlayed}
        onTrackChange={(track) => setCurrentTrack(track)}
      />
    </div>
  );
}
