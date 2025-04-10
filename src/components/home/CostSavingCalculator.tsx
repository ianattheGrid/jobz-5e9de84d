
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Download, Calculator, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PRIMARY_COLOR_PATTERN } from "@/styles/colorPatterns";

// Define the form schema with zod
const calculatorSchema = z.object({
  dailyRate: z.coerce.number().min(100, "Daily rate must be at least £100").max(2000, "Daily rate cannot exceed £2000"),
  contractLength: z.coerce.number().min(1, "Contract must be at least 1 week").max(52, "Contract cannot exceed 52 weeks"),
  feeType: z.enum(["markup", "margin"]),
  feePercentage: z.coerce.number().min(1, "Percentage must be at least 1%").max(50, "Percentage cannot exceed 50%"),
  contractorsCount: z.coerce.number().min(1, "Must have at least 1 contractor").max(100, "Cannot exceed 100 contractors").default(1),
});

type CalculatorFormValues = z.infer<typeof calculatorSchema>;

export const CostSavingCalculator = () => {
  const [results, setResults] = useState({
    totalCostWithAgency: 0,
    totalCostWithUs: 0,
    costSavings: 0,
    totalSavings: 0,
    workingDays: 0,
    months: 0,
  });

  // Initialize the form
  const form = useForm<CalculatorFormValues>({
    resolver: zodResolver(calculatorSchema),
    defaultValues: {
      dailyRate: 500,
      contractLength: 12,
      feeType: "markup",
      feePercentage: 20,
      contractorsCount: 1,
    },
  });

  // Get form values
  const formValues = form.watch();

  // Calculate results whenever form values change
  useEffect(() => {
    calculateResults(formValues);
  }, [formValues]);

  // Calculate all results based on form inputs
  const calculateResults = (values: CalculatorFormValues) => {
    const { dailyRate, contractLength, feeType, feePercentage, contractorsCount } = values;
    
    // Calculate working days (5 days per week)
    const workingDays = contractLength * 5;
    
    // Calculate months (round up to nearest month)
    const months = Math.ceil(contractLength / 4.33);
    
    let totalCostWithAgency = 0;
    
    // Calculate cost with agency based on fee type
    if (feeType === "markup") {
      // Markup calculation: (Daily Rate + (Daily Rate × Markup Percentage)) × Total Working Days
      totalCostWithAgency = (dailyRate + (dailyRate * (feePercentage / 100))) * workingDays;
    } else {
      // Margin calculation: (Daily Rate / (1 - Margin Percentage)) × Total Working Days
      totalCostWithAgency = (dailyRate / (1 - (feePercentage / 100))) * workingDays;
    }
    
    // Calculate cost with our platform: (Daily Rate × Total Working Days) + (£100 × Number of Months)
    const totalCostWithUs = (dailyRate * workingDays) + (100 * months);
    
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

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', { 
      style: 'currency', 
      currency: 'GBP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2 
    }).format(amount);
  };

  // Handle form submission
  const onSubmit = (data: CalculatorFormValues) => {
    calculateResults(data);
  };

  // Export results as CSV
  const exportCSV = () => {
    const { totalCostWithAgency, totalCostWithUs, costSavings, totalSavings, workingDays, months } = results;
    const { dailyRate, contractLength, feeType, feePercentage, contractorsCount } = form.getValues();
    
    const csvContent = [
      'Cost Saving Calculator Results',
      '',
      'Inputs:',
      `Daily Rate,${formatCurrency(dailyRate)}`,
      `Contract Length,${contractLength} weeks (${workingDays} working days)`,
      `Agency Fee Type,${feeType.charAt(0).toUpperCase() + feeType.slice(1)}`,
      `${feeType.charAt(0).toUpperCase() + feeType.slice(1)} Percentage,${feePercentage}%`,
      `Number of Contractors,${contractorsCount}`,
      '',
      'Results:',
      `Total Cost with Agency,${formatCurrency(totalCostWithAgency)}`,
      `Total Cost with Platform,${formatCurrency(totalCostWithUs)}`,
      `Cost Savings per Contractor,${formatCurrency(costSavings)}`,
      `Total Savings for ${contractorsCount} Contractors,${formatCurrency(totalSavings)}`,
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'contractor-savings-calculation.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="shadow-lg p-6 md:p-8 border-t-4 border-t-[#FF69B4]">
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
          <Calculator className="h-10 w-10 text-[#FF69B4]" />
          <div>
            <h2 className={`text-2xl font-bold ${PRIMARY_COLOR_PATTERN}`}>Cost Saving Calculator</h2>
            <p className="text-muted-foreground">
              See how much you could save with our fixed-fee service compared to traditional recruiters
            </p>
          </div>
        </div>

        <Tabs defaultValue="employer" className="w-full mb-6">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="employer">For Employers</TabsTrigger>
            <TabsTrigger value="contractor">For Contractors</TabsTrigger>
          </TabsList>
          <TabsContent value="employer" className="space-y-4">
            <p>
              Calculate how much your business can save by using our fixed-fee service 
              (£100 per month) instead of traditional recruitment agencies that charge 
              percentage-based fees.
            </p>
          </TabsContent>
          <TabsContent value="contractor" className="space-y-4">
            <p>
              Help your clients understand how much they can save by hiring you through 
              our platform, making you more attractive as a contractor.
            </p>
          </TabsContent>
        </Tabs>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Daily Rate */}
              <FormField
                control={form.control}
                name="dailyRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      Contractor's Daily Rate
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 ml-2 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="w-[200px]">Enter the daily rate paid to the contractor</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5">£</span>
                        <Input 
                          type="number" 
                          className="pl-7" 
                          {...field} 
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Contract Length */}
              <FormField
                control={form.control}
                name="contractLength"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      Contract Length (Weeks)
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 ml-2 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="w-[200px]">Duration of the contract in weeks (up to 52 weeks)</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        <Input 
                          type="number" 
                          {...field} 
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                        <p className="text-sm text-muted-foreground">
                          {results.workingDays} working days • {results.months} months
                        </p>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Fee Type */}
              <FormField
                control={form.control}
                name="feeType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      Agency Fee Type
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 ml-2 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="w-[250px] space-y-2">
                              <p><strong>Markup:</strong> A percentage added to the contractor's rate.</p>
                              <p><strong>Margin:</strong> A percentage of the total charge rate.</p>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </FormLabel>
                    <FormControl>
                      <div className="flex gap-4">
                        <Button
                          type="button"
                          variant={field.value === "markup" ? "default" : "outline"}
                          className={field.value === "markup" ? "bg-[#FF69B4] hover:bg-[#FF50A8]" : ""}
                          onClick={() => form.setValue("feeType", "markup")}
                        >
                          Markup
                        </Button>
                        <Button
                          type="button"
                          variant={field.value === "margin" ? "default" : "outline"}
                          className={field.value === "margin" ? "bg-[#FF69B4] hover:bg-[#FF50A8]" : ""}
                          onClick={() => form.setValue("feeType", "margin")}
                        >
                          Margin
                        </Button>
                      </div>
                    </FormControl>
                    <FormDescription>
                      {field.value === "markup" 
                        ? "Markup: A percentage added on top of the contractor's rate" 
                        : "Margin: A percentage of the total charge rate"}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Fee Percentage */}
              <FormField
                control={form.control}
                name="feePercentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      {form.watch("feeType") === "markup" ? "Markup" : "Margin"} Percentage
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 ml-2 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="w-[200px]">
                              The percentage the agency charges as a 
                              {form.watch("feeType") === "markup" ? " markup" : " margin"}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        <div className="flex gap-4">
                          <div className="flex-1">
                            <Slider
                              defaultValue={[field.value]}
                              max={50}
                              min={1}
                              step={1}
                              onValueChange={(vals) => field.onChange(vals[0])}
                            />
                          </div>
                          <div className="w-16 relative">
                            <Input 
                              type="number" 
                              className="pr-6" 
                              value={field.value} 
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                            <span className="absolute right-3 top-2.5">%</span>
                          </div>
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Number of Contractors */}
              <FormField
                control={form.control}
                name="contractorsCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      Number of Contractors
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 ml-2 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="w-[200px]">How many contractors are you hiring?</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Results Section */}
            <div className="mt-8 p-6 bg-muted/30 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Your Savings</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Cost with Traditional Agency:</p>
                    <p className="text-2xl font-bold">{formatCurrency(results.totalCostWithAgency)}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Cost with Our Platform:</p>
                    <p className="text-2xl font-bold">{formatCurrency(results.totalCostWithUs)}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{formatCurrency(formValues.dailyRate * results.workingDays)}</span>
                      <span>+</span>
                      <span>{formatCurrency(100 * results.months)} platform fee</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Savings per Contractor:</p>
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(results.costSavings)}</p>
                  </div>
                  
                  {formValues.contractorsCount > 1 && (
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Total Savings for {formValues.contractorsCount} Contractors:
                      </p>
                      <p className="text-2xl font-bold text-green-600">{formatCurrency(results.totalSavings)}</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
                <p className="text-center sm:text-left text-sm text-muted-foreground">
                  Save time and money by using our fixed-fee platform for contractor recruitment
                </p>
                <div className="flex gap-3">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={exportCSV}
                    className="gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                  <Button 
                    type="button"
                    className="bg-[#FF69B4] hover:bg-[#FF50A8]"
                  >
                    Sign up now to start saving!
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
};
