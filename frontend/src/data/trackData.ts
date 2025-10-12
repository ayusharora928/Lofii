// src/data/tracksData.ts
import { Track } from "../types/track";

export const featuredAlbums: Track[] = [
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

export const recentlyPlayed: Track[] = [
  {
    id: 4,
    title: "Golden Hour",
    artist: "Kyoto Loops",
    cover:
      "https://images.unsplash.com/photo-1519881451744-31c1e6b9e5b9?w=400&auto=format&fit=crop&q=60",
    url: "/music/golden-hour.mp3",
  },
  {
    id: 5,
    title: "Ocean Eyes",
    artist: "Coastal Beats",
    cover:
      "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=400&auto=format&fit=crop&q=60",
    url: "/music/ocean-eyes.mp3",
  },
];
