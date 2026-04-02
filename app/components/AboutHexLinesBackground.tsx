"use client";

import { useEffect, useRef } from "react";

type AboutHexLinesBackgroundProps = {
  className?: string;
};

export default function AboutHexLinesBackground({ className }: AboutHexLinesBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canv = canvasRef.current;
    if (!canv) return;
    const ctx = canv.getContext("2d");
    if (!ctx) return;

    const SPEED = 0.3;
    const RADIUSMIN = 0.03;
    const RADIUSMAX = 0.08;

    let maxx = 0;
    let maxy = 0;
    let nbx = 0;
    let nby = 0;
    let uiv: { radius: number; lineWidth: number } = { radius: 24, lineWidth: 2 };
    let grid: Hexagon[][] = [];
    let lRef = 0;
    let mouse: { x: number; y: number } | undefined;
    let inProgress: Arc[] = [];
    let done: Arc[] = [];
    let messages: { message: "reset" | "click"; x?: number; y?: number }[] = [{ message: "reset" }];
    let isDark = document.documentElement.classList.contains("dark");

    const mrandom = Math.random;
    const mfloor = Math.floor;
    const mround = Math.round;
    const mmin = Math.min;
    const mmax = Math.max;
    const mPI = Math.PI;
    const m2PI = Math.PI * 2;
    const msin = Math.sin;
    const mcos = Math.cos;
    const mhypot = Math.hypot;
    const msqrt = Math.sqrt;
    const rac3 = msqrt(3);
    const rac3s2 = rac3 / 2;

    function intAlea(min: number, max?: number) {
      if (typeof max === "undefined") {
        max = min;
        min = 0;
      }
      return mfloor(min + (max - min) * mrandom());
    }

    function alea(min: number, max?: number) {
      if (typeof max === "undefined") return min * mrandom();
      return min + (max - min) * mrandom();
    }

    type Pt = { x: number; y: number };

    function lerp(p1: Pt, p2: Pt, alpha: number): Pt {
      const omalpha = 1 - alpha;
      return { x: p1.x * omalpha + p2.x * alpha, y: p1.y * omalpha + p2.y * alpha };
    }

    class Bezier extends Array<Pt> {
      constructor([p0, p1, p2, p3]: [Pt, Pt, Pt, Pt]) {
        super();
        this.push(p0, p1, p2, p3);
      }
      split(alpha: number): [Bezier, Bezier] {
        const pa = lerp(this[0], this[1], alpha);
        const pb = lerp(this[1], this[2], alpha);
        const pc = lerp(this[2], this[3], alpha);
        const pd = lerp(pa, pb, alpha);
        const pe = lerp(pb, pc, alpha);
        const pf = lerp(pd, pe, alpha);
        return [new Bezier([this[0], pa, pd, pf]), new Bezier([pf, pe, pc, this[3]])];
      }
      getPath(alpha?: number): Path2D {
        const pth = new Path2D();
        pth.moveTo(this[0].x, this[0].y);
        let bb: Bezier = this;
        if (Number.isFinite(alpha) && Number(alpha) < 1) bb = this.split(Number(alpha))[0];
        pth.bezierCurveTo(bb[1].x, bb[1].y, bb[2].x, bb[2].y, bb[3].x, bb[3].y);
        return pth;
      }
      pathLength(approx: number): number {
        const calcLength = (bez: Bezier): number => {
          const l0 =
            mhypot(bez[1].x - bez[0].x, bez[1].y - bez[0].y) +
            mhypot(bez[2].x - bez[1].x, bez[2].y - bez[1].y) +
            mhypot(bez[3].x - bez[2].x, bez[3].y - bez[2].y);
          const l1 = mhypot(bez[3].x - bez[0].x, bez[3].y - bez[0].y);
          if (l0 / l1 < approx) return l0;
          const [ba, bb] = bez.split(0.5);
          return calcLength(ba) + calcLength(bb);
        };
        return calcLength(this);
      }
    }

    type Arc = {
      p0: HalfPoint;
      p1: HalfPoint;
      nexts: Arc[];
      from?: Arc | null;
      bez: Bezier;
      pathLength: number;
      duration: number;
      path: Path2D;
      tStart: number;
    };

    class HalfPoint {
      parent: Hexagon;
      khp: number;
      side: number;
      state: number;
      other?: HalfPoint;
      from?: Arc | null;
      constructor(parent: Hexagon, khp: number) {
        this.parent = parent;
        this.khp = khp;
        this.side = mfloor(khp / 2);
        this.state = 0;
      }
      attach(other: HalfPoint) {
        if (this.other) {
          if (this.other !== other) throw new Error("inconsistent attachment");
          return;
        }
        this.other = other;
        other.other = this;
      }
    }

    class Hexagon {
      kx: number;
      ky: number;
      hPoints: HalfPoint[];
      arcs: Arc[];
      xc = 0;
      yc = 0;
      pos: Pt[] = [];

      constructor(kx: number, ky: number) {
        this.kx = kx;
        this.ky = ky;
        this.hPoints = new Array(12).fill(0).map((_, k) => new HalfPoint(this, k));
        this.arcs = [];
      }

      calculateArc(arc: Arc) {
        const kp0 = arc.p0.khp;
        const kp1 = arc.p1.khp;
        let khp0 = kp0;
        let khp1 = kp1;
        if (kp0 & 1) {
          khp0 = 11 - kp0;
          khp1 = 11 - kp1;
        }
        khp1 = (khp1 - khp0 + 12) % 12;
        const coeffBeg = Hexagon.coeffBeg[khp1] * uiv.radius;
        const coeffEnd = Hexagon.coeffEnd[khp1] * uiv.radius;
        const side0 = mfloor(kp0 / 2);
        const side1 = mfloor(kp1 / 2);
        const p0 = this.pos[kp0];
        const p1 = this.pos[kp1];
        const pa = { x: p0.x + Hexagon.perp[side0].x * coeffBeg, y: p0.y + Hexagon.perp[side0].y * coeffBeg };
        const pb = { x: p1.x + Hexagon.perp[side1].x * coeffEnd, y: p1.y + Hexagon.perp[side1].y * coeffEnd };
        arc.bez = new Bezier([p0, pa, pb, p1]);
        arc.pathLength = Hexagon.pathLengths[khp1] * uiv.radius;
        arc.duration = arc.pathLength / SPEED;
        arc.path = arc.bez.getPath();
      }

      calculatePoints() {
        this.xc = (maxx - (nbx - 1) * 1.5 * uiv.radius) / 2 + 1.5 * uiv.radius * this.kx;
        let y0 = (maxy - (nby - 0.5) * rac3 * uiv.radius) / 2;
        if ((this.kx & 1) === 0) y0 += uiv.radius * rac3s2;
        this.yc = y0 + this.ky * uiv.radius * rac3;
        this.pos = Hexagon.positions.map((p) => ({ x: this.xc + p.x * uiv.radius, y: this.yc + p.y * uiv.radius }));
      }

      static k0 = 0.15;
      static vertices = [
        { x: 1, y: 0 },
        { x: 0.5, y: rac3s2 },
        { x: -0.5, y: rac3s2 },
        { x: -1, y: 0 },
        { x: -0.5, y: -rac3s2 },
        { x: 0.5, y: -rac3s2 },
      ];
      static positions = [
        lerp(Hexagon.vertices[0], Hexagon.vertices[1], 0.5 - Hexagon.k0),
        lerp(Hexagon.vertices[0], Hexagon.vertices[1], 0.5 + Hexagon.k0),
        lerp(Hexagon.vertices[1], Hexagon.vertices[2], 0.5 - Hexagon.k0),
        lerp(Hexagon.vertices[1], Hexagon.vertices[2], 0.5 + Hexagon.k0),
        lerp(Hexagon.vertices[2], Hexagon.vertices[3], 0.5 - Hexagon.k0),
        lerp(Hexagon.vertices[2], Hexagon.vertices[3], 0.5 + Hexagon.k0),
        lerp(Hexagon.vertices[3], Hexagon.vertices[4], 0.5 - Hexagon.k0),
        lerp(Hexagon.vertices[3], Hexagon.vertices[4], 0.5 + Hexagon.k0),
        lerp(Hexagon.vertices[4], Hexagon.vertices[5], 0.5 - Hexagon.k0),
        lerp(Hexagon.vertices[4], Hexagon.vertices[5], 0.5 + Hexagon.k0),
        lerp(Hexagon.vertices[5], Hexagon.vertices[0], 0.5 - Hexagon.k0),
        lerp(Hexagon.vertices[5], Hexagon.vertices[0], 0.5 + Hexagon.k0),
      ];
      static coeffBeg = [0, 0.2, 0.3, 0.4, 0.5, 0.6, 1, 0.7, 0.5, 0.5, 0.4, 0.2];
      static coeffEnd = [0, 0.2, 0.3, 0.3, 0.5, 0.6, 0.7, 0.7, 0.6, 0.6, 0.3, 0.3];
      static perp = [
        { x: -rac3s2, y: -0.5 },
        { x: 0, y: -1 },
        { x: rac3s2, y: -0.5 },
        { x: rac3s2, y: 0.5 },
        { x: 0, y: 1 },
        { x: -rac3s2, y: 0.5 },
      ];
      static pathLengths = (() => {
        const pl = [0];
        for (let k = 1; k < 12; ++k) {
          const sd = mfloor(k / 2);
          const bez = new Bezier([
            Hexagon.positions[0],
            {
              x: Hexagon.positions[0].x + Hexagon.coeffBeg[k] * Hexagon.perp[0].x,
              y: Hexagon.positions[0].y + Hexagon.coeffBeg[k] * Hexagon.perp[0].y,
            },
            {
              x: Hexagon.positions[k].x + Hexagon.coeffEnd[k] * Hexagon.perp[sd].x,
              y: Hexagon.positions[k].y + Hexagon.coeffEnd[k] * Hexagon.perp[sd].y,
            },
            Hexagon.positions[k],
          ]);
          pl[k] = bez.pathLength(1.05);
        }
        return pl;
      })();
    }

    const addStarter = (starters: HalfPoint[], hp: HalfPoint) => {
      starters.push(hp);
      hp.state = 1;
    };

    const prepareGo = () => {
      const starters: HalfPoint[] = [];
      inProgress = [];
      let currp: HalfPoint;
      if (!mouse) mouse = { x: maxx * 0.92, y: maxy * 0.9 };
      let kx = mfloor((mouse.x / maxx) * nbx);
      let ky = mfloor((mouse.y / maxy) * nby);
      kx = mmax(0, mmin(kx, nbx - 1));
      ky = mmax(0, mmin(ky, nby - 1));
      currp = grid[ky][kx].hPoints[intAlea(12)];
      addStarter(starters, currp);
      if (currp.other) addStarter(starters, currp.other);
      starters.forEach((st) => ((st as HalfPoint & { from: Arc | null }).from = null));
      return starters;
    };

    const goon = (starters: HalfPoint[]) => {
      while (starters.length) {
        const kcurrp = intAlea(starters.length);
        const currp = starters[kcurrp];
        const currCell = currp.parent;
        const targets: number[] = [];
        for (let k = 1; k < 12; ++k) {
          if (((currp.khp & 1) && k === 5) || (!(currp.khp & 1) && k === 7)) continue;
          const ktarg = (currp.khp + k) % 12;
          if (currCell.hPoints[ktarg].state !== 0) continue;
          if (
            currCell.arcs.find(
              (arc) =>
                (arc.p0.khp - currp.khp) *
                  (arc.p0.khp - ktarg) *
                  (arc.p1.khp - currp.khp) *
                  (arc.p1.khp - ktarg) <
                0,
            )
          ) {
            continue;
          }
          targets.push(ktarg);
        }
        if (targets.length === 0) {
          starters.splice(kcurrp, 1);
        } else {
          const ktarg = targets[intAlea(targets.length)];
          const ptarg = currCell.hPoints[ktarg];
          ptarg.state = 2;
          const arc: Arc = {
            p0: currp,
            p1: ptarg,
            nexts: [],
            bez: new Bezier([
              { x: 0, y: 0 },
              { x: 0, y: 0 },
              { x: 0, y: 0 },
              { x: 0, y: 0 },
            ]),
            pathLength: 0,
            duration: 0,
            path: new Path2D(),
            tStart: 0,
          };
          if (currp.from) currp.from.nexts.push(arc);
          else inProgress.push(arc);
          currCell.arcs.push(arc);
          currCell.calculateArc(arc);
          if (ptarg.other) {
            if (ptarg.other.state !== 0) throw new Error("ptarg.other.state != 0");
            ptarg.other.from = arc;
            addStarter(starters, ptarg.other);
          }
          return true;
        }
      }
      return false;
    };

    const attachHalfPoints = () => {
      grid.forEach((line, ky) => {
        line.forEach((hex, kx) => {
          hex.hPoints.forEach((hp, khp) => {
            const dkx = [1, 0, -1, -1, 0, 1][hp.side];
            const dky = [[1, 1, 1, 0, -1, 0], [0, 1, 0, -1, -1, -1]][kx & 1][hp.side];
            const kyn = ky + dky;
            if (kyn < 0 || kyn >= nby) return;
            const kxn = kx + dkx;
            if (kxn < 0 || kxn >= nbx) return;
            hp.attach(grid[kyn][kxn].hPoints[[7, 6, 9, 8, 11, 10, 1, 0, 3, 2, 5, 4][khp]]);
          });
        });
      });
    };

    const readUI = () => {
      uiv.radius = mmax(alea(RADIUSMIN, RADIUSMAX) * lRef, 20);
      uiv.lineWidth = mmax(uiv.radius * alea(0.05, 0.15), 0.5);
    };

    const startOver = () => {
      const host = canv.parentElement ?? document.body;
      const rect = host.getBoundingClientRect();
      maxx = Math.max(10, mround(rect.width));
      maxy = Math.max(10, mround(rect.height));
      if (maxx < 40 || maxy < 40) return false;
      // Always restart from bottom-right so pattern appears immediately without click.
      mouse = { x: maxx * 0.92, y: maxy * 0.9 };
      lRef = msqrt(maxx * maxy);
      canv.width = maxx;
      canv.height = maxy;

      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      readUI();

      nbx = mfloor((maxx / uiv.radius - 0.5) / 1.5) + 2;
      nby = mfloor(maxy / uiv.radius / rac3 - 0.5) + 2;

      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, maxx, maxy);

      grid = new Array(nby).fill(0).map((_, ky) => new Array(nbx).fill(0).map((__, kx) => new Hexagon(kx, ky)));
      grid.flat().forEach((cell) => cell.calculatePoints());
      attachHalfPoints();

      const st = prepareGo();
      while (goon(st));
      return true;
    };

    let animState = 0;
    let raf = 0;
    const animate = (tStamp: number) => {
      const message = messages.shift();
      if (message && (message.message === "reset" || message.message === "click")) animState = 0;
      raf = window.requestAnimationFrame(animate);

      switch (animState) {
        case 0:
          if (startOver()) {
            animState += 1;
            done = [];
            inProgress.forEach((seg) => (seg.tStart = tStamp));
          }
          break;
        case 1:
          if (inProgress.length === 0) {
            animState += 1;
            break;
          }
          ctx.fillStyle = isDark ? "#070707" : "#ffffff";
          ctx.fillRect(0, 0, maxx, maxy);
          ctx.strokeStyle = isDark ? "#f5f5f4" : "#000000";
          ctx.lineWidth = uiv.lineWidth;

          for (let k = inProgress.length - 1; k >= 0; --k) {
            const curr = inProgress[k];
            let alpha = (tStamp - curr.tStart) / curr.duration;
            if (alpha >= 1) {
              curr.nexts.forEach((nxt) => {
                nxt.tStart = curr.tStart + curr.duration;
                inProgress.push(nxt);
                alpha = mmin(1, (tStamp - nxt.tStart) / nxt.duration);
                ctx.stroke(nxt.bez.getPath(alpha));
              });
              done.push(curr);
              inProgress.splice(k, 1);
            } else {
              ctx.stroke(curr.bez.getPath(alpha));
            }
          }
          done.forEach((curr) => ctx.stroke(curr.path));
          break;
      }
    };

    const mouseClick = (event: MouseEvent) => {
      const rect = canv.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      messages.push({ message: "click", x, y });
      if (!mouse) mouse = { x, y };
      mouse.x = x;
      mouse.y = y;
    };

    const onResize = () => {
      messages.push({ message: "reset" });
    };

    const themeObserver =
      typeof MutationObserver !== "undefined"
        ? new MutationObserver(() => {
            isDark = document.documentElement.classList.contains("dark");
            messages.push({ message: "reset" });
          })
        : null;
    if (themeObserver) {
      themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
      });
    }

    const host = canv.parentElement;
    const resizeObserver =
      host && typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => {
            messages.push({ message: "reset" });
          })
        : null;
    if (host && resizeObserver) resizeObserver.observe(host);

    canv.addEventListener("click", mouseClick);
    window.addEventListener("resize", onResize);
    messages.push({ message: "reset" });
    raf = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(raf);
      canv.removeEventListener("click", mouseClick);
      window.removeEventListener("resize", onResize);
      if (resizeObserver) resizeObserver.disconnect();
      if (themeObserver) themeObserver.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden />;
}
