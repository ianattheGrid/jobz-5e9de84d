
import { CostSavingCalculator } from "./CostSavingCalculator";
import { PRIMARY_COLOR_PATTERN } from "@/styles/colorPatterns";

export const ContractorCalculatorSection = () => {
  return (
    <section className="py-16 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-10">
          <h2 className={`text-3xl font-bold mb-4 ${PRIMARY_COLOR_PATTERN}`}>
            Calculate Your Savings
          </h2>
          <p className="text-foreground mb-6">
            Use our calculator to see how much you could save by using our fixed-fee contractor 
            recruitment service instead of traditional percentage-based agencies.
          </p>
        </div>
        
        <CostSavingCalculator />
      </div>
    </section>
  );
};
