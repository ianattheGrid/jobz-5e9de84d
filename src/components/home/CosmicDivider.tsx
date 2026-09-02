import { useMemo } from "react";

/**
 * Cosmic visual break between the hiring-models comparison and the
 * recruitment cost calculator. Pure CSS/SVG — no image assets.
 */
export const CosmicDivider = () => {
  const stars = useMemo(
    () =>
      Array.from({ length: 60 }, (_, i) => ({
        id: i,
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: Math.random() * 2 + 1,
        delay: Math.random() * 4,
        duration: 2.5 + Math.random() * 3,
      })),
    []
  );

  return (
    <section
      aria-hidden="true"
      className="relative isolate overflow-hidden bg-[hsl(240_60%_6%)] py-24 md:py-32"
    >
      {/* Stars */}
      {stars.map((star) => (
        <span
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            top: `${star.top}%`,
            left: `${star.left}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: 0.7,
            animation: `pulse ${star.duration}s ease-in-out ${star.delay}s infinite`,
          }}
        />
      ))}

      {/* Nebula glows */}
      <div className="pointer-events-none absolute -left-20 top-0 h-80 w-80 rounded-full bg-primary/25 blur-[100px]" />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-[hsl(265_80%_60%)]/25 blur-[110px]" />

      {/* Orbiting planet */}
      <div className="relative z-10 flex flex-col items-center gap-8 px-4 text-center">
        <div className="relative h-40 w-40 md:h-48 md:w-48">
          <div className="absolute inset-0 rounded-full bg-primary/30 blur-2xl" />
          <div className="absolute inset-2 rounded-full bg-[radial-gradient(circle_at_30%_25%,hsl(330_90%_72%),hsl(280_70%_38%)_55%,hsl(250_70%_18%))] shadow-[0_0_60px_-10px_hsl(var(--primary))]" />
          <div className="absolute inset-0 animate-[spin_18s_linear_infinite]">
            <div className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 rounded-full bg-white shadow-[0_0_12px_2px_rgba(255,255,255,0.8)]" />
          </div>
          <div className="absolute left-1/2 top-1/2 h-[130%] w-[130%] -translate-x-1/2 -translate-y-1/2 rotate-[18deg] rounded-full border border-white/20" />
        </div>

        <p className="max-w-xl text-balance text-xl font-semibold text-white md:text-2xl">
          No middlemen orbiting your salary.
        </p>
        <p className="max-w-md text-sm text-white/60">
          Just you, the employer, and a £9 flat fee.
        </p>
      </div>
    </section>
  );
};

export default CosmicDivider;
