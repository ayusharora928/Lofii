import { useEffect, useState, MouseEvent } from "react";
import { Play, Heart } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Track } from "../types/track";

interface MusicCardProps {
  title: string;
  artist: string;
  image?: string;
  type?: "album" | "playlist" | "artist";
  onClick?: () => void;      // play handler
  track?: Track;             // full track (for like/unlike)
}

const FAVORITES_KEY = "lofichill-favorites";

function loadFavorites(): Track[] {
  try {
    const saved = localStorage.getItem(FAVORITES_KEY);
    if (!saved) return [];
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveFavorites(list: Track[]) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(list));
}

function isFavorite(track?: Track): boolean {
  if (!track || track.id === undefined) return false;
  const list = loadFavorites();
  return list.some((t) => t.id === track.id);
}

export function MusicCard({
  title,
  artist,
  image,
  type = "album",
  onClick,
  track,
}: MusicCardProps) {
  const [liked, setLiked] = useState(false);

  // Sync liked state with localStorage whenever track changes
  useEffect(() => {
    setLiked(isFavorite(track));
  }, [track]);

  const fallbackImage =
    image || track?.cover || track?.album_cover || track?.image || "";

  const handleLike = (e: MouseEvent) => {
    e.stopPropagation(); // don’t trigger play

    if (!track) return;

    const list = loadFavorites();
    const exists = list.some((t) => t.id === track.id);

    let updated: Track[];
    if (exists) {
      updated = list.filter((t) => t.id !== track.id);
    } else {
      updated = [...list, track];
    }

    saveFavorites(updated);
    setLiked(!exists);
  };

  return (
    <Card
      className="group hover:bg-accent/50 transition-colors cursor-pointer rounded-lg"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="relative mb-4">
          <ImageWithFallback
            src={fallbackImage}
            alt={title}
            className="w-full aspect-square object-cover rounded-md"
          />

          {/* ❤️ Like button */}
          <Button
            size="icon"
            variant="ghost"
            className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition"
            onClick={handleLike}
          >
            <Heart
              className={
                liked ? "h-4 w-4 fill-red-500 text-red-500" : "h-4 w-4"
              }
            />
          </Button>

          {/* ▶ Play button */}
          <Button
            size="icon"
            className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
            onClick={(e) => {
              e.stopPropagation();
              onClick?.();
            }}
          >
            <Play className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-1">
          <h3 className="font-medium truncate">{title}</h3>
          <p className="text-sm text-muted-foreground truncate">{artist}</p>
        </div>
      </CardContent>
    </Card>
  );
}

// So you can import both ways: `import MusicCard` and `import { MusicCard }`
export default MusicCard;
