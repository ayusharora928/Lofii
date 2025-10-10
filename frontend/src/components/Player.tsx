import { useEffect, useRef, useState } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react";
import { Button } from "./ui/button";
import { Track } from "../types/track";

interface PlayerProps {
  track: Track | null;
  playlist?: Track[];
  onTrackChange?: (track: Track) => void;
}

export function Player({ track, playlist = [], onTrackChange }: PlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);

  // 🎧 Fallback if no URL present
  const getAudioSrc = (t: Track) =>
    t.url ||
    "https://cdn.pixabay.com/download/audio/2022/03/15/audio_5baf0e7e10.mp3?filename=lofi-study-112191.mp3";

  // 🔄 Sync playback when track changes
  useEffect(() => {
    if (!audioRef.current || !track) return;
    const src = getAudioSrc(track);
    audioRef.current.src = src;
    audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
  }, [track]);

  // ▶️ / ⏸️ Toggle play/pause
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  // 🔊 Adjust volume
  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (audioRef.current) audioRef.current.volume = newVol;
  };

  // ⏭️ / ⏮️ Skip
  const playNext = () => {
    if (!playlist.length || !track) return;
    const index = playlist.findIndex((t) => t.title === track.title);
    const next = playlist[(index + 1) % playlist.length];
    onTrackChange?.(next);
  };

  const playPrev = () => {
    if (!playlist.length || !track) return;
    const index = playlist.findIndex((t) => t.title === track.title);
    const prev = playlist[(index - 1 + playlist.length) % playlist.length];
    onTrackChange?.(prev);
  };

  // 🕒 Auto-play next track when one ends
  const handleEnded = () => playNext();

  if (!track) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-background/70 backdrop-blur-lg border-t border-border p-4 text-center text-muted-foreground">
        Select a track to start playing 🎶
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/70 backdrop-blur-lg border-t border-border p-4 flex items-center justify-between">
      {/* Track Info */}
      <div className="flex items-center space-x-4">
        {track.album_cover || track.image ? (
          <img
            src={track.album_cover || track.image}
            alt={track.title}
            className="w-12 h-12 rounded-md object-cover"
          />
        ) : (
          <div className="w-12 h-12 bg-muted rounded-md" />
        )}
        <div>
          <h3 className="font-medium">{track.title}</h3>
          <p className="text-sm text-muted-foreground">{track.artist}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" onClick={playPrev}>
          <SkipBack className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" onClick={togglePlay}>
          {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
        </Button>
        <Button variant="ghost" size="icon" onClick={playNext}>
          <SkipForward className="h-5 w-5" />
        </Button>
      </div>

      {/* Volume */}
      <div className="flex items-center space-x-2 w-32">
        <Volume2 className="h-4 w-4 text-muted-foreground" />
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={volume}
          onChange={handleVolume}
          className="w-full accent-primary"
        />
      </div>

      {/* Audio element */}
      <audio ref={audioRef} onEnded={handleEnded} />
    </div>
  );
}
