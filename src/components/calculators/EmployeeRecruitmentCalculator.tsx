import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calculator, PoundSterling, TrendingDown } from 'lucide-react';

interface CalculatorResults {
  traditionalCost: number;
  jobzCost: number;
  costSaving: number;
  months: number;
}

export const EmployeeRecruitmentCalculator = () => {
  const [salary, setSalary] = useState<string>('');
  const [recruitmentType, setRecruitmentType] = useState<'agency' | 'direct' | ''>('');
  const [feePercentage, setFeePercentage] = useState<number>(20);
  const [months, setMonths] = useState<number>(1);
  const [results, setResults] = useState<CalculatorResults | null>(null);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(amount);
  };

  const formatSalaryInput = (value: string): string => {
    const numericValue = value.replace(/[^0-9]/g, '');
    if (!numericValue) return '';
    return parseInt(numericValue).toLocaleString();
  };

  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatSalaryInput(e.target.value);
    setSalary(formatted);
  };

  const calculateCosts = () => {
    if (!salary || !recruitmentType) {
      console.log('Missing required fields:', { salary, recruitmentType });
      setResults(null);
      return;
    }

    const numericSalary = parseFloat(salary.replace(/[^0-9]/g, ''));
    console.log('Calculating costs:', { salary, numericSalary, recruitmentType, feePercentage, months });
    
    if (isNaN(numericSalary) || numericSalary <= 0) {
      console.log('Invalid salary value:', numericSalary);
      setResults(null);
      return;
    }

    let traditionalCost = 0;

    if (recruitmentType === 'agency') {
      traditionalCost = numericSalary * (feePercentage / 100);
    } else if (recruitmentType === 'direct') {
      traditionalCost = 6125; // CIPD average cost per hire
    }

    const jobzCost = 9 * months;
    const costSaving = traditionalCost - jobzCost;

    console.log('Calculation results:', { traditionalCost, jobzCost, costSaving });

    setResults({
      traditionalCost,
      jobzCost,
      costSaving,
      months
    });
  };

  useEffect(() => {
    calculateCosts();
  }, [salary, recruitmentType, feePercentage, months]);


  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 border-primary/20 shadow-lg">
        <CardHeader className="text-center bg-gradient-to-r from-primary/5 to-primary/10 rounded-t-lg">
          <CardTitle className="flex items-center justify-center gap-2 text-3xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            <Calculator className="h-7 w-7 text-primary" />
            Employee Recruitment Cost Calculator
          </CardTitle>
          <p className="text-muted-foreground text-lg">
            Calculate how much you could save using jobz for employee recruitment
          </p>
        </CardHeader>
        <CardContent className="space-y-8 p-8">
          {/* Salary Input */}
          <div className="space-y-3">
            <Label htmlFor="salary" className="text-base font-medium">Annual Salary (£)</Label>
            <Input
              id="salary"
              type="text"
              value={salary}
              onChange={handleSalaryChange}
              placeholder="35,000"
              className="text-lg h-12 border-primary/20 focus:border-primary/50 bg-background/50"
            />
          </div>

          {/* Recruitment Type Selection */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Current Recruitment Method</Label>
            <Select value={recruitmentType} onValueChange={(value: 'agency' | 'direct') => setRecruitmentType(value)}>
              <SelectTrigger className="h-12 border-primary/20 focus:border-primary/50 bg-background/50">
                <SelectValue placeholder="Select your current recruitment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="agency">Recruitment Agency</SelectItem>
                <SelectItem value="direct">Direct Hire</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Agency Fee Percentage (only shown for agency) */}
          {recruitmentType === 'agency' && (
            <div className="space-y-4 p-6 bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl border border-primary/20">
              <Label className="text-base font-medium">Agency Fee Percentage: {feePercentage}%</Label>
              <div className="px-4">
                <input
                  type="range"
                  min="15"
                  max="30"
                  step="1"
                  value={feePercentage}
                  onChange={(e) => setFeePercentage(parseInt(e.target.value))}
                  className="w-full h-3 bg-primary/20 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-sm font-medium text-primary mt-2">
                  <span>15%</span>
                  <span>30%</span>
                </div>
              </div>
            </div>
          )}

          {/* Direct Hire Cost Display */}
          {recruitmentType === 'direct' && (
            <div className="p-6 bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl border border-primary/20">
              <div className="flex items-center gap-2 mb-3">
                <PoundSterling className="h-5 w-5 text-primary" />
                <span className="font-semibold text-primary">CIPD Average Cost Per Hire</span>
              </div>
              <p className="text-3xl font-bold text-primary mb-2">{formatCurrency(6125)}</p>
              <p className="text-sm text-muted-foreground">
                According to the Chartered Institute of Personnel and Development
              </p>
            </div>
          )}

          {/* Months Selection */}
          <div className="space-y-4 p-6 bg-gradient-to-r from-secondary/5 to-secondary/10 rounded-xl border border-secondary/20">
            <Label className="text-base font-medium">Months using jobz: {months} month{months !== 1 ? 's' : ''}</Label>
            <div className="px-4">
              <input
                type="range"
                min="1"
                max="12"
                step="1"
                value={months}
                onChange={(e) => setMonths(parseInt(e.target.value))}
                className="w-full h-3 bg-secondary/20 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-sm font-medium text-secondary-foreground mt-2">
                <span>1 month</span>
                <span>12 months</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Card */}
      {results && recruitmentType && (
        <Card className="bg-gradient-to-br from-green-500/10 via-background to-emerald-500/10 border-green-500/20 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-500/5 to-emerald-500/10 rounded-t-lg">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <TrendingDown className="h-6 w-6 text-green-600" />
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Your Cost Savings
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-red-500/10 to-red-600/20 rounded-xl border border-red-500/20 shadow-md">
                <p className="text-sm text-red-600 font-semibold mb-2">
                  {recruitmentType === 'agency' ? 'Agency Cost' : 'Direct Hire Cost'}
                </p>
                <p className="text-3xl font-bold text-red-700 mb-2">
                  {formatCurrency(results.traditionalCost)}
                </p>
                {recruitmentType === 'agency' && (
                  <p className="text-xs text-red-600/80">
                    {feePercentage}% of £{salary}
                  </p>
                )}
              </div>

              <div className="text-center p-6 bg-gradient-to-br from-blue-500/10 to-blue-600/20 rounded-xl border border-blue-500/20 shadow-md">
                 <p className="text-sm text-blue-600 font-semibold mb-2">
                   jobz Cost ({months} month{months !== 1 ? 's' : ''})
                 </p>
                <p className="text-3xl font-bold text-blue-700 mb-2">
                  {formatCurrency(results.jobzCost)}
                </p>
                <p className="text-xs text-blue-600/80">
                  £9 per month
                </p>
              </div>

              <div className="text-center p-6 bg-gradient-to-br from-green-500/10 to-emerald-600/20 rounded-xl border border-green-500/20 shadow-md">
                <p className="text-sm text-green-600 font-semibold mb-2">
                  Total Savings
                </p>
                <p className="text-3xl font-bold text-green-700 mb-3">
                  {formatCurrency(results.costSaving)}
                </p>
                <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold shadow-sm">
                  {Math.round((results.costSaving / results.traditionalCost) * 100)}% saved
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Slider styles
const sliderStyles = `
.slider::-webkit-slider-thumb {
  appearance: none;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: hsl(var(--primary));
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.slider::-moz-range-thumb {
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: hsl(var(--primary));
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.slider::-webkit-slider-track {
  appearance: none;
  height: 12px;
  border-radius: 6px;
  background: hsl(var(--primary) / 0.2);
}

.slider::-moz-range-track {
  height: 12px;
  border-radius: 6px;
  background: hsl(var(--primary) / 0.2);
  border: none;
}
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.innerHTML = sliderStyles;
  document.head.appendChild(styleElement);
}