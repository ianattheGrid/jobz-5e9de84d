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
    if (!salary || !recruitmentType) return;

    const numericSalary = parseFloat(salary.replace(/[^0-9.]/g, ''));
    let traditionalCost = 0;

    if (recruitmentType === 'agency') {
      traditionalCost = numericSalary * (feePercentage / 100);
    } else if (recruitmentType === 'direct') {
      traditionalCost = 6125; // CIPD average cost per hire
    }

    const jobzCost = 9 * months;
    const costSaving = traditionalCost - jobzCost;

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
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-2xl">
            <Calculator className="h-6 w-6 text-primary" />
            Employee Recruitment Cost Calculator
          </CardTitle>
          <p className="text-muted-foreground">
            Calculate how much you could save using jobz for employee recruitment
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Salary Input */}
          <div className="space-y-2">
            <Label htmlFor="salary">Annual Salary (£)</Label>
            <Input
              id="salary"
              type="text"
              value={salary}
              onChange={handleSalaryChange}
              placeholder="35,000"
              className="text-lg"
            />
          </div>

          {/* Recruitment Type Selection */}
          <div className="space-y-2">
            <Label>Current Recruitment Method</Label>
            <Select value={recruitmentType} onValueChange={(value: 'agency' | 'direct') => setRecruitmentType(value)}>
              <SelectTrigger>
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
            <div className="space-y-4">
              <Label>Agency Fee Percentage: {feePercentage}%</Label>
              <div className="px-4">
                <input
                  type="range"
                  min="15"
                  max="30"
                  step="1"
                  value={feePercentage}
                  onChange={(e) => setFeePercentage(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>15%</span>
                  <span>30%</span>
                </div>
              </div>
            </div>
          )}

          {/* Direct Hire Cost Display */}
          {recruitmentType === 'direct' && (
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <PoundSterling className="h-4 w-4 text-primary" />
                <span className="font-medium">CIPD Average Cost Per Hire</span>
              </div>
              <p className="text-2xl font-bold text-primary">{formatCurrency(6125)}</p>
              <p className="text-sm text-muted-foreground">
                According to the Chartered Institute of Personnel and Development
              </p>
            </div>
          )}

          {/* Months Selection */}
           <div className="space-y-4">
             <Label>Months using jobz: {months} month{months !== 1 ? 's' : ''}</Label>
            <div className="px-4">
              <input
                type="range"
                min="1"
                max="12"
                step="1"
                value={months}
                onChange={(e) => setMonths(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>1 month</span>
                <span>12 months</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Card */}
      {results && recruitmentType && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-green-600" />
              Your Cost Savings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                <p className="text-sm text-red-600 font-medium mb-1">
                  {recruitmentType === 'agency' ? 'Agency Cost' : 'Direct Hire Cost'}
                </p>
                <p className="text-2xl font-bold text-red-700">
                  {formatCurrency(results.traditionalCost)}
                </p>
                {recruitmentType === 'agency' && (
                  <p className="text-xs text-red-600 mt-1">
                    {feePercentage}% of £{salary}
                  </p>
                )}
              </div>

              <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                 <p className="text-sm text-blue-600 font-medium mb-1">
                   jobz Cost ({months} month{months !== 1 ? 's' : ''})
                 </p>
                <p className="text-2xl font-bold text-blue-700">
                  {formatCurrency(results.jobzCost)}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  £9 per month
                </p>
              </div>

              <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-green-600 font-medium mb-1">
                  Total Savings
                </p>
                <p className="text-2xl font-bold text-green-700">
                  {formatCurrency(results.costSaving)}
                </p>
                <Badge variant="secondary" className="mt-1 bg-green-100 text-green-800">
                  {Math.round((results.costSaving / results.traditionalCost) * 100)}% saved
                </Badge>
              </div>
            </div>

            <Separator />

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
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.slider::-moz-range-thumb {
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: hsl(var(--primary));
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.innerHTML = sliderStyles;
  document.head.appendChild(styleElement);
}