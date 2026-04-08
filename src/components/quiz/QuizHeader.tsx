import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Timer, Save, Palette, Sun, Moon, Send } from "lucide-react";

const ACCENT_COLORS = [
  { name: "Blue", hsl: "221 83% 53%" },
  { name: "Red", hsl: "0 84% 60%" },
  { name: "Green", hsl: "142 71% 45%" },
  { name: "Emerald", hsl: "160 84% 39%" },
  { name: "Purple", hsl: "262 83% 58%" },
  { name: "Orange", hsl: "25 95% 53%" },
  { name: "Pink", hsl: "330 81% 60%" },
  { name: "Teal", hsl: "173 80% 40%" },
  { name: "Amber", hsl: "45 93% 47%" },
  { name: "Indigo", hsl: "239 84% 67%" },
  { name: "Rose", hsl: "347 77% 50%" },
  { name: "Cyan", hsl: "189 94% 43%" },
];

interface QuizHeaderProps {
  timeRemaining: number;
  username: string;
  onSaveProgress: () => void;
  onSubmit: () => void;
}

export function QuizHeader({ timeRemaining, username, onSaveProgress, onSubmit }: QuizHeaderProps) {
  const isDark = document.documentElement.classList.contains("dark");

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", document.documentElement.classList.contains("dark") ? "dark" : "light");
  };

  const setAccentColor = (hsl: string) => {
    document.documentElement.style.setProperty("--accent-color", hsl);
    localStorage.setItem("accent-color", hsl);
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const isLow = timeRemaining < 300;

  return (
    <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-3">
          <h1 className="font-heading font-bold text-lg">QuizDashBoard</h1>
          <span className="text-sm text-muted-foreground hidden sm:block">
            Welcome, <span className="font-semibold text-foreground">{username}</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-mono text-sm font-semibold ${
            isLow ? "bg-destructive/10 text-destructive animate-pulse" : "bg-muted text-foreground"
          }`}>
            <Timer className="h-4 w-4" />
            {formatTime(timeRemaining)}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Palette className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              {ACCENT_COLORS.map(c => (
                <DropdownMenuItem key={c.name} onClick={() => setAccentColor(c.hsl)} className="gap-2">
                  <span className="w-4 h-4 rounded-full border border-border" style={{ backgroundColor: `hsl(${c.hsl})` }} />
                  {c.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Toggle */}
          <Button variant="ghost" size="icon" className="h-9 w-9" onClick={toggleTheme}>
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {/* Save */}
          <Button variant="outline" size="sm" onClick={onSaveProgress} className="hidden sm:flex">
            <Save className="h-4 w-4 mr-1" /> Save
          </Button>

          {/* Submit */}
          <Button size="sm" onClick={onSubmit} className="bg-primary text-primary-foreground">
            <Send className="h-4 w-4 mr-1" /> Submit
          </Button>
        </div>
      </div>
    </header>
  );
}
