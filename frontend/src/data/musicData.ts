export interface Album {
  id: number;
  title: string;
  artist: string;
  cover: string;
}

export interface Track {
  id: number;
  title: string;
  artist: string;
  duration: string;
  cover: string;
}

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
];

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
];
