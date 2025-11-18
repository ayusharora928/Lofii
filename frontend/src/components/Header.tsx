import { Search, Bell, User } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export function Header() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  // Navigate to search page when typing
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    navigate("/search?q=" + encodeURIComponent(e.target.value));
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="flex h-16 items-center justify-between px-6">
        
        {/* LOGO */}
        <div
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold">L</span>
          </div>
          <span className="font-semibold text-xl">LoFiChill</span>
        </div>

        {/* SEARCH BAR */}
        <div className="flex-1 max-w-lg mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search for songs, artists, albums..."
              value={query}
              onChange={handleSearch}
              className="pl-10 bg-muted/40 focus:bg-muted transition"
            />
          </div>
        </div>

        {/* RIGHT ICONS */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" title="Notifications">
            <Bell className="h-5 w-5" />
          </Button>

          <Avatar className="cursor-pointer hover:opacity-90"
            onClick={() => navigate("/profile")}
          >
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
