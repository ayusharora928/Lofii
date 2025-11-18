// src/components/Player.tsx
import { useEffect, useRef, useState } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Repeat,
  Shuffle,
  ChevronUp,
  ListMusic,
  Heart,
} from "lucide-react";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Track } from "../types/track";

/* -------------------------------------------
   ❤️ FAVORITES HELPERS
-------------------------------------------- */
const FAVORITES_KEY = "lofichill-favorites";

function loadFavorites() {
  try {
    const saved = localStorage.getItem(FAVORITES_KEY);
    if (!saved) return [];
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveFavorites(list: any[]) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(list));
}

function isFavorite(track: any) {
  if (!track || track.id === undefined) return false;
  return loadFavorites().some((t) => t.id === track.id);
}

interface PlayerProps {
  track: Track | null;
  playlist?: Track[];
  onTrackChange?: (track: Track) => void;
}

export function Player({ track, playlist = [], onTrackChange }: PlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false); // ❤️
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isMini, setIsMini] = useState(false);

  /* ❤️ Update favorite status */
  useEffect(() => {
    if (track) setIsLiked(isFavorite(track));
  }, [track]);

  const toggleLike = () => {
    if (!track) return;

    const favorites = loadFavorites();
    const exists = favorites.some((t) => t.id === track.id);

    const updated = exists
      ? favorites.filter((t) => t.id !== track.id)
      : [...favorites, track];

    saveFavorites(updated);
    setIsLiked(!exists);
  };

  /* Restore last track */
  useEffect(() => {
    const savedTrack = localStorage.getItem("lofichill-current-track");
    if (savedTrack && !track && onTrackChange) {
      onTrackChange(JSON.parse(savedTrack));
    }
  }, []);

  useEffect(() => {
    if (track) {
      localStorage.setItem("lofichill-current-track", JSON.stringify(track));
    }
  }, [track]);

  useEffect(() => {
    if (progress > 0)
      localStorage.setItem("lofichill-progress", progress.toString());
  }, [progress]);

  useEffect(() => {
    const savedProgress = localStorage.getItem("lofichill-progress");
    if (audioRef.current && duration > 5 && savedProgress) {
      audioRef.current.currentTime = parseFloat(savedProgress);
    }
  }, [duration]);

  /* Mini-player breakpoint */
  useEffect(() => {
    const handleResize = () => setIsMini(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* Load & play track */
  useEffect(() => {
    if (!track || !audioRef.current) return;
    const audio = audioRef.current;
    audio.src = track.url || "";
    audio.load();
    setProgress(0);

    const playTrack = async () => {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
    };

    playTrack();
  }, [track]);

  /* Progress & repeat */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const update = () => {
      setProgress(audio.currentTime);
      setDuration(audio.duration || 0);
    };

    const ended = () => {
      if (isRepeat) {
        audio.currentTime = 0;
        audio.play();
      } else {
        skipTrack("next");
      }
    };

    audio.addEventListener("timeupdate", update);
    audio.addEventListener("ended", ended);
    return () => {
      audio.removeEventListener("timeupdate", update);
      audio.removeEventListener("ended", ended);
    };
  }, [isRepeat, isShuffle, track]);

  /* Play / pause */
  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play();
      setIsPlaying(true);
    }
  };

  /* Skip */
  const skipTrack = (direction: "next" | "prev") => {
    if (!playlist.length || !track) return;

    let nextTrack: Track | null = null;

    if (isShuffle) {
      nextTrack = playlist[Math.floor(Math.random() * playlist.length)];
    } else {
      const index = playlist.findIndex((t) => t.id === track.id);

      if (index === -1) return;

      const nextIndex =
        direction === "next"
          ? (index + 1) % playlist.length
          : (index - 1 + playlist.length) % playlist.length;

      nextTrack = playlist[nextIndex];
    }

    onTrackChange?.(nextTrack);
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
  };

  const time = (t: number) => {
    if (isNaN(t)) return "0:00";
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${s}`;
  };

  /* Keyboard shortcuts */
  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (!track) return;

      if (e.key === " ") {
        e.preventDefault();
        togglePlay();
      }
      if (e.key === "ArrowRight") {
        if (audioRef.current) audioRef.current.currentTime += 5;
      }
      if (e.key === "ArrowLeft") {
        if (audioRef.current) audioRef.current.currentTime -= 5;
      }
      if (e.key === "n" || e.key === "N") skipTrack("next");
      if (e.key === "p" || e.key === "P") skipTrack("prev");
    };

    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [track, isPlaying]);

  /* RENDER */
  if (!track)
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-background/70 backdrop-blur-lg border-t border-border p-4 text-center text-muted-foreground">
        Select a track to start playing 🎶
      </div>
    );

  return (
    <>
      <audio ref={audioRef} />

      {/* MINI PLAYER */}
      <AnimatePresence>
        {isMini && (
          <motion.div
            key="mini"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-0 left-0 right-0 bg-background/90 backdrop-blur-md border-t border-border p-3 flex items-center justify-between cursor-pointer z-50"
            onClick={() => setIsMini(false)}
          >
            <div className="flex items-center space-x-3 overflow-hidden">
              <img
                src={track.album_cover || track.image || ""}
                alt={track.title}
                className="w-10 h-10 rounded-md object-cover"
              />
              <div>
                <p className="text-sm font-medium truncate">{track.title}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {track.artist}
                </p>
              </div>
            </div>

            {/* ❤️ MINI PLAYER CONTROLS */}
            <div className="flex items-center space-x-3">

              {/* ❤️ Like */}
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleLike();
                }}
              >
                <Heart
                  size={16}
                  className={isLiked ? "fill-red-500 text-red-500" : ""}
                />
              </Button>

              {/* ⏮ Prev */}
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  skipTrack("prev");
                }}
              >
                <SkipBack size={16} />
              </Button>

              {/* ▶ / ⏸ */}
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlay();
                }}
              >
                {isPlaying ? <Pause size={18} /> : <Play size={18} />}
              </Button>

              {/* ⏭ Next */}
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  skipTrack("next");
                }}
              >
                <SkipForward size={16} />
              </Button>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FULL PLAYER */}
      {!isMini && (
        <motion.div
          key="full"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t border-border p-4 flex items-center justify-between z-50"
        >
          {/* Track Info */}
          <div className="flex items-center space-x-4">
            <motion.img
              src={track.album_cover || track.image || ""}
              alt={track.title}
              className="w-14 h-14 rounded-lg object-cover"
              animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
              transition={{
                repeat: isPlaying ? Infinity : 0,
                duration: 6,
                ease: "linear",
              }}
            />
            <div>
              <p className="text-base font-medium">{track.title}</p>
              <p className="text-sm text-muted-foreground">{track.artist}</p>
            </div>
          </div>

          {/* CONTROLS */}
          <div className="flex flex-col items-center w-1/3">
            <div className="flex items-center space-x-5 mb-2">
              <Button
                variant={isShuffle ? "default" : "ghost"}
                size="icon"
                onClick={() => setIsShuffle(!isShuffle)}
              >
                <Shuffle size={18} />
              </Button>

              {/* ❤️ */}
              <Button variant="ghost" size="icon" onClick={toggleLike}>
                <Heart
                  size={20}
                  className={isLiked ? "fill-red-500 text-red-500" : ""}
                />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => skipTrack("prev")}
              >
                <SkipBack size={20} />
              </Button>

              <Button variant="ghost" size="icon" onClick={togglePlay}>
                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => skipTrack("next")}
              >
                <SkipForward size={20} />
              </Button>

              <Button
                variant={isRepeat ? "default" : "ghost"}
                size="icon"
                onClick={() => setIsRepeat(!isRepeat)}
              >
                <Repeat size={18} />
              </Button>
            </div>

            {/* Seek bar */}
            <div className="flex items-center w-full space-x-2">
              <span className="text-xs text-muted-foreground">
                {time(progress)}
              </span>

              <div
                className="relative flex-1 h-1 bg-gray-700 rounded-lg cursor-pointer group"
                onClick={(e) => {
                  const rect = (e.target as HTMLDivElement).getBoundingClientRect();
                  const click = e.clientX - rect.left;
                  const newTime = (click / rect.width) * duration;

                  if (audioRef.current)
                    audioRef.current.currentTime = newTime;

                  setProgress(newTime);
                }}
              >
                <motion.div
                  className="absolute top-0 left-0 h-1 bg-primary rounded-lg"
                  style={{
                    width: `${(progress / duration) * 100}%`,
                  }}
                />
              </div>

              <span className="text-xs text-muted-foreground">
                {time(duration)}
              </span>
            </div>
          </div>

          {/* Volume + Queue + Mini */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 group">
              <Volume2 size={20} className="text-muted-foreground" />
              <motion.input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolume}
                className="w-0 group-hover:w-32 transition-all duration-300 h-1 bg-gray-700 rounded-lg cursor-pointer accent-primary"
              />
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" title="View Queue">
                  <ListMusic size={20} />
                </Button>
              </DialogTrigger>

              <DialogContent className="bg-background/80 backdrop-blur-md border border-border rounded-2xl p-4 max-w-md">
                <h3 className="text-lg font-semibold mb-3">🎧 Queue</h3>

                {playlist.length === 0 ? (
                  <p className="text-muted-foreground text-sm">
                    No tracks in queue
                  </p>
                ) : (
                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {playlist.map((t, i) => (
                      <div
                        key={t.id || i}
                        className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer ${
                          t.id === track.id
                            ? "bg-primary/10"
                            : "hover:bg-muted"
                        }`}
                        onClick={() => onTrackChange?.(t)}
                      >
                        <img
                          src={t.album_cover || t.image || ""}
                          className="w-10 h-10 rounded-md object-cover"
                        />

                        <div>
                          <p className="text-sm font-medium">{t.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {t.artist}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </DialogContent>
            </Dialog>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMini(true)}
              title="Minimize"
            >
              <ChevronUp size={20} />
            </Button>
          </div>
        </motion.div>
      )}
    </>
  );
}
