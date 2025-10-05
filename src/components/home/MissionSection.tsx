export const MissionSection = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="space-y-3 text-center">
          <div className="flex justify-center overflow-hidden">
            <p className="text-sm md:text-base text-foreground/80 leading-tight font-mono border-r-2 border-foreground/80 pr-1 animate-typewriter animate-blink whitespace-nowrap inline-block overflow-hidden">
              Online and traditional middlemen have made hiring expensive and slow – they profit from complexity.
            </p>
          </div>
          
          <p className="text-sm md:text-base text-foreground/90 leading-snug font-mono">
            No more per-hire business talk. Candidates get hired for the price of a coffee.
          </p>
          
          <p className="text-sm md:text-base text-foreground/80 leading-snug font-mono">
            If a role is harder to fill, employers can attract talent with "You're Hired" bonuses, or anonymously tap into a huge community to find candidates for them.
          </p>
          
          <p className="text-base md:text-lg font-mono font-bold text-primary mt-6">
            Your mission: Hired.
          </p>
        </div>
      </div>
    </section>
  );
};
