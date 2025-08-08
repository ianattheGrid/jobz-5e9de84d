import React from 'react';
import { EmployeeRecruitmentCalculator } from '@/components/calculators/EmployeeRecruitmentCalculator';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CostCalculatorSection = () => {
  return (
    <section className="py-16 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-10">
          <h2 className="text-3xl font-bold mb-4 text-primary">
            Calculate Your Recruitment Savings
          </h2>
          <p className="text-foreground mb-6">
            See how much you could save by switching from traditional recruitment agencies 
            or direct hiring to our transparent monthly pricing model.
          </p>
        </div>
        
        <EmployeeRecruitmentCalculator />
        
        <div className="text-center mt-8">
          <Link to="/cost-calculator">
            <Button className="inline-flex items-center gap-2">
              View Full Calculator
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};