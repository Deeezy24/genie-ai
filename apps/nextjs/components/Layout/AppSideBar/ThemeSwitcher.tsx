"use client";

import { Button } from "@workspace/ui/components/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useState } from "react";

/** Animated theme toggle with view-transition fallback */
export function ThemeSwitcher() {
  const { resolvedTheme, setTheme } = useTheme(); // "light" | "dark" | undefined
  const [mounted, setMounted] = useState(false);

  /* ----- wait for hydration ------------------------------------------------ */
  useEffect(() => {
    setMounted(true);
  }, []);

  /* ----- click handler ----------------------------------------------------- */
  const handleToggle = useCallback(
    (e?: React.MouseEvent) => {
      // guard: we don’t know the theme until mounted
      if (!mounted || !resolvedTheme) return;

      const next = resolvedTheme === "dark" ? "light" : "dark";

      // Fancy cross-fade if the browser supports View Transitions
      if (document.startViewTransition) {
        // Put the click coordinates into CSS custom props so you can use them
        if (e) {
          const root = document.documentElement;
          root.style.setProperty("--x", `${e.clientX}px`);
          root.style.setProperty("--y", `${e.clientY}px`);
        }

        document.startViewTransition(() => setTheme(next));
      } else {
        // Plain toggle otherwise
        setTheme(next);
      }
    },
    [mounted, resolvedTheme, setTheme],
  );

  /* ----- what to render ---------------------------------------------------- */
  if (!mounted) {
    /* 1st pass on both server + client => identical HTML, zero mismatch */
    return (
      <Button size="icon" variant="secondary" aria-label="Toggle theme" disabled>
        {/* invisible placeholder keeps button size */}
        <Sun className="opacity-0" />
      </Button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      size="icon"
      variant="secondary"
      aria-label="Toggle theme"
      onClick={handleToggle}
      className="group/toggle size-8"
    >
      {isDark ? <Sun /> : <Moon />}
    </Button>
  );
}
