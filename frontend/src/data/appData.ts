// src/data/appData.ts
import { Album } from "../types/album";
import { Track } from "../types/track";

// ---------- FEATURED ALBUMS ----------
export const featuredAlbums: Album[] = [
  {
    id: 1,
    title: "Chill Nights",
    artist: "LoFi Dreamer",
    cover: "/images/album1.jpg",
  },
  {
    id: 2,
    title: "Rainy Beats",
    artist: "SleepySoul",
    cover: "/images/album2.jpg",
  },
  {
    id: 3,
    title: "Late Hours",
    artist: "Mindwaves",
    cover: "/images/album3.jpg",
  },
  {
    id: 4,
    title: "Midnight Breeze",
    artist: "DJ Serenity",
    cover:
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&auto=format&fit=crop&q=60",
  },
];

// ---------- RECENTLY PLAYED ----------
export const recentlyPlayed: Track[] = [
  {
    id: 1,
    title: "Midnight Vibes",
    artist: "Noir Loops",
    duration: "2:45",
    cover: "/images/track1.jpg",
  },
  {
    id: 2,
    title: "Coffee Break",
    artist: "LoFi Cat",
    duration: "3:10",
    cover: "/images/track2.jpg",
  },
  {
    id: 3,
    title: "Echo Dreams",
    artist: "SynthCloud",
    duration: "2:58",
    cover: "/images/track3.jpg",
  },
  {
    id: 4,
    title: "Golden Hour",
    artist: "Kyoto Loops",
    cover:
      "https://images.unsplash.com/photo-1519881451744-31c1e6b9e5b9?w=400&auto=format&fit=crop&q=60",
    url: "/music/golden-hour.mp3",
  },
];

// ---------- FULL TRACK LIST (REAL AUDIO) ----------
export const tracks: Track[] = [
  {
    id: 1,
    title: "Midnight Breeze",
    artist: "DJ Serenity",
    cover:
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&auto=format&fit=crop&q=60",
    url: "/music/midnight-breeze.mp3",
  },
  {
    id: 2,
    title: "Chill Horizon",
    artist: "LoFi Vibes",
    cover:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&auto=format&fit=crop&q=60",
    url: "/music/chill-horizon.mp3",
  },
  {
    id: 3,
    title: "Dreamscape",
    artist: "Soft Static",
    cover:
      "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?w=400&auto=format&fit=crop&q=60",
    url: "/music/dreamscape.mp3",
  },
];

