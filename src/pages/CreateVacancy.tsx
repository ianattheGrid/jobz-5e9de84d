import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, Link } from "react-router-dom";
import { useEffect } from "react";
import CompanyInfoFields from "@/components/CompanyInfoFields";
import JobDetailsFields from "@/components/JobDetailsFields";
import WorkAreaField from "@/components/WorkAreaField";
import LocationField from "@/components/LocationField";
import ApplicationPreferencesField from "@/components/ApplicationPreferencesField";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Job title must be at least 2 characters.",
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

export default function CreateVacancy() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      showCompanyName: "no",
      type: "Full-time",
      applicationMethod: "platform",
    },
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/employer/signin');
        return;
      }
    };

    checkAuth();
  }, [navigate]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "You must be signed in to post a job vacancy.",
        });
        navigate('/employer/signin');
        return;
      }

      const [minSalary, maxSalary] = values.salary.split("-").map(s => parseInt(s.trim()));
      const holidayDays = parseInt(values.holidayEntitlement);

      const { error } = await supabase.from('jobs').insert({
        title: values.title,
        description: values.description,
        company: values.showCompanyName === "yes" ? values.company : "Company name hidden",
        location: values.location,
        salary_min: minSalary,
        salary_max: maxSalary,
        type: values.type,
        holiday_entitlement: holidayDays,
        company_benefits: values.companyBenefits,
        employer_id: session.user.id
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Job vacancy has been posted successfully.",
      });
      
      navigate('/employer/dashboard');
    } catch (error: any) {
      console.error('Error creating vacancy:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to post job vacancy. Please try again.",
      });
    }
  };

  return (
    <div className="container max-w-2xl mx-auto py-10">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link to="/employer/dashboard" className="text-red-800 hover:text-red-900">
              Employer Dashboard
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink className="text-red-800">Create New Job Vacancy</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-2xl font-bold mb-6 text-left text-red-800">Create New Job Vacancy</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 text-left">
          <div className="space-y-8 [&_label]:text-red-800 [&_h3]:text-red-800">
            <CompanyInfoFields control={form.control} />
            <WorkAreaField control={form.control} />
            <LocationField control={form.control} />
            <JobDetailsFields control={form.control} />
            <ApplicationPreferencesField control={form.control} />
          </div>
          <div className="flex justify-start">
            <Button type="submit" className="bg-red-800 hover:bg-red-900">Post Job Vacancy</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}