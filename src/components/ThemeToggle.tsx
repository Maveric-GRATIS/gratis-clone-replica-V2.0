import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Only render after mounting to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="relative w-9 h-9"
        disabled
      >
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      </Button>
    );
  }

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  };

  const getThemeLabel = () => {
    if (theme === "light") return "dark";
    if (theme === "dark") return "system";
    return "light";
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={`Switch to ${getThemeLabel()} mode`}
      className="relative w-9 h-9 transition-all duration-300 hover:bg-accent hover:shadow-[0_0_20px_hsl(var(--brand-blue)/0.5)] group"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all duration-300 data-[theme=dark]:rotate-90 data-[theme=dark]:scale-0 data-[theme=system]:rotate-180 data-[theme=system]:scale-0 text-foreground group-hover:text-brand-yellow" 
        data-theme={theme} />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all duration-300 data-[theme=dark]:rotate-0 data-[theme=dark]:scale-100 data-[theme=system]:rotate-90 data-[theme=system]:scale-0 text-foreground group-hover:text-brand-blue"
        data-theme={theme} />
      <Monitor className="absolute h-[1.2rem] w-[1.2rem] rotate-180 scale-0 transition-all duration-300 data-[theme=system]:rotate-0 data-[theme=system]:scale-100 text-foreground group-hover:text-accent-foreground"
        data-theme={theme} />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
