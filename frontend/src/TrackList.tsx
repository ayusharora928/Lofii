import { useEffect, useState } from "react";
import { getTracks, getRandomTrack } from "./api"; // import the functions from api.ts

export default function TrackList() {
  const [tracks, setTracks] = useState<any[]>([]); // store tracks
  const [loading, setLoading] = useState(true);    // loading state

  // Fetch tracks when component mounts
  useEffect(() => {
    getTracks()
      .then((data) => setTracks(data))   // store tracks in state
      .catch((err) => console.error(err))
      .finally(() => setLoading(false)); // stop loading
  }, []);

  // Function to play a random track
  const playRandomTrack = async () => {
    const track = await getRandomTrack();
    alert(`Playing: ${track.title} by ${track.artist}`);
    // Here you can implement an audio player if you want
  };

  if (loading) return <div>Loading tracks...</div>;

  return (
    <div>
      <h2>LoFi Tracks</h2>
      <button onClick={playRandomTrack}>Play Random Track</button>
      <ul>
        {tracks.map((track, index) => (
          <li key={index} style={{ marginBottom: "1rem" }}>
            <img
              src={track.album_cover}
              alt={track.title}
              width={50}
              height={50}
              style={{ marginRight: "0.5rem" }}
            />
            <strong>{track.title}</strong> by {track.artist}
            <br />
            <audio controls src={track.url}></audio>
          </li>
        ))}
      </ul>
    </div>
  );
}
