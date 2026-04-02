"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { flushSync } from "react-dom"

import { cn } from "@/lib/utils"
import { THEME_STORAGE_KEY } from "@/app/lib/site"

interface AnimatedThemeTogglerProps extends React.ComponentPropsWithoutRef<"button"> {
  duration?: number
  isDark?: boolean
  onThemeChange?: (nextDark: boolean) => void
  storageKey?: string
}

export const AnimatedThemeToggler = ({
  className,
  duration = 400,
  isDark: controlledIsDark,
  onThemeChange,
  storageKey = THEME_STORAGE_KEY,
  ...props
}: AnimatedThemeTogglerProps) => {
  const [isDark, setIsDark] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const effectiveIsDark = controlledIsDark ?? isDark

  useEffect(() => {
    if (typeof controlledIsDark !== "boolean") return
    setIsDark(controlledIsDark)
  }, [controlledIsDark])

  useEffect(() => {
    if (typeof controlledIsDark === "boolean") return
    const updateTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"))
    }

    updateTheme()

    const observer = new MutationObserver(updateTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })

    return () => observer.disconnect()
  }, [controlledIsDark])

  const toggleTheme = useCallback(() => {
    const button = buttonRef.current
    if (!button) return

    const { top, left, width, height } = button.getBoundingClientRect()
    const x = left + width / 2
    const y = top + height / 2
    const viewportWidth = window.visualViewport?.width ?? window.innerWidth
    const viewportHeight = window.visualViewport?.height ?? window.innerHeight
    const maxRadius = Math.hypot(
      Math.max(x, viewportWidth - x),
      Math.max(y, viewportHeight - y)
    )

    const applyTheme = () => {
      const newTheme = !effectiveIsDark
      if (typeof controlledIsDark !== "boolean") setIsDark(newTheme)
      document.documentElement.classList.toggle("dark", newTheme)
      document.body.classList.toggle("dark", newTheme)
      localStorage.setItem(storageKey, newTheme ? "dark" : "light")
      onThemeChange?.(newTheme)
    }

    if (typeof document.startViewTransition !== "function") {
      applyTheme()
      return
    }

    const transition = document.startViewTransition(() => {
      flushSync(applyTheme)
    })

    const ready = transition?.ready
    if (ready && typeof ready.then === "function") {
      ready.then(() => {
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${maxRadius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration,
            easing: "ease-in-out",
            pseudoElement: "::view-transition-new(root)",
          }
        )
      })
    }
  }, [effectiveIsDark, duration, controlledIsDark, onThemeChange, storageKey])

  return (
    <button
      type="button"
      ref={buttonRef}
      onClick={toggleTheme}
      className={cn(className)}
      {...props}
    >
      {effectiveIsDark ? <Sun /> : <Moon />}
      <span className="sr-only">Toggle theme</span>
    </button>
  )
}
