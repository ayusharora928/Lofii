import { Play, SkipBack, SkipForward, Volume2, Shuffle, Repeat, Heart } from "lucide-react";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function Player() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          {/* Currently Playing */}
          <div className="flex items-center space-x-4 min-w-0 flex-1">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1629923759854-156b88c433aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW55bCUyMHJlY29yZCUyMGFsYnVtJTIwY292ZXJ8ZW58MXx8fHwxNzU5MTU1Mzk3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Current song"
              className="h-14 w-14 rounded object-cover"
            />
            <div className="min-w-0">
              <p className="font-medium truncate">Midnight Dreams</p>
              <p className="text-sm text-muted-foreground truncate">The Velvet Echoes</p>
            </div>
            <Button variant="ghost" size="icon">
              <Heart className="h-4 w-4" />
            </Button>
          </div>

          {/* Player Controls */}
          <div className="flex flex-col items-center space-y-2 flex-1 max-w-md">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <Shuffle className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <SkipBack className="h-5 w-5" />
              </Button>
              <Button size="icon" className="h-10 w-10">
                <Play className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <SkipForward className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Repeat className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center space-x-2 w-full">
              <span className="text-xs text-muted-foreground">1:23</span>
              <Slider value={[33]} max={100} step={1} className="flex-1" />
              <span className="text-xs text-muted-foreground">3:45</span>
            </div>
          </div>

          {/* Volume */}
          <div className="flex items-center space-x-2 flex-1 justify-end">
            <Volume2 className="h-4 w-4" />
            <Slider value={[70]} max={100} step={1} className="w-24" />
          </div>
        </div>
      </div>
    </div>
  );
}