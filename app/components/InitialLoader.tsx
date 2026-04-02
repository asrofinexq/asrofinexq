"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

const INTRO_EVENT = "asro:intro-complete";
const INTRO_SHOWN_KEY = "asro:intro-shown";
const INTRO_DONE_VALUE = "1";

const GREETINGS = [
  "Selamat Datang",
  "Hello",
  "Bienvenue",
  "Willkommen",
  "Hola",
  "Konnichiwa",
  "Namaste",
  "Olá",
  "Marhaba",
  "Ciao",
  "Benvenuti",
  "Irashaimase",
  "Mabuhay",
  "Karibu",
  "Ni Hao",
];

const SPLASH_MS = 2000;
const SPLASH_FADE_MS = 400;
const GREETING_FIRST_HOLD_MS = 700;
const GREETING_INTERVAL_MS = 100;
const GREETING_LAST_HOLD_MS = 750;
/** Greeting terakhir: teks memudar */
const LAST_TEXT_FADE_MS = 480;
/** Lalu kotak membulat sebelum reveal */
const LAST_BOX_CIRCLE_MS = 720;

/** Fase 1: lingkaran sampai menutupi kotak greeting */
const CIRCLE_BOX_MS = 640;
/** Jeda di ukuran kotak sebelum expand layar penuh */
const CIRCLE_PAUSE_MS = 300;
/** Fase 2: dari tepi kotak sampai radius layar penuh */
const CIRCLE_FULL_MS = 920;
/** Setelah morf bulat: segmen pertama lebih singkat + easing lebih halus ke reveal */
const CIRCLE_HANDOFF_LEG1_MS = 400;
const CIRCLE_HANDOFF_PAUSE_MS = 240;
/** Ring putih memudar = sambungan visual morf → veil */
const HANDOFF_RING_FADE_MS = 340;
const AFTER_REVEAL_MS = 100;

function maxRadiusFromPoint(cx: number, cy: number): number {
  if (typeof window === "undefined") return 2400;
  const w = window.innerWidth;
  const h = window.innerHeight;
  const corners: [number, number][] = [
    [0, 0],
    [w, 0],
    [0, h],
    [w, h],
  ];
  let maxD = 0;
  for (const [x, y] of corners) {
    const d = Math.hypot(x - cx, y - cy);
    if (d > maxD) maxD = d;
  }
  return maxD + 64;
}

/** Radius minimal agar lingkaran di (px,py) menutupi seluruh rect kotak (viewport px). */
function maxRadiusToCoverRect(px: number, py: number, rect: DOMRect): number {
  const corners: [number, number][] = [
    [rect.left, rect.top],
    [rect.right, rect.top],
    [rect.left, rect.bottom],
    [rect.right, rect.bottom],
  ];
  let maxD = 0;
  for (const [x, y] of corners) {
    maxD = Math.max(maxD, Math.hypot(x - px, y - py));
  }
  return maxD + 8;
}

export function completeIntroImmediately() {
  document.body.classList.remove("asro-loader-active");
  document.body.classList.add("asro-intro-done");
  window.dispatchEvent(new CustomEvent(INTRO_EVENT));
}

export function InitialLoader() {
  const [dismissed, setDismissed] = useState(false);
  const [entered, setEntered] = useState(false);
  const [splashFading, setSplashFading] = useState(false);
  const [splashHidden, setSplashHidden] = useState(false);
  const [greetingIdx, setGreetingIdx] = useState(-1);
  const [phase, setPhase] = useState<"splash" | "greeting" | "reveal">(
    "splash",
  );
  const [lastExitPhase, setLastExitPhase] = useState<
    "none" | "textFade" | "boxCircle"
  >("none");

  const timersRef = useRef<number[]>([]);
  const settleDoneRef = useRef(false);
  const revealStartedRef = useRef(false);
  const veilRef = useRef<HTMLDivElement>(null);
  const greetingBoxRef = useRef<HTMLDivElement>(null);
  const revealFrameRef = useRef<number>(0);
  const handoffFromMorphRef = useRef(false);

  const [handoffRing, setHandoffRing] = useState<{
    left: number;
    top: number;
    size: number;
  } | null>(null);

  const arm = useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    timersRef.current.push(id);
  }, []);

  const clearAllTimers = useCallback(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  }, []);

  const writeIntroState = useCallback((value: string) => {
    try {
      sessionStorage.setItem(INTRO_SHOWN_KEY, value);
    } catch {
      // ignore
    }
  }, []);

  const finishIntro = useCallback(() => {
    completeIntroImmediately();
    writeIntroState(INTRO_DONE_VALUE);
  }, [writeIntroState]);

  const settleIntro = useCallback(() => {
    if (settleDoneRef.current) return;
    settleDoneRef.current = true;
    finishIntro();
    arm(() => {
      setDismissed(true);
      clearAllTimers();
    }, AFTER_REVEAL_MS);
  }, [arm, finishIntro, clearAllTimers]);

  const forceCloseAll = useCallback(() => {
    settleDoneRef.current = true;
    if (revealFrameRef.current) {
      cancelAnimationFrame(revealFrameRef.current);
      revealFrameRef.current = 0;
    }
    setHandoffRing(null);
    finishIntro();
    setDismissed(true);
    clearAllTimers();
  }, [finishIntro, clearAllTimers]);

  const startCircleReveal = useCallback(() => {
    if (revealStartedRef.current || settleDoneRef.current) return;
    revealStartedRef.current = true;

    const fromMorph = handoffFromMorphRef.current;
    handoffFromMorphRef.current = false;

    const runAfterLayout = () => {
      const boxRect = greetingBoxRef.current?.getBoundingClientRect();
      const cx = boxRect
        ? boxRect.left + boxRect.width / 2
        : window.innerWidth / 2;
      const cy = boxRect
        ? boxRect.top + boxRect.height / 2
        : window.innerHeight / 2;

      const rFull = maxRadiusFromPoint(cx, cy);
      let rBox = boxRect
        ? maxRadiusToCoverRect(cx, cy, boxRect)
        : rFull * 0.32;
      rBox = Math.min(Math.max(rBox, 24), rFull);
      const cxPct = (cx / window.innerWidth) * 100;
      const cyPct = (cy / window.innerHeight) * 100;

      if (fromMorph && boxRect) {
        setHandoffRing({
          left: boxRect.left,
          top: boxRect.top,
          size: boxRect.width,
        });
        arm(() => setHandoffRing(null), HANDOFF_RING_FADE_MS + 40);
      }

      setPhase("reveal");

      const leg1 = fromMorph ? CIRCLE_HANDOFF_LEG1_MS : CIRCLE_BOX_MS;
      const pause = fromMorph ? CIRCLE_HANDOFF_PAUSE_MS : CIRCLE_PAUSE_MS;
      const easeLeg1 = fromMorph
        ? (t: number) => 1 - (1 - t) ** 2.05
        : (t: number) => 1 - (1 - t) ** 2.85;
      const easeExpand = (t: number) => 1 - (1 - t) ** 2.75;

      const runReveal = () => {
        const el = veilRef.current;
        if (!el) {
          settleIntro();
          return;
        }
        el.style.setProperty("--cx", `${cxPct}%`);
        el.style.setProperty("--cy", `${cyPct}%`);
        el.style.setProperty("--reveal-r", "0px");

        const start = performance.now();
        const tPauseEnd = leg1 + pause;
        const tTotal = tPauseEnd + CIRCLE_FULL_MS;

        const tick = (now: number) => {
          const elapsed = now - start;
          let r: number;
          if (elapsed < leg1) {
            const u = Math.min(1, elapsed / leg1);
            r = easeLeg1(u) * rBox;
          } else if (elapsed < tPauseEnd) {
            r = rBox;
          } else if (elapsed < tTotal) {
            const u = Math.min(1, (elapsed - tPauseEnd) / CIRCLE_FULL_MS);
            r = rBox + easeExpand(u) * (rFull - rBox);
          } else {
            el.style.setProperty("--reveal-r", `${rFull}px`);
            revealFrameRef.current = 0;
            settleIntro();
            return;
          }
          el.style.setProperty("--reveal-r", `${r}px`);
          revealFrameRef.current = requestAnimationFrame(tick);
        };
        revealFrameRef.current = requestAnimationFrame(tick);
      };

      requestAnimationFrame(() => {
        requestAnimationFrame(runReveal);
      });
    };

    requestAnimationFrame(() => {
      requestAnimationFrame(runAfterLayout);
    });
  }, [arm, settleIntro]);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setEntered(true));
    });
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    return () => {
      clearAllTimers();
      if (revealFrameRef.current) {
        cancelAnimationFrame(revealFrameRef.current);
      }
    };
  }, [clearAllTimers]);

  useEffect(() => {
    if (dismissed) return;

    document.body.classList.add("asro-loader-active");

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      arm(() => forceCloseAll(), 280);
      return () => {
        clearAllTimers();
        document.body.classList.remove("asro-loader-active");
      };
    }

    arm(() => setSplashFading(true), SPLASH_MS);
    arm(() => {
      setSplashHidden(true);
      setGreetingIdx(0);
      setPhase("greeting");
    }, SPLASH_MS + SPLASH_FADE_MS);

    return () => {
      clearAllTimers();
      document.body.classList.remove("asro-loader-active");
    };
  }, [dismissed, arm, forceCloseAll, clearAllTimers]);

  useEffect(() => {
    if (dismissed) return;
    if (phase !== "greeting") return;
    if (greetingIdx < 0 || greetingIdx >= GREETINGS.length) return;

    const isFirst = greetingIdx === 0;
    const isLast = greetingIdx === GREETINGS.length - 1;
    const delay = isFirst
      ? GREETING_FIRST_HOLD_MS
      : isLast
        ? GREETING_LAST_HOLD_MS
        : GREETING_INTERVAL_MS;

    const id = window.setTimeout(() => {
      if (isLast) {
        setLastExitPhase("textFade");
        arm(() => setLastExitPhase("boxCircle"), LAST_TEXT_FADE_MS);
        arm(() => {
          handoffFromMorphRef.current = true;
          startCircleReveal();
        }, LAST_TEXT_FADE_MS + LAST_BOX_CIRCLE_MS);
      } else {
        setGreetingIdx((i) => i + 1);
      }
    }, delay);

    return () => window.clearTimeout(id);
  }, [dismissed, phase, greetingIdx, startCircleReveal, arm]);

  if (dismissed) return null;

  return (
    <div
      className={[
        "asro-loader",
        "asro-loader--nexq",
        entered ? "asro-loader--entered" : "",
        phase === "reveal" ? "asro-loader--circle-reveal" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      aria-busy={phase === "splash" || phase === "greeting" || phase === "reveal"}
      aria-live="polite"
    >
      {phase === "reveal" && (
        <>
          <div
            ref={veilRef}
            className="asro-loader__circle-veil"
            aria-hidden="true"
          />
          {handoffRing && (
            <div
              className="asro-loader__handoff-ring"
              style={{
                left: handoffRing.left,
                top: handoffRing.top,
                width: handoffRing.size,
                height: handoffRing.size,
              }}
              aria-hidden="true"
            />
          )}
        </>
      )}

      {!splashHidden && (
        <div
          className={[
            "asro-loader__nexq-splash",
            splashFading ? "asro-loader__nexq-splash--fade" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <div className="asro-loader__nexq-logo" aria-label="NexQ">
            <Image
              src="/logo.png"
              alt=""
              width={200}
              height={200}
              className="asro-loader__nexq-logo-img"
              priority
            />
          </div>
          <div className="loader loader--nexq" aria-hidden="true" />
        </div>
      )}

      {splashHidden && phase === "greeting" && (
        <div className="asro-loader__greeting-stage">
          <div
            ref={greetingBoxRef}
            className={[
              "asro-loader__greeting-box",
              greetingIdx === GREETINGS.length - 1 &&
              lastExitPhase !== "none"
                ? "asro-loader__greeting-box--last-text-out"
                : "",
              greetingIdx === GREETINGS.length - 1 &&
              lastExitPhase === "boxCircle"
                ? "asro-loader__greeting-box--last-morph-circle"
                : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {greetingIdx >= 0 && greetingIdx < GREETINGS.length && (
              <p
                key={greetingIdx}
                className={[
                  "asro-loader__greeting",
                  greetingIdx === 0 ? "asro-loader__greeting--fadein" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <span
                  className="asro-loader__greeting-dot"
                  aria-hidden="true"
                />
                {GREETINGS[greetingIdx]}
              </p>
            )}
          </div>
        </div>
      )}

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
