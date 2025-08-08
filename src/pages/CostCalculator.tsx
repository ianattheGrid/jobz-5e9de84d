import React from 'react';
import NavBar from '@/components/NavBar';
import { EmployeeRecruitmentCalculator } from '@/components/calculators/EmployeeRecruitmentCalculator';

export default function CostCalculator() {
  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Recruitment Cost Calculator
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover how much you could save on your recruitment costs by switching to Jobz. 
              Compare traditional agency fees and direct hiring costs with our transparent monthly pricing.
            </p>
          </div>
          
          <EmployeeRecruitmentCalculator />
        </div>
      </div>
    </div>
  );
}