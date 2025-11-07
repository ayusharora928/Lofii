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

  /* -------------------------------------------------------------------------- */
  /* ✅ Persistent Track + Progress (LocalStorage Resume)                      */
  /* -------------------------------------------------------------------------- */

  // Load saved track if app opens with null
  useEffect(() => {
    const savedTrack = localStorage.getItem("lofichill-current-track");
    if (savedTrack && !track && onTrackChange) {
      onTrackChange(JSON.parse(savedTrack));
    }
  }, []);

  // Save track whenever changed
  useEffect(() => {
    if (track) {
      localStorage.setItem("lofichill-current-track", JSON.stringify(track));
    }
  }, [track]);

  // Save progress every second
  useEffect(() => {
    if (progress > 0) {
      localStorage.setItem("lofichill-progress", progress.toString());
    }
  }, [progress]);

  // When duration is available (track loaded), restore saved progress
  useEffect(() => {
    const savedProgress = localStorage.getItem("lofichill-progress");
    if (audioRef.current && savedProgress && duration > 5) {
      audioRef.current.currentTime = parseFloat(savedProgress);
    }
  }, [duration]);

  /* -------------------------------------------------------------------------- */
  /* 🎧 Mini-player breakpoint                                                  */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    const handleResize = () => setIsMini(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* -------------------------------------------------------------------------- */
  /* 🎵 Handle new track loading and play                                       */
  /* -------------------------------------------------------------------------- */

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

  /* -------------------------------------------------------------------------- */
  /* 🕒 Update progress + handle repeat                                         */
  /* -------------------------------------------------------------------------- */

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

  /* -------------------------------------------------------------------------- */
  /* ▶️ / ⏸️ Play Toggle                                                        */
  /* -------------------------------------------------------------------------- */

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

  /* -------------------------------------------------------------------------- */
  /* ⏪ / ⏩ Skip track                                                          */
  /* -------------------------------------------------------------------------- */

  const skipTrack = (direction: "next" | "prev") => {
    if (!playlist.length || !track) return;
    let nextTrack: Track | null = null;

    if (isShuffle) {
      nextTrack = playlist[Math.floor(Math.random() * playlist.length)];
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

  /* -------------------------------------------------------------------------- */
  /* 🎚️ Seek / Progress / Volume                                               */
  /* -------------------------------------------------------------------------- */

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setVolume(value);
    if (audioRef.current) audioRef.current.volume = value;
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  /* -------------------------------------------------------------------------- */
  /* 🎹 Keyboard Shortcuts                                                     */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!track) return;

      switch (e.key) {
        case " ":
          e.preventDefault();
          togglePlay();
          break;
        case "ArrowRight":
          if (audioRef.current) audioRef.current.currentTime += 5;
          break;
        case "ArrowLeft":
          if (audioRef.current) audioRef.current.currentTime -= 5;
          break;
        case "n":
        case "N":
          skipTrack("next");
          break;
        case "p":
        case "P":
          skipTrack("prev");
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [track, isPlaying]);

  /* -------------------------------------------------------------------------- */

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
                <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="icon">
                <SkipBack size={16} />
              </Button>
              <Button variant="ghost" size="icon" onClick={togglePlay}>
                {isPlaying ? <Pause size={18} /> : <Play size={18} />}
              </Button>
              <Button variant="ghost" size="icon">
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
            {/* ✅ Rotating Album Art */}
            <motion.img
              src={track.album_cover || track.image || ""}
              alt={track.title}
              className="w-14 h-14 rounded-lg object-cover"
              animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
              transition={{ repeat: isPlaying ? Infinity : 0, duration: 6, ease: "linear" }}
            />
            <div>
              <p className="text-base font-medium">{track.title}</p>
              <p className="text-sm text-muted-foreground">{track.artist}</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col items-center w-1/3">
            <div className="flex items-center space-x-5 mb-2">
              <Button variant={isShuffle ? "default" : "ghost"} size="icon" onClick={() => setIsShuffle(!isShuffle)}>
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

              <Button variant={isRepeat ? "default" : "ghost"} size="icon" onClick={() => setIsRepeat(!isRepeat)}>
                <Repeat size={18} />
              </Button>
            </div>

            {/* ✅ Draggable Seek Bar */}
            <div className="flex items-center w-full space-x-2">
              <span className="text-xs text-muted-foreground">{formatTime(progress)}</span>

              <div
                className="relative flex-1 h-1 bg-gray-700 rounded-lg cursor-pointer group"
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

                <motion.div
                  drag="x"
                  dragConstraints={{ left: 0, right: duration }}
                  onDrag={(e, info) => {
                    const rect = (e.target as HTMLDivElement).parentElement!.getBoundingClientRect();
                    const newTime = ((info.point.x - rect.left) / rect.width) * duration;
                    if (audioRef.current) audioRef.current.currentTime = newTime;
                    setProgress(newTime);
                  }}
                  className="absolute -top-1 w-3 h-3 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition"
                  style={{
                    left: `calc(${(progress / duration) * 100}% - 6px)`,
                  }}
                />
              </div>

              <span className="text-xs text-muted-foreground">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Volume + Queue + Minimize */}
          <div className="flex items-center space-x-3">
            {/* ✅ Animated Volume Slider */}
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

            {/* Queue Modal */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" title="View Queue">
                  <ListMusic size={20} />
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-background/80 backdrop-blur-md border border-border rounded-2xl p-4 max-w-md">
                <h3 className="text-lg font-semibold mb-3">🎧 Queue</h3>

                {playlist.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No tracks in queue</p>
                ) : (
                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {playlist.map((t, i) => (
                      <div
                        key={t.title + i}
                        className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer ${
                          t.title === track?.title ? "bg-primary/10" : "hover:bg-muted"
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
                          <p className="text-xs text-muted-foreground">{t.artist}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </DialogContent>
            </Dialog>

            <Button variant="ghost" size="icon" onClick={() => setIsMini(true)} title="Minimize">
              <ChevronUp size={20} />
            </Button>
          </div>
        </motion.div>
      )}
    </>
  );
}
