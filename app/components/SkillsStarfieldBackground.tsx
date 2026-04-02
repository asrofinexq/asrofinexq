"use client";

const STAR_FIELD_WIDTH = 2560;
const STAR_FIELD_HEIGHT = 2560;
const STAR_START_OFFSET = 600;

function seededRandom(seed: number) {
  let value = seed >>> 0;
  return () => {
    value = (1664525 * value + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

function createStars(count: number, sizeSeed: number, color: string) {
  const rand = seededRandom(sizeSeed);
  const stars: string[] = [];
  for (let i = 0; i < count; i += 1) {
    const x = Math.floor(rand() * STAR_FIELD_WIDTH);
    const y = Math.floor(rand() * STAR_FIELD_HEIGHT);
    stars.push(`${x}px ${y}px ${color}`);
  }
  return stars.join(", ");
}

const STARS_SMALL = createStars(1700, 11, "var(--skills-star-small)");
const STARS_MEDIUM = createStars(700, 22, "var(--skills-star-medium)");
const STARS_LARGE = createStars(200, 33, "var(--skills-star-large)");

const SHOOTING_STARS = Array.from({ length: 10 }, (_, i) => {
  const rand = seededRandom(100 + i);
  return {
    delay: `${(rand() * 9).toFixed(2)}s`,
    duration: `${(7 + rand() * 6).toFixed(2)}s`,
    right: `${Math.floor(rand() * 100)}%`,
    bottom: `${Math.floor(rand() * 35)}%`,
  };
});

export default function SkillsStarfieldBackground() {
  return (
    <div className="skills-starfield" aria-hidden>
      <div className="skills-star skills-star--small" />
      <div className="skills-star skills-star--small skills-star--clone" />
      <div className="skills-star skills-star--medium" />
      <div className="skills-star skills-star--medium skills-star--clone" />
      <div className="skills-star skills-star--large" />
      <div className="skills-star skills-star--large skills-star--clone" />

      <div className="skills-shooting-wrap">
        {SHOOTING_STARS.map((star, idx) => (
          <span
            key={`shooting-${idx}`}
            className="skills-shooting-star"
            style={{
              animationDelay: star.delay,
              animationDuration: star.duration,
              right: star.right,
              bottom: star.bottom,
            }}
          />
        ))}
      </div>

      <style jsx>{`
        .skills-starfield {
          --skills-bg-start: #eef4ff;
          --skills-bg-end: #d4e1ff;
          --skills-star-small: rgba(16, 33, 66, 0.55);
          --skills-star-medium: rgba(12, 27, 58, 0.7);
          --skills-star-large: rgba(7, 19, 44, 0.85);
          --skills-shooting-color: rgba(42, 97, 255, 0.9);
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
          background: linear-gradient(to bottom, var(--skills-bg-start) 0%, var(--skills-bg-end) 100%);
          z-index: 0;
        }

        :global(.dark) .skills-starfield {
          --skills-bg-start: #020107;
          --skills-bg-end: #201b46;
          --skills-star-small: rgba(255, 255, 255, 0.75);
          --skills-star-medium: rgba(255, 255, 255, 0.9);
          --skills-star-large: rgba(255, 255, 255, 1);
          --skills-shooting-color: rgba(211, 233, 255, 0.95);
        }

        .skills-star {
          position: absolute;
          border-radius: 50%;
          background: transparent;
          animation-name: skills-anim-star;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          z-index: 1;
        }

        .skills-star--clone {
          top: -${STAR_START_OFFSET}px;
        }

        .skills-star--small {
          width: 1px;
          height: 1px;
          box-shadow: ${STARS_SMALL};
          animation-duration: 100s;
        }

        .skills-star--medium {
          width: 2px;
          height: 2px;
          box-shadow: ${STARS_MEDIUM};
          animation-duration: 125s;
        }

        .skills-star--large {
          width: 3px;
          height: 3px;
          box-shadow: ${STARS_LARGE};
          animation-duration: 175s;
        }

        .skills-shooting-wrap {
          position: absolute;
          inset: 0;
          z-index: 2;
        }

        .skills-shooting-star {
          position: absolute;
          width: 4px;
          height: 90px;
          border-top-left-radius: 50%;
          border-top-right-radius: 50%;
          background: linear-gradient(to top, rgba(255, 255, 255, 0), var(--skills-shooting-color));
          opacity: 0;
          transform: rotate(-45deg);
          animation-name: skills-shooting;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }

        @keyframes skills-anim-star {
          from {
            transform: translateY(0px) translateX(0px);
          }
          to {
            transform: translateY(-${STAR_FIELD_HEIGHT}px) translateX(-${STAR_FIELD_WIDTH}px);
          }
        }

        @keyframes skills-shooting {
          0% {
            transform: translateY(0px) translateX(0px) rotate(-45deg);
            opacity: 0;
            height: 5px;
          }
          8% {
            opacity: 1;
          }
          100% {
            transform: translateY(-${STAR_FIELD_HEIGHT}px) translateX(-${STAR_FIELD_WIDTH}px) rotate(-45deg);
            opacity: 0;
            height: 620px;
          }
        }
      `}</style>
    </div>
  );
}
