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
      <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border border-pink-500/30 shadow-2xl">
        <CardHeader className="text-center bg-gradient-to-r from-slate-800/90 to-slate-900/90 rounded-t-lg p-8 border-b border-pink-500/20">
          <CardTitle className="flex items-center justify-center gap-3 text-4xl font-bold text-white">
            <Calculator className="h-8 w-8 text-pink-500" />
            <span className="text-white">Employee Recruitment Cost Calculator</span>
          </CardTitle>
          <p className="text-white text-lg font-semibold mt-4 max-w-2xl mx-auto">
            Calculate how much you could save using jobz for employee recruitment
          </p>
        </CardHeader>
        <CardContent className="space-y-8 p-8 bg-gradient-to-br from-slate-800 to-slate-900">
          {/* Salary Input */}
          <div className="space-y-3">
            <Label htmlFor="salary" className="text-xl font-bold text-white">Annual Salary (£)</Label>
            <Input
              id="salary"
              type="text"
              value={salary}
              onChange={handleSalaryChange}
              placeholder="35,000"
              className="text-lg h-12 bg-slate-700/50 border-pink-500/30 text-white placeholder:text-slate-400 focus:border-pink-500"
            />
          </div>

          {/* Recruitment Type Selection */}
          <div className="space-y-3">
            <Label className="text-xl font-bold text-white">Current Recruitment Method</Label>
            <Select value={recruitmentType} onValueChange={(value: 'agency' | 'direct') => setRecruitmentType(value)}>
              <SelectTrigger className="h-12 bg-slate-700/50 border-pink-500/30 text-white focus:border-pink-500">
                <SelectValue placeholder="Select your current recruitment method" className="text-slate-400" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-pink-500/30">
                <SelectItem value="agency" className="text-white hover:bg-slate-700">Recruitment Agency</SelectItem>
                <SelectItem value="direct" className="text-white hover:bg-slate-700">Direct Hire</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Agency Fee Percentage (only shown for agency) */}
          {recruitmentType === 'agency' && (
            <div className="space-y-4 p-6 bg-slate-700/30 rounded-xl border border-pink-500/30">
              <Label className="text-lg font-bold text-white">Agency Fee Percentage: <span className="text-pink-400">{feePercentage}%</span></Label>
              <div className="px-4">
                <input
                  type="range"
                  min="15"
                  max="30"
                  step="1"
                  value={feePercentage}
                  onChange={(e) => setFeePercentage(parseInt(e.target.value))}
                  className="w-full h-3 bg-slate-600 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #ec4899 0%, #ec4899 ${((feePercentage - 15) / 15) * 100}%, #475569 ${((feePercentage - 15) / 15) * 100}%, #475569 100%)`
                  }}
                />
                <div className="flex justify-between text-sm font-medium text-pink-400 mt-2">
                  <span>15%</span>
                  <span>30%</span>
                </div>
              </div>
            </div>
          )}

          {/* Direct Hire Cost Display */}
          {recruitmentType === 'direct' && (
            <div className="p-6 bg-slate-700/30 rounded-xl border border-pink-500/30">
              <div className="flex items-center gap-2 mb-3">
                <PoundSterling className="h-5 w-5 text-pink-500" />
                <span className="font-bold text-white text-lg">CIPD Average Cost Per Hire</span>
              </div>
              <p className="text-3xl font-bold text-pink-400 mb-2">{formatCurrency(6125)}</p>
              <p className="text-sm text-white font-semibold">
                According to the Chartered Institute of Personnel and Development
              </p>
            </div>
          )}

          {/* Months Selection */}
          <div className="space-y-4 p-6 bg-slate-700/30 rounded-xl border border-pink-500/30">
            <Label className="text-xl font-bold text-white">Months using jobz: <span className="text-pink-400 font-bold">{months} month{months !== 1 ? "s" : ""}</span></Label>
            <div className="px-4">
              <input
                type="range"
                min="1"
                max="12"
                step="1"
                value={months}
                onChange={(e) => setMonths(parseInt(e.target.value))}
                className="w-full h-3 bg-slate-600 rounded-lg appearance-none cursor-pointer slider-purple"
                style={{
                  background: `linear-gradient(to right, #ec4899 0%, #ec4899 ${((months - 1) / 11) * 100}%, #475569 ${((months - 1) / 11) * 100}%, #475569 100%)`
                }}
              />
              <div className="flex justify-between text-sm font-medium text-pink-400 mt-2">
                <span>1 month</span>
                <span>12 months</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Card */}
      {results && recruitmentType && (
        <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border border-pink-500/30 shadow-2xl">
          <CardHeader className="bg-gradient-to-r from-slate-800/90 to-slate-900/90 rounded-t-lg p-6 border-b border-pink-500/20">
            <CardTitle className="flex items-center gap-3 text-3xl font-bold text-white">
              <TrendingDown className="h-6 w-6 text-pink-500" />
              <span className="text-white">Your Cost Savings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-8 bg-gradient-to-br from-slate-800 to-slate-900">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-slate-700/30 rounded-xl border border-red-500/30 shadow-lg">
                <p className="text-sm text-red-400 font-semibold mb-2">
                  {recruitmentType === 'agency' ? 'Agency Cost' : 'Direct Hire Cost'}
                </p>
                <p className="text-3xl font-bold text-red-300 mb-2">
                  {formatCurrency(results.traditionalCost)}
                </p>
                {recruitmentType === 'agency' && (
                  <p className="text-xs text-red-400/80">
                    {feePercentage}% of £{salary}
                  </p>
                )}
              </div>

              <div className="text-center p-6 bg-slate-700/30 rounded-xl border border-blue-500/30 shadow-lg">
                 <p className="text-sm text-blue-400 font-semibold mb-2">
                   jobz Cost ({months} month{months !== 1 ? 's' : ''})
                 </p>
                <p className="text-3xl font-bold text-blue-300 mb-2">
                  {formatCurrency(results.jobzCost)}
                </p>
                <p className="text-xs text-blue-400/80">
                  £9 per month
                </p>
              </div>

              <div className="text-center p-6 bg-slate-700/30 rounded-xl border border-green-500/30 shadow-lg">
                <p className="text-sm text-green-400 font-semibold mb-2">
                  Total Savings
                </p>
                <p className="text-3xl font-bold text-green-300 mb-3">
                  {formatCurrency(results.costSaving)}
                </p>
                <Badge className="bg-gradient-to-r from-pink-500 to-pink-600 text-white font-semibold shadow-sm">
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

.slider-purple::-webkit-slider-thumb {
  appearance: none;
  height: 24px;
  width: 24px;
  border-radius: 50%;
  background: #a855f7;
  cursor: pointer;
  border: 3px solid white;
  box-shadow: 0 4px 12px rgba(168, 85, 247, 0.3);
}

.slider-purple::-moz-range-thumb {
  height: 24px;
  width: 24px;
  border-radius: 50%;
  background: #a855f7;
  cursor: pointer;
  border: 3px solid white;
  box-shadow: 0 4px 12px rgba(168, 85, 247, 0.3);
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