import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import astronautImage from "@/assets/astronaut-candidate.jpg";

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

const usualCosts = [
  { label: "Recruitment agency fee", value: "£4,500" },
  { label: "LinkedIn Recruiter licence", value: "£1,075" },
  { label: "Job ads & AI screening tools", value: "£550" },
];

const CostComparisonVisual = () => {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const usualTotal = useCountUp(6125, inView);
  const jobzFee = useCountUp(9, inView, 900);

  return (
    <section
      ref={ref}
      className="relative w-screen -mx-[calc((100vw-100%)/2)] overflow-hidden bg-background"
    >
      {/* Same candidate banner */}
      <div className="relative py-10 md:py-14 px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-xs md:text-sm uppercase tracking-[0.35em] text-muted-foreground"
        >
          The same candidate. Two ways to hire them.
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mx-auto mt-4 max-w-4xl text-3xl md:text-5xl lg:text-6xl font-black tracking-tight text-foreground"
        >
          Same person hired.{" "}
          <span className="bg-gradient-to-r from-primary via-primary/70 to-primary bg-clip-text text-transparent">
            Wildly different bill.
          </span>
        </motion.h2>
      </div>

      <div className="relative flex flex-col md:flex-row w-full min-h-[70vh] md:min-h-[78vh]">
        {/* The usual route */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="group relative w-full md:w-1/2 min-h-[55vh] md:min-h-0 overflow-hidden"
        >
          <img
            src={astronautImage}
            alt="The same candidate, hired through middlemen"
            className="absolute inset-0 w-full h-full object-cover object-center grayscale contrast-125 transition-transform duration-[1200ms] group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/30" />
          <div className="relative h-full flex flex-col justify-end items-center text-center gap-4 p-8 md:p-14">
            <span className="text-xs md:text-sm uppercase tracking-[0.35em] text-muted-foreground">
              LinkedIn + agency + AI tools
            </span>
            <span className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-foreground tabular-nums">
              £{usualTotal.toLocaleString("en-GB")}
            </span>
            <ul className="w-full max-w-xs space-y-2 pt-2">
              {usualCosts.map((item) => (
                <li
                  key={item.label}
                  className="flex items-center justify-between gap-4 border-b border-border/40 pb-2 text-sm text-muted-foreground"
                >
                  <span className="text-left">{item.label}</span>
                  <span className="font-semibold text-foreground tabular-nums">
                    {item.value}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Jobz route */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="group relative w-full md:w-1/2 min-h-[55vh] md:min-h-0 overflow-hidden"
        >
          <img
            src={astronautImage}
            alt="The same candidate, hired direct through Jobz"
            className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-[1200ms] group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/75 to-primary/25" />
          <div className="relative h-full flex flex-col justify-end items-center text-center gap-4 p-8 md:p-14">
            <span className="text-xs md:text-sm uppercase tracking-[0.35em] text-primary">
              Jobz, direct
            </span>
            <span className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-primary tabular-nums drop-shadow-[0_0_35px_hsl(var(--primary)/0.55)]">
              £{jobzFee}
            </span>
            <ul className="w-full max-w-xs space-y-2 pt-2">
              <li className="flex items-center justify-between gap-4 border-b border-primary/25 pb-2 text-sm text-muted-foreground">
                <span className="text-left">One flat hiring fee</span>
                <span className="font-semibold text-primary tabular-nums">£9</span>
              </li>
              <li className="flex items-center justify-between gap-4 border-b border-primary/25 pb-2 text-sm text-muted-foreground">
                <span className="text-left">Agency commission</span>
                <span className="font-semibold text-foreground">£0</span>
              </li>
              <li className="flex items-center justify-between gap-4 border-b border-primary/25 pb-2 text-sm text-muted-foreground">
                <span className="text-left">Licences & tools</span>
                <span className="font-semibold text-foreground">£0</span>
              </li>
            </ul>
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

      <div className="relative py-12 md:py-16 px-6 text-center">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        <motion.h3
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-2xl md:text-4xl font-black tracking-tight text-foreground"
        >
          You're an SME.{" "}
          <span className="bg-gradient-to-r from-primary via-primary/70 to-primary bg-clip-text text-transparent">
            Which bill would you rather pay?
          </span>
        </motion.h3>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mx-auto mt-4 max-w-2xl text-sm md:text-base text-muted-foreground"
        >
          Illustrative costs for one hire on a £30,000 salary, using publicly
          reported market rates. The candidate is the same either way — only the
          middlemen change.
        </motion.p>
      </div>
    </section>
  );
};

export default CostComparisonVisual;
