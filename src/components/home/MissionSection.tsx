export const MissionSection = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="space-y-3 flex flex-col items-start">
          <p className="text-sm md:text-base text-foreground/80 leading-relaxed font-mono pr-4 
                        whitespace-normal lg:whitespace-nowrap lg:overflow-hidden 
                        animate-fade-in lg:animate-typewriter">
            Online and traditional middlemen have made hiring expensive and slow – they profit from complexity.
          </p>
          
          <p className="text-sm md:text-base text-foreground/90 leading-relaxed font-mono pr-4 
                        whitespace-normal lg:whitespace-nowrap lg:overflow-hidden 
                        animate-fade-in lg:animate-typewriter-2 lg:opacity-0">
            No more per-hire business talk. Candidates get hired for the price of a coffee.
          </p>
          
          <p className="text-sm md:text-base text-foreground/80 leading-relaxed font-mono pr-4 
                        whitespace-normal lg:whitespace-nowrap lg:overflow-hidden 
                        animate-fade-in lg:animate-typewriter-3 lg:opacity-0">
            Employers can attract talent with "You're Hired" bonuses & anonymously tap into our huge community to find candidates.
          </p>
          
          <p className="text-base md:text-lg font-mono font-bold text-primary mt-6 pr-4 
                        whitespace-normal lg:whitespace-nowrap lg:overflow-hidden 
                        animate-fade-in lg:animate-typewriter-4 lg:opacity-0">
            Mission accomplished.
          </p>
        </div>
      </div>
    </section>
  );
};
