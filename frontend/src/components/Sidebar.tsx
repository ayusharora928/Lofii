import { Home, Search, Library, Plus, Heart, Music } from "lucide-react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

export function Sidebar() {
  const menuItems = [
    { icon: Home, label: "Home", active: true },
    { icon: Search, label: "Search" },
    { icon: Library, label: "Your Library" },
  ];

  const playlists = [
    "Recently Played",
    "Liked Songs",
    "My Playlist #1",
    "Chill Vibes",
    "Workout Mix",
    "Road Trip Songs"
  ];

  return (
    <div className="w-64 bg-background border-r h-full flex flex-col">
      <div className="p-6">
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Button
              key={item.label}
              variant={item.active ? "secondary" : "ghost"}
              className="w-full justify-start"
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.label}
            </Button>
          ))}
        </nav>
      </div>

      <Separator />

      <div className="p-6 flex-1">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">Playlists</h3>
          <Button variant="ghost" size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        <nav className="space-y-1">
          <Button variant="ghost" className="w-full justify-start">
            <Heart className="mr-3 h-4 w-4" />
            Liked Songs
          </Button>
          {playlists.map((playlist) => (
            <Button key={playlist} variant="ghost" className="w-full justify-start text-muted-foreground">
              <Music className="mr-3 h-4 w-4" />
              {playlist}
            </Button>
          ))}
        </nav>
      </div>
    </div>
  );
}