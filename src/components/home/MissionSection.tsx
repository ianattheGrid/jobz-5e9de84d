import { SectionShell } from "@/components/ui/section-shell";
import { Starfield } from "@/components/ui/starfield";

const LINES = [
  {
    text: "Online and traditional middlemen have made hiring expensive and slow – they profit from complexity.",
    animation: "lg:animate-typewriter",
    tone: "text-foreground/70",
  },
  {
    text: "No more per-hire business talk. Candidates get hired for the price of a coffee.",
    animation: "lg:animate-typewriter-2 lg:opacity-0",
    tone: "text-foreground/85",
  },
  {
    text: "Employers can attract talent with \u201cYou're Hired\u201d bonuses & anonymously tap into our huge community to find candidates.",
    animation: "lg:animate-typewriter-3 lg:opacity-0",
    tone: "text-foreground/70",
  },
];

export const MissionSection = () => {
  return (
    <SectionShell size="md" className="border-y border-white/5">
      <Starfield density="low" />
      <div className="flex w-full max-w-full flex-col items-start space-y-4 overflow-hidden">
        {LINES.map((line) => (
          <p
            key={line.text}
            className={`pr-6 font-mono text-sm leading-relaxed animate-fade-in sm:text-base
                        whitespace-normal lg:overflow-hidden lg:whitespace-nowrap ${line.tone} ${line.animation}`}
          >
            {line.text}
          </p>
        ))}

        <p
          className="mt-4 pr-6 font-mono text-base font-bold text-primary animate-fade-in sm:text-lg
                     whitespace-normal lg:overflow-hidden lg:whitespace-nowrap lg:animate-typewriter-4 lg:opacity-0"
        >
          Mission accomplished.
        </p>
      </div>
    </SectionShell>
  );
};
