import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import CommissionSection from "@/components/CommissionSection";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import LocationField from "@/components/LocationField";
import JobDetailsFields from "@/components/JobDetailsFields";
import WorkAreaField from "@/components/WorkAreaField";
import ApplicationPreferencesField from "@/components/ApplicationPreferencesField";
import CompanyInfoFields from "@/components/CompanyInfoFields";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Job title must be at least 2 characters.",
  }),
  yearsExperience: z.string({
    required_error: "Please select required years of experience in that job title.",
  }),
  workArea: z.string({
    required_error: "Please select the area of work for this vacancy.",
  }),
  otherWorkArea: z.string().optional(),
  showCompanyName: z.enum(["yes", "no"]),
  company: z.string().min(2, {
    message: "Company name must be at least 2 characters.",
  }).optional(),
  location: z.string().min(2, {
    message: "Location must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Job description must be at least 10 characters.",
  }),
  salary: z.string().min(1, {
    message: "Salary is required",
  }),
  actualSalary: z.string().min(1, {
    message: "Actual salary is required",
  }),
  workLocation: z.enum(["office", "hybrid", "remote"]).default("office"),
  officePercentage: z.number().min(0).max(100).optional(),
  type: z.literal("Full-time"),
  offerCandidateCommission: z.boolean().default(false),
  candidateCommission: z.string().optional(),
  offerReferralCommission: z.boolean().default(false),
  referralCommission: z.string().optional(),
  holidayEntitlement: z.string().min(1, {
    message: "Holiday entitlement is required",
  }),
  companyBenefits: z.string().min(1, {
    message: "Company benefits are required",
  }),
  otherBenefits: z.string().optional(),
  applicationMethod: z.enum(["platform", "email", "custom"]).default("platform"),
  applicationEmail: z.string().email().optional().or(z.literal("")),
  applicationInstructions: z.string().optional().or(z.literal("")),
});

export default function CandidateSearch() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      offerCandidateCommission: false,
      offerReferralCommission: false,
      showCompanyName: "no",
      type: "Full-time",
      applicationMethod: "platform",
    },
  });

  const showCompanyName = form.watch("showCompanyName");

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    toast({
      title: "Job Posted Successfully",
      description: "Your job listing has been created.",
    });
  };

  return (
    <div className="container max-w-2xl mx-auto py-10">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Title</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Senior React Developer" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="yearsExperience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minimum Years of Experience Required in that Job Title</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select required experience" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {[...Array(19)].map((_, i) => (
                      <SelectItem key={i + 1} value={String(i + 1)}>
                        {i + 1} {i === 0 ? 'year' : 'years'}
                      </SelectItem>
                    ))}
                    <SelectItem value="20+">20+ years</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <WorkAreaField control={form.control} />

          <CompanyInfoFields control={form.control} />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Type</FormLabel>
                <FormControl>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue="Full-time"
                    value="Full-time"
                  >
                    <SelectTrigger>
                      <SelectValue>Full-time</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full-time">Full-time</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <LocationField control={form.control} />
          
          <JobDetailsFields control={form.control} />

          <CommissionSection 
            salary={form.watch("salary")} 
            form={form}
          />

          <ApplicationPreferencesField control={form.control} />
          
          <Button type="submit">Post Job</Button>
        </form>
      </Form>
    </div>
  );
}
