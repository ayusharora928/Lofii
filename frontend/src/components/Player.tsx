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
} from "lucide-react";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Track } from "../types/track";

interface PlayerProps {
  track: Track | null;
  playlist?: Track[];
  onTrackChange?: (track: Track) => void;
}

export function Player({ track, playlist = [], onTrackChange }: PlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isMini, setIsMini] = useState(false);

  // 📱 Auto toggle mini-player for mobile
  useEffect(() => {
    const handleResize = () => setIsMini(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 🎵 Handle new track loading and play
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

  // 🕒 Update progress + handle repeat
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      setProgress(audio.currentTime);
      setDuration(audio.duration || 0);
    };

    const handleEnded = () => {
      if (isRepeat) {
        audio.currentTime = 0;
        audio.play();
      } else {
        skipTrack("next");
      }
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("ended", handleEnded);
    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [isRepeat, isShuffle, track]);

  // ▶️ / ⏸️ Toggle play
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

  // ⏩ / ⏪ Skip track
  const skipTrack = (direction: "next" | "prev") => {
    if (!playlist.length || !track) return;
    let nextTrack: Track | null = null;

    if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * playlist.length);
      nextTrack = playlist[randomIndex];
    } else {
      const index = playlist.findIndex(
        (t) => t.title === track.title || t.id === track.id
      );
      if (index === -1) return;
      const nextIndex =
        direction === "next"
          ? (index + 1) % playlist.length
          : (index - 1 + playlist.length) % playlist.length;
      nextTrack = playlist[nextIndex];
    }

    onTrackChange?.(nextTrack);
  };

  // 🎚️ Seek & Volume
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const value = parseFloat(e.target.value);
    audio.currentTime = value;
    setProgress(value);
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setVolume(value);
    if (audioRef.current) audioRef.current.volume = value;
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  if (!track) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-background/70 backdrop-blur-lg border-t border-border p-4 text-center text-muted-foreground">
        Select a track to start playing 🎶
      </div>
    );
  }

  return (
    <>
      <audio ref={audioRef} />

      {/* 🎧 MINI PLAYER */}
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
            <div className="flex items-center space-x-3">
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

      {/* 💻 FULL PLAYER */}
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
            <img
              src={track.album_cover || track.image || ""}
              alt={track.title}
              className="w-14 h-14 rounded-lg object-cover"
            />
            <div>
              <p className="text-base font-medium">{track.title}</p>
              <p className="text-sm text-muted-foreground">{track.artist}</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col items-center w-1/3">
            <div className="flex items-center space-x-5 mb-2">
              <Button
                variant={isShuffle ? "default" : "ghost"}
                size="icon"
                onClick={() => setIsShuffle(!isShuffle)}
              >
                <Shuffle size={18} />
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

            <div className="flex items-center w-full space-x-2">
              <span className="text-xs text-muted-foreground">{formatTime(progress)}</span>
              <div
                className="relative flex-1 h-1 bg-gray-700 rounded-lg cursor-pointer"
                onClick={(e) => {
                  const rect = (e.target as HTMLDivElement).getBoundingClientRect();
                  const clickX = e.clientX - rect.left;
                  const newTime = (clickX / rect.width) * duration;
                  if (audioRef.current) audioRef.current.currentTime = newTime;
                  setProgress(newTime);
                }}
              >
                <motion.div
                  className="absolute top-0 left-0 h-1 bg-primary rounded-lg"
                  style={{ width: `${(progress / duration) * 100}%` }}
                  transition={{ ease: "linear", duration: 0.1 }}
                />
              </div>
              <span className="text-xs text-muted-foreground">{formatTime(duration)}</span>
            </div>

          </div>

          {/* Volume + Queue + Minimize */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 w-32">
              <Volume2 size={20} />
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolume}
                className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>

            {/* 🎶 Queue Dialog */}
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
                        key={t.title + i}
                        className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer ${t.title === track?.title
                            ? "bg-primary/10"
                            : "hover:bg-muted"
                          }`}
                        onClick={() => onTrackChange?.(t)}
                      >
                        <img
                          src={t.album_cover || t.image || ""}
                          alt={t.title}
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
