import rocketLaunchImage from "@/assets/rocket-launch.jpg";
import { Starfield } from "@/components/ui/starfield";

export const CandidateSectionHero = () => {
  return (
    <section className="relative h-[460px] w-full overflow-hidden sm:h-[520px]">
      <img
        src={rocketLaunchImage}
        alt="Rocket launching into space representing career launch for candidates"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-background/60" />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/25 to-background" />
      <Starfield density="low" nebula={false} className="opacity-50" />

      <div className="relative z-10 mx-auto flex h-full w-full max-w-4xl flex-col items-center justify-center px-5 text-center sm:px-8">
        <p className="eyebrow mb-4 text-primary">For candidates</p>
        <h2 className="display-heading text-4xl leading-[1.05] tracking-tight text-foreground sm:text-6xl">
          Launch your career
        </h2>
        <p className="mt-5 text-xl font-medium text-primary sm:text-2xl">
          No per-hire gravity
        </p>
      </div>
    </section>
  );
};
