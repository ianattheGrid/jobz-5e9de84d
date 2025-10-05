import rocketLaunchImage from "@/assets/rocket-launch.jpg";

export const CandidateSectionHero = () => {
  return (
    <section className="relative h-[400px] overflow-hidden">
      <img 
        src={rocketLaunchImage} 
        alt="Rocket launching into space representing career launch for candidates" 
        className="absolute inset-0 w-full h-full object-cover" 
      />
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative container mx-auto px-4 h-full flex items-center justify-center">
        <div className="max-w-3xl text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Candidates, Launch Your Career
          </h2>
          <p className="text-primary [&]:!text-primary text-2xl md:text-3xl font-semibold">
            No per-hire gravity
          </p>
        </div>
      </div>
    </section>
  );
};
