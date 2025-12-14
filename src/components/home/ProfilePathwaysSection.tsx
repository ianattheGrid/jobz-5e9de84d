import { PRIMARY_COLOR_PATTERN } from "@/styles/colorPatterns";

export const ProfilePathwaysSection = () => {
  const pathways = [
    { name: "The Launchpad", description: "first role" },
    { name: "The Ascent", description: "early career" },
    { name: "The Core", description: "profession mastery" },
    { name: "The Pivot", description: "new direction" },
    { name: "The Encore", description: "working life chapter" },
  ];

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Headline */}
          <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-8 leading-tight ${PRIMARY_COLOR_PATTERN}`}>
            Your career isn't one-size-fits-all.
            <br />
            Your profile shouldn't be either.
          </h2>

          {/* Body Copy */}
          <div className="space-y-6 text-lg md:text-xl text-muted-foreground leading-relaxed mb-10">
            <p>
              Generic job profiles often miss the mark, failing to capture the nuances of your professional journey. 
              They don't understand the drive of a first-timer, the transferable skills of a career changer, or the 
              invaluable wisdom of a seasoned professional. They force everyone into the same mould, leaving valuable 
              stories untold.
            </p>
            
            <p className="text-foreground font-semibold text-xl md:text-2xl">
              At Jobz, we see you.
            </p>
            
            <p>
              We've reimagined the candidate profile, creating five tailored pathways designed to highlight your 
              unique strengths at every stage.
            </p>
          </div>

          {/* Five Pathways */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {pathways.map((pathway) => (
              <div 
                key={pathway.name}
                className="px-4 py-2 bg-background border border-border rounded-full shadow-sm"
              >
                <span className={`font-semibold ${PRIMARY_COLOR_PATTERN}`}>{pathway.name}</span>
                <span className="text-muted-foreground ml-1">– {pathway.description}</span>
              </div>
            ))}
          </div>

          {/* Closing Line */}
          <p className="text-xl md:text-2xl font-semibold text-foreground">
            Tell your authentic story. Find your perfect fit.
          </p>
        </div>
      </div>
    </section>
  );
};
