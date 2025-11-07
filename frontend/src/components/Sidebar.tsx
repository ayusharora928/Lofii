import { Home, Search, Library, Plus, Heart, Music } from "lucide-react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { useNavigate, useLocation } from "react-router-dom";

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Search, label: "Search", path: "/search" },
    { icon: Library, label: "Your Library", path: "/library" },
  ];

  const playlists = [
    "Recently Played",
    "My Playlist #1",
    "Chill Vibes",
    "Workout Mix",
    "Road Trip Songs",
  ];

  return (
    <div className="w-64 bg-background border-r h-full flex flex-col">
      <div className="p-6">
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Button
              key={item.label}
              variant={location.pathname === item.path ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => navigate(item.path)}
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
          {/* ✅ Liked Songs — goes to /liked */}
          <Button
            variant={location.pathname === "/liked" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => navigate("/liked")}
          >
            <Heart className="mr-3 h-4 w-4" />
            Liked Songs
          </Button>

          {/* Other playlists */}
          {playlists.map((playlist) => (
            <Button
              key={playlist}
              variant="ghost"
              className="w-full justify-start text-muted-foreground"
            >
              <Music className="mr-3 h-4 w-4" />
              {playlist}
            </Button>
          ))}
        </nav>
      </div>
    </div>
  );
}
