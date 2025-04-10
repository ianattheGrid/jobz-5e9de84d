
import React, { FC, useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Download, Calculator, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PRIMARY_COLOR_PATTERN } from "@/styles/colorPatterns";

// Define the schema
const calculatorSchema = z.object({
  dailyRate: z.string()
    .refine(val => !isNaN(Number(val)), "Daily rate must be a number")
    .transform(val => Number(val))
    .refine(val => val >= 100, "Daily rate must be at least £100")
    .refine(val => val <= 2000, "Daily rate cannot exceed £2000"),
  contractLength: z.string()
    .refine(val => !isNaN(Number(val)), "Contract length must be a number")
    .transform(val => Number(val))
    .refine(val => val >= 1, "Contract must be at least 1 week")
    .refine(val => val <= 52, "Contract cannot exceed 52 weeks"),
  feeType: z.enum(["markup", "margin"]),
  feePercentage: z.coerce.number()
    .min(1, "Percentage must be at least 1%")
    .max(50, "Percentage cannot exceed 50%"),
  contractorsCount: z.string()
    .refine(val => !isNaN(Number(val)), "Number of contractors must be a number")
    .transform(val => Number(val))
    .refine(val => val >= 1, "Must have at least 1 contractor")
    .refine(val => val <= 100, "Cannot exceed 100 contractors"),
});

// Form input values type
interface FormInputValues {
  dailyRate: string;
  contractLength: string;
  feeType: "markup" | "margin";
  feePercentage: number;
  contractorsCount: string;
}

// Transformed values after validation
type CalculatorValues = z.infer<typeof calculatorSchema>;

export const CostSavingCalculator: FC = () => {
  const [results, setResults] = useState({
    totalCostWithAgency: 0,
    totalCostWithUs: 0,
    costSavings: 0,
    totalSavings: 0,
    workingDays: 0,
    months: 0,
  });

  const form = useForm<FormInputValues>({
    resolver: zodResolver(calculatorSchema),
    defaultValues: {
      dailyRate: "500",
      contractLength: "12",
      feeType: "markup",
      feePercentage: 20,
      contractorsCount: "1",
    },
  });

  const formValues = form.watch();

  useEffect(() => {
    calculateResults(formValues);
  }, [formValues]);

  const calculateResults = (values: FormInputValues) => {
    // Convert string inputs to numbers
    const dailyRate = Number(values.dailyRate) || 0;
    const contractLength = Number(values.contractLength) || 0;
    const feePercentage = values.feePercentage;
    const contractorsCount = Number(values.contractorsCount) || 1;
    const { feeType } = values;
    
    // Calculate working days (average 4 weeks per month, 5 days per week)
    // Maximum 52 weeks per year
    const daysPerWeek = 5;
    const workingDays = Math.min(contractLength, 52) * daysPerWeek;
    
    // Calculate months for our platform fee
    const months = Math.ceil(Math.min(contractLength, 52) / 4);
    
    // Calculate agency cost
    let totalCostWithAgency = 0;
    
    if (feeType === "markup") {
      // Markup: Add percentage to daily rate
      const rateWithMarkup = dailyRate + (dailyRate * (feePercentage / 100));
      totalCostWithAgency = rateWithMarkup * workingDays;
    } else {
      // Margin: Calculate from margin percentage
      totalCostWithAgency = (dailyRate / (1 - (feePercentage / 100))) * workingDays;
    }
    
    // Our platform cost has two components:
    // 1. Contractor's daily rate paid directly to contractor
    const contractorCost = dailyRate * workingDays;
    // 2. Fixed platform fee of £100 per month
    const platformFee = 100 * months;
    const totalCostWithUs = contractorCost + platformFee;
    
    // Calculate savings
    const costSavings = totalCostWithAgency - totalCostWithUs;
    const totalSavings = costSavings * contractorsCount;
    
    setResults({
      totalCostWithAgency,
      totalCostWithUs,
      costSavings,
      totalSavings,
      workingDays,
      months,
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', { 
      style: 'currency', 
      currency: 'GBP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2 
    }).format(amount);
  };

  const onSubmit = (data: FormInputValues) => {
    calculateResults(data);
  };

  const exportCSV = () => {
    const csvRows = [];
    const headers = ["Metric", "Value"];
    csvRows.push(headers.join(","));

    csvRows.push(["Daily Rate", formValues.dailyRate]);
    csvRows.push(["Contract Length (weeks)", formValues.contractLength]);
    csvRows.push(["Fee Type", formValues.feeType]);
    csvRows.push(["Fee Percentage", formValues.feePercentage.toString()]);
    csvRows.push(["Number of Contractors", formValues.contractorsCount]);
    csvRows.push(["Total Cost with Agency", formatCurrency(results.totalCostWithAgency)]);
    csvRows.push(["Total Cost with Us", formatCurrency(results.totalCostWithUs)]);
    csvRows.push(["Cost Savings per Contractor", formatCurrency(results.costSavings)]);
    csvRows.push(["Total Savings", formatCurrency(results.totalSavings)]);
    csvRows.push(["Working Days", results.workingDays.toString()]);
    csvRows.push(["Contract Length (months)", results.months.toString()]);

    const csvData = csvRows.join("\n");
    const blob = new Blob([csvData], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", "cost_savings_calculator_results.csv");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="shadow-lg p-6 md:p-8 border-t-4 border-t-[#FF69B4]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="dailyRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Contractor Daily Rate (£)
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="inline-block h-4 w-4 ml-1 align-top" />
                          </TooltipTrigger>
                          <TooltipContent>
                            Enter the average daily rate for your contractors.
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 500" {...field} />
                    </FormControl>
                    <FormDescription>
                      The average daily rate you pay to your contractors.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contractLength"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Contract Length (weeks)
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="inline-block h-4 w-4 ml-1 align-top" />
                          </TooltipTrigger>
                          <TooltipContent>
                            The average contract length for your contractors.
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 12" {...field} />
                    </FormControl>
                    <FormDescription>
                      The average contract length for your contractors in weeks.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="feeType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Agency Fee Type</FormLabel>
                    <FormControl>
                      <select
                        className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        {...field}
                      >
                        <option value="markup">Markup</option>
                        <option value="margin">Margin</option>
                      </select>
                    </FormControl>
                    <FormDescription>
                      Choose the fee type charged by your agency.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="feePercentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Agency Fee (%)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 20" type="number" {...field} />
                    </FormControl>
                    <FormDescription>
                      The percentage fee charged by your agency.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="contractorsCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Contractors</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 1" {...field} />
                  </FormControl>
                  <FormDescription>
                    The number of contractors you are recruiting for.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              <Calculator className="mr-2 h-4 w-4" />
              Calculate Savings
            </Button>
          </form>
        </Form>

        <div className="mt-8 space-y-4">
          <h3 className={`text-xl font-semibold ${PRIMARY_COLOR_PATTERN}`}>
            Results
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-muted/50">
              <div className="p-4">
                <h4 className="text-sm font-bold mb-2">
                  Total Cost with Agency
                </h4>
                <p className="text-2xl font-bold">
                  {formatCurrency(results.totalCostWithAgency)}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {formValues.feeType === "markup" 
                    ? `(${formatCurrency(Number(formValues.dailyRate))} + ${formValues.feePercentage}% markup) × ${results.workingDays} working days` 
                    : `${formatCurrency(Number(formValues.dailyRate))} ÷ (1-${formValues.feePercentage}%) × ${results.workingDays} working days`}
                </p>
                <p className="text-xs text-muted-foreground">
                  Based on {Math.min(Number(formValues.contractLength), 52)} weeks at {formValues.feeType === "markup" ? "markup" : "margin"} rate
                </p>
              </div>
            </Card>

            <Card className="bg-muted/50">
              <div className="p-4">
                <h4 className="text-sm font-bold mb-2">Total Cost with Us</h4>
                <p className="text-2xl font-bold">
                  {formatCurrency(results.totalCostWithUs)}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Contractor cost ({formatCurrency(Number(formValues.dailyRate))} × {results.workingDays} working days) + 
                  Platform fee (£100 × {results.months} months)
                </p>
                <p className="text-xs text-muted-foreground">
                  Based on direct payment to contractor plus our £100 monthly fee
                </p>
              </div>
            </Card>
          </div>

          <Card className="bg-green-100 dark:bg-green-900">
            <div className="p-4">
              <h4 className="text-sm font-bold mb-2">Cost Savings per Contractor</h4>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {formatCurrency(results.costSavings)}
              </p>
            </div>
          </Card>

          <Card className="bg-green-100 dark:bg-green-900">
            <div className="p-4">
              <h4 className="text-sm font-bold mb-2">Total Savings</h4>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {formatCurrency(results.totalSavings)}
              </p>
              <p className="text-xs text-green-700 dark:text-green-300 mt-2">
                Savings per contractor × {formValues.contractorsCount} contractor{Number(formValues.contractorsCount) > 1 ? 's' : ''}
              </p>
            </div>
          </Card>

          <div className="flex justify-end">
            <Button variant="secondary" onClick={exportCSV}>
              <Download className="mr-2 h-4 w-4" />
              Export to CSV
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
