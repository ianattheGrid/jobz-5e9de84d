import React from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "@/components/NavBar";
import { CostCalculatorSection } from "@/components/home/CostCalculatorSection";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BonusCalculator } from "@/components/candidate/sections/commission/BonusCalculator";
import { ArrowLeft } from "lucide-react";

const CostCalculatorPage = () => {
  const navigate = useNavigate();
  const [salary, setSalary] = React.useState("50000");
  const [feePercentage, setFeePercentage] = React.useState(15);
  const [splitPercentage, setSplitPercentage] = React.useState(50);

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <div className="container mx-auto px-4 pt-20">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <Button 
              onClick={() => navigate('/employer/dashboard')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Dashboard
            </Button>
          </div>
          
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 text-primary">
              Savings & Bonus calculators
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Calculate your recruitment savings and understand the bonus structure 
              for candidates and referral partners.
            </p>
          </div>

          {/* Recruitment Cost Savings */}
          <div className="mb-16">
            <CostCalculatorSection />
          </div>

          {/* Bonus Structure Calculator */}
          <section className="py-16 bg-muted/20">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center mb-10">
                <h2 className="text-3xl font-bold mb-4 text-primary">
                  Bonus Structure Calculator
                </h2>
                <p className="text-foreground mb-6">
                  See how bonuses are calculated for candidates and referral partners 
                  based on salary and commission structure.
                </p>
              </div>
              
              <Card className="max-w-4xl mx-auto">
                <CardHeader>
                  <CardTitle>Calculate Potential Bonuses</CardTitle>
                  <CardDescription>
                    Adjust the parameters below to see how bonuses are distributed between 
                    candidates and referral partners.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <BonusCalculator
                    sampleSalary={salary}
                    feePercentage={feePercentage}
                    splitPercentage={splitPercentage}
                    onSalaryChange={setSalary}
                    onFeeChange={(value) => setFeePercentage(value[0])}
                    onSplitChange={(value) => setSplitPercentage(value[0])}
                  />
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CostCalculatorPage;