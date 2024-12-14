import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, Link } from "react-router-dom";
import { useEffect } from "react";
import { VacancyForm } from "@/components/vacancy/VacancyForm";
import { vacancyFormSchema, type VacancyFormValues } from "@/components/vacancy/VacancyFormSchema";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function CreateVacancy() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const form = useForm<VacancyFormValues>({
    resolver: zodResolver(vacancyFormSchema),
    defaultValues: {
      type: "Full-time",
      applicationMethod: "platform",
      offerCandidateCommission: false,
      offerReferralCommission: false,
    },
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "Please sign in as an employer to post a job vacancy.",
        });
        navigate('/employer/signin');
        return;
      }

      const userType = session.user.user_metadata.user_type;
      if (userType !== 'employer') {
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "Only employers can post job vacancies.",
        });
        navigate('/');
        return;
      }
    };

    checkAuth();
  }, [navigate, toast]);

  const onSubmit = async (values: VacancyFormValues) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || session.user.user_metadata.user_type !== 'employer') {
        toast({
          variant: "destructive",
          title: "Error",
          description: "You must be signed in as an employer to post a job vacancy.",
        });
        navigate('/employer/signin');
        return;
      }

      const [minSalary, maxSalary] = values.salary.split("-").map(s => parseInt(s.trim()));
      const holidayDays = parseInt(values.holidayEntitlement);

      const { error } = await supabase.from('jobs').insert({
        title: values.title,
        description: values.description,
        company: session.user.user_metadata.company_name || "Unknown Company",
        location: values.location,
        salary_min: minSalary,
        salary_max: maxSalary,
        type: values.type,
        holiday_entitlement: holidayDays,
        company_benefits: values.companyBenefits,
        employer_id: session.user.id,
        candidate_commission: values.offerCandidateCommission ? 
          parseInt(values.candidateCommission?.replace(/[^0-9.-]+/g, "") || "0") : null
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
            <Link to="/employer/dashboard" className="text-black hover:text-gray-800">
              Employer Dashboard
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink className="text-black">Create New Vacancy</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-2xl font-bold mb-4 text-left text-black">Create New Vacancy</h1>
      <p className="text-[#ea384c] mb-8 text-left text-sm">
        Unlike traditional job boards, 
        we function as a sophisticated recruitment platform that intelligently matches candidates 
        to your vacancy based on multiple criteria including job titles, experience levels, technical skills, 
        salary expectations, and location preferences. Attract top talent by offering a "You're Hired" bonus 
        that incentivises candidates and sets your opportunity apart from standard job listings.
      </p>
      <VacancyForm form={form} onSubmit={onSubmit} />
    </div>
  );
}