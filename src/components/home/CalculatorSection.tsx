
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { BonusCalculator } from "@/components/candidate/sections/commission/BonusCalculator";
import { PRIMARY_COLOR_PATTERN } from "@/styles/colorPatterns";

export const CalculatorSection = () => {
  const [sampleSalary, setSampleSalary] = useState("");
  const [feePercentage, setFeePercentage] = useState(7);
  const [splitPercentage, setSplitPercentage] = useState(50);

  return (
    <section id="calculator-section" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className={`text-3xl font-bold mb-6 ${PRIMARY_COLOR_PATTERN}`}>
            Try Our Bonus Calculator
          </h2>
          <p className="text-foreground mb-8">
            See how much you could earn in bonuses when you get hired or refer someone.
            Our transparent commission structure means more money in your pocket.
          </p>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Calculate Your Potential Bonus
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Bonus Calculator</DialogTitle>
                <DialogDescription>
                  Calculate potential bonuses for successful job placements
                </DialogDescription>
              </DialogHeader>
              <BonusCalculator
                sampleSalary={sampleSalary}
                feePercentage={feePercentage}
                splitPercentage={splitPercentage}
                onSalaryChange={setSampleSalary}
                onFeeChange={(value) => setFeePercentage(value[0])}
                onSplitChange={(value) => setSplitPercentage(value[0])}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </section>
  );
};
