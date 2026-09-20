import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import astronautImage from "@/assets/astronaut-candidate.jpg";
import rocketImage from "@/assets/rocket-launch.jpg";

const useCountUp = (target: number, active: boolean, duration = 1400) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, active, duration]);

  return value;
};

const CostComparisonVisual = () => {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const agencyFee = useCountUp(10000, inView);
  const jobzFee = useCountUp(9, inView, 900);

  return (
    <section
      ref={ref}
      className="relative w-screen -mx-[calc((100vw-100%)/2)] overflow-hidden bg-background"
    >
      <div className="relative flex flex-col md:flex-row w-full min-h-[70vh] md:min-h-[80vh]">
        {/* Agency side */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="group relative w-full md:w-1/2 min-h-[45vh] md:min-h-0 overflow-hidden"
        >
          <img
            src={astronautImage}
            alt="Hiring through a recruitment agency"
            className="absolute inset-0 w-full h-full object-cover object-center grayscale contrast-125 transition-transform duration-[1200ms] group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
          <div className="relative h-full flex flex-col justify-end items-center text-center gap-3 p-8 md:p-14">
            <span className="text-xs md:text-sm uppercase tracking-[0.35em] text-muted-foreground">
              Recruitment agency
            </span>
            <span className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-foreground tabular-nums">
              £{agencyFee.toLocaleString("en-GB")}
            </span>
            <span className="text-sm md:text-base text-muted-foreground max-w-xs">
              A typical fee on one £45,000 hire — before they've placed anybody
              else.
            </span>
          </div>
        </motion.div>

        {/* Jobz side */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="group relative w-full md:w-1/2 min-h-[45vh] md:min-h-0 overflow-hidden"
        >
          <img
            src={rocketImage}
            alt="Hiring direct with Jobz"
            className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-[1200ms] group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-primary/20" />
          <div className="relative h-full flex flex-col justify-end items-center text-center gap-3 p-8 md:p-14">
            <span className="text-xs md:text-sm uppercase tracking-[0.35em] text-primary">
              Jobz, direct
            </span>
            <span className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-primary tabular-nums drop-shadow-[0_0_35px_hsl(var(--primary)/0.55)]">
              £{jobzFee}
            </span>
            <span className="text-sm md:text-base text-muted-foreground max-w-xs">
              One flat fee. No percentage, no middleman, no mark-up on the
              person you hire.
            </span>
          </div>
        </motion.div>

        {/* VS badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.5, type: "spring" }}
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
        >
          <div className="flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-full border border-primary/40 bg-background/80 backdrop-blur-sm text-base md:text-lg font-bold uppercase tracking-widest text-primary shadow-[0_0_50px_hsl(var(--primary)/0.35)]">
            vs
          </div>
        </motion.div>
      </div>

      {/* Headline */}
      <div className="relative py-14 md:py-20 px-6 text-center">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight text-foreground"
        >
          You're an SME.{" "}
          <span className="bg-gradient-to-r from-primary via-primary/70 to-primary bg-clip-text text-transparent">
            Who would you hire?
          </span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25, duration: 0.6 }}
          className="mx-auto mt-5 max-w-2xl text-base md:text-lg text-muted-foreground"
        >
          Same candidate. Same job. The only difference is who takes a cut on
          the way through.
        </motion.p>
      </div>
    </section>
  );
};

export default CostComparisonVisual;
