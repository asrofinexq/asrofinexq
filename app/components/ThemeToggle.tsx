"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { THEME_STORAGE_KEY } from "@/app/lib/site";
import { AnimatedThemeToggler } from "@/registry/magicui/animated-theme-toggler";

function readStoredTheme(): boolean {
  if (typeof window === "undefined") return false;
  const saved = localStorage.getItem(THEME_STORAGE_KEY);
  if (saved === "dark") return true;
  if (saved === "light") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);
  const [ready, setReady] = useState(false);

  useLayoutEffect(() => {
    const d = readStoredTheme();
    setDark(d);
    document.documentElement.classList.toggle("dark", d);
    document.body.classList.toggle("dark", d);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    document.documentElement.classList.toggle("dark", dark);
    document.body.classList.toggle("dark", dark);
    localStorage.setItem(THEME_STORAGE_KEY, dark ? "dark" : "light");
  }, [dark, ready]);

  if (!ready) return null;

  return (
    <div className="subpage-theme-toggle">
      <AnimatedThemeToggler
        className="theme-toggle-trigger"
        isDark={dark}
        onThemeChange={setDark}
        storageKey={THEME_STORAGE_KEY}
        aria-label={dark ? "Gunakan tema terang" : "Gunakan tema gelap"}
        aria-pressed={dark}
      />
    </div>
  );
}
