import { Play } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface MusicCardProps {
  title: string;
  artist: string;
  image: string;
  type?: "album" | "playlist" | "artist";
}

export function MusicCard({ title, artist, image, type = "album" }: MusicCardProps) {
  return (
    <Card className="group hover:bg-accent/50 transition-colors cursor-pointer">
      <CardContent className="p-4">
        <div className="relative mb-4">
          <ImageWithFallback
            src={image}
            alt={title}
            className="w-full aspect-square object-cover rounded-md"
          />
          <Button
            size="icon"
            className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
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