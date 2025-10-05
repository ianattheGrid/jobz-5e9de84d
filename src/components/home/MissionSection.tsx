export const MissionSection = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="space-y-4 text-center">
          <div className="overflow-hidden">
            <p className="text-sm md:text-base text-foreground/80 leading-tight font-mono inline-block overflow-hidden whitespace-nowrap border-r-2 border-foreground/80 pr-1 animate-typewriter animate-blink">
              Online and traditional middlemen have made hiring expensive and slow – they profit from complexity.
            </p>
          </div>
          
          <p className="text-xl md:text-2xl text-foreground leading-relaxed font-semibold">
            No more per-hire business talk. Candidates get hired for the price of a coffee.
          </p>
          
          <p className="text-lg md:text-xl text-foreground/90 leading-relaxed">
            If a role is harder to fill, employers can attract talent with "You're Hired" bonuses, or anonymously tap into a huge community to find candidates for them.
          </p>
          
          <p className="text-2xl md:text-3xl font-bold text-primary mt-8">
            Your mission: Hired.
          </p>
        </div>
      </div>
    </section>
  );
};
