export const MissionSection = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="space-y-3 flex flex-col items-start">
          <p className="text-sm md:text-base text-foreground/80 leading-tight font-mono pr-1 animate-typewriter whitespace-nowrap overflow-hidden inline-block">
            Online and traditional middlemen have made hiring expensive and slow – they profit from complexity.
          </p>
          
          <p className="text-sm md:text-base text-foreground/90 leading-snug font-mono pr-1 animate-typewriter-2 whitespace-nowrap overflow-hidden inline-block opacity-0">
            No more per-hire business talk. Candidates get hired for the price of a coffee.
          </p>
          
          <p className="text-sm md:text-base text-foreground/80 leading-snug font-mono pr-1 animate-typewriter-3 whitespace-nowrap overflow-hidden inline-block opacity-0">
            Employers can attract talent with "You're Hired" bonuses, or anonymously tap into a huge community to find candidates for them.
          </p>
          
          <p className="text-base md:text-lg font-mono font-bold text-primary mt-6 pr-1 animate-typewriter-4 whitespace-nowrap overflow-hidden inline-block opacity-0">
            Your mission: Hired.
          </p>
        </div>
      </div>
    </section>
  );
};
