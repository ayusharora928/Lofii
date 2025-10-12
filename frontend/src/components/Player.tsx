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
} from "lucide-react";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "framer-motion";
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

  // 🧠 Toggle mini mode based on screen width
  useEffect(() => {
    const handleResize = () => {
      setIsMini(window.innerWidth < 768); // mobile breakpoint
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 🎵 Load and play new track
  useEffect(() => {
    if (!track || !audioRef.current) return;
    const audio = audioRef.current;
    audio.src = track.url;
    audio.load();
    setProgress(0);

    const playOnLoad = async () => {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
    };
    playOnLoad();
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

  // ⏩ Skip
  const skipTrack = (direction: "next" | "prev") => {
    if (!playlist || playlist.length === 0 || !track) return;
    let nextTrack: Track | null = null;

    if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * playlist.length);
      nextTrack = playlist[randomIndex];
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

  if (!track) return null;

  return (
    <>
      <audio ref={audioRef} />

      {/* 💡 MINI PLAYER (mobile view) */}
      <AnimatePresence>
        {isMini && (
          <motion.div
            key="mini"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-0 left-0 right-0 bg-background/90 backdrop-blur-md border-t border-border p-3 flex items-center justify-between cursor-pointer z-50"
            onClick={() => setIsMini(false)} // expand on click
          >
            <div className="flex items-center space-x-3 overflow-hidden">
              <img
                src={track.cover || track.image || ""}
                alt={track.title}
                className="w-10 h-10 rounded-md object-cover"
              />
              <div>
                <p className="text-sm font-medium truncate">{track.title}</p>
                <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); skipTrack("prev"); }}>
                <SkipBack size={16} />
              </Button>
              <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); togglePlay(); }}>
                {isPlaying ? <Pause size={18} /> : <Play size={18} />}
              </Button>
              <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); skipTrack("next"); }}>
                <SkipForward size={16} />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🎧 FULL PLAYER (desktop or expanded) */}
      {!isMini && (
        <motion.div
          key="full"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t border-border p-4 flex items-center justify-between z-50"
        >
          <div className="flex items-center space-x-4">
            <img
              src={track.cover || track.image || ""}
              alt={track.title}
              className="w-14 h-14 rounded-lg object-cover"
            />
            <div>
              <p className="text-base font-medium">{track.title}</p>
              <p className="text-sm text-muted-foreground">{track.artist}</p>
            </div>
          </div>

          <div className="flex flex-col items-center w-1/3">
            <div className="flex items-center space-x-5 mb-2">
              <Button
                variant={isShuffle ? "default" : "ghost"}
                size="icon"
                onClick={() => setIsShuffle(!isShuffle)}
              >
                <Shuffle size={18} />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => skipTrack("prev")}>
                <SkipBack size={20} />
              </Button>
              <Button variant="ghost" size="icon" onClick={togglePlay}>
                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
              </Button>
              <Button variant="ghost" size="icon" onClick={() => skipTrack("next")}>
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
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={progress}
                onChange={handleSeek}
                className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <span className="text-xs text-muted-foreground">{formatTime(duration)}</span>
            </div>
          </div>

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

          <Button variant="ghost" size="icon" onClick={() => setIsMini(true)} title="Minimize">
            <ChevronUp size={20} />
          </Button>
        </motion.div>
      )}
    </>
  );
}
