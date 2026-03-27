"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const INTRO_EVENT = "asro:intro-complete";
const INTRO_SHOWN_KEY = "asro:intro-shown";
const INTRO_STARTED_VALUE = "pending";
const INTRO_DONE_VALUE = "1";

function completeIntroImmediately() {
  document.body.classList.remove("asro-loader-active");
  document.body.classList.add("asro-intro-done");
  window.dispatchEvent(new CustomEvent(INTRO_EVENT));
}

export function InitialLoader() {
  const [visible, setVisible] = useState(true);
  const [hiding, setHiding] = useState(false);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setEntered(true));
    });
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const readIntroState = () => {
      try {
        return sessionStorage.getItem(INTRO_SHOWN_KEY);
      } catch {
        return null;
      }
    };

    const writeIntroState = (value: string) => {
      try {
        sessionStorage.setItem(INTRO_SHOWN_KEY, value);
      } catch {
        // Ignore storage failures (private mode / strict browser policy).
      }
    };

    const forceCloseLoader = () => {
      completeIntroImmediately();
      setHiding(true);
      setVisible(false);
      writeIntroState(INTRO_DONE_VALUE);
    };

    const onPageShow = () => {
      if (readIntroState() != null) {
        forceCloseLoader();
      }
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible" && readIntroState() != null) {
        forceCloseLoader();
      }
    };

    window.addEventListener("pageshow", onPageShow);
    document.addEventListener("visibilitychange", onVisibilityChange);

    document.body.classList.add("asro-loader-active");
    // Mark intro as started to prevent stuck overlay on back/forward navigation.
    writeIntroState(INTRO_STARTED_VALUE);

    const minShowMs = 3200;
    const fadeMs = 560;
    const fallbackCloseMs = minShowMs + fadeMs + 2200;

    const startFade = window.setTimeout(() => {
      completeIntroImmediately();
      setHiding(true);
      writeIntroState(INTRO_DONE_VALUE);
    }, minShowMs);

    const unmount = window.setTimeout(() => {
      setVisible(false);
    }, minShowMs + fadeMs);

    const failSafeClose = window.setTimeout(() => {
      completeIntroImmediately();
      setHiding(true);
      setVisible(false);
      writeIntroState(INTRO_DONE_VALUE);
    }, fallbackCloseMs);

    // Fix BFCache/back navigation where page can restore with stale overlay state.
    return () => {
      document.body.classList.remove("asro-loader-active");
      window.clearTimeout(startFade);
      window.clearTimeout(unmount);
      window.clearTimeout(failSafeClose);
      window.removeEventListener("pageshow", onPageShow);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={[
        "asro-loader",
        entered ? "asro-loader--entered" : "",
        hiding ? "asro-loader--hiding" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      aria-busy="true"
      aria-live="polite"
    >
      <div className="asro-loader__content">
        <div className="asro-loader__logoWrap">
          <div className="asro-loader__ring" aria-hidden="true" />
          <Image
            className="asro-loader__logoImg"
            src="/asrofinexq-logo.png"
            alt="Loading"
            width={60}
            height={60}
            priority
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className="loader" aria-hidden="true" />
      </div>
      <span
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
          whiteSpace: "nowrap",
          border: 0,
        }}
      >
        Loading
      </span>
    </div>
  );
}

