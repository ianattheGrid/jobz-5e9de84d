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
      showCompanyName: true,
      type: "Full-time",
      applicationMethod: "platform",
      offerCandidateCommission: false,
      offerReferralCommission: false,
      matchThreshold: 60,
      titleEssential: false,
      yearsExperienceEssential: false,
      minYearsExperience: 0,
      salaryEssential: false,
      skillsEssential: false,
      qualificationEssential: false,
      citizenshipEssential: false,
      requiredCitizenship: "UK citizens only",
      requireLocationRadius: false,
      workArea: "",
      specialization: "",
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

      // Fetch employer profile to pre-populate office postcode
      try {
        const { data: employerProfile } = await supabase
          .from('employer_profiles')
          .select('company_postcode')
          .eq('id', session.user.id)
          .single();

        if (employerProfile?.company_postcode) {
          form.setValue('officePostcode', employerProfile.company_postcode);
        }
      } catch (error) {
        console.log('No employer profile found or error fetching postcode');
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
        company: values.showCompanyName 
          ? (session.user.user_metadata.company_name || "Unknown Company")
          : "Anonymous Company",
        location: values.location,
        salary_min: minSalary,
        salary_max: maxSalary,
        type: values.type,
        holiday_entitlement: holidayDays,
        company_benefits: values.companyBenefits,
        employer_id: session.user.id,
        candidate_commission: values.offerCandidateCommission ? 
          parseInt(values.candidateCommission?.replace(/[^0-9.-]+/g, "") || "0") : null,
        title_essential: values.titleEssential,
        years_experience_essential: values.yearsExperienceEssential,
        min_years_experience: values.minYearsExperience,
        salary_essential: values.salaryEssential,
        skills_essential: values.skillsEssential,
        qualification_essential: values.qualificationEssential,
        citizenship_essential: values.citizenshipEssential,
        required_citizenship: values.requiredCitizenship,
        work_area: values.workArea || "Other",
        specialization: values.specialization || "Other",
        match_threshold: values.matchThreshold,
        required_skills: [],
        required_qualifications: [],
        require_location_radius: values.requireLocationRadius,
        office_postcode: values.requireLocationRadius ? values.officePostcode : null,
        location_radius: values.requireLocationRadius ? values.locationRadius : null
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
    <div className="container max-w-4xl mx-auto py-10">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link to="/employer/dashboard" className="text-gray-600 hover:text-gray-800">
              Employer Dashboard
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink className="text-gray-900">Create New Vacancy</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <VacancyForm form={form} onSubmit={onSubmit} />
    </div>
  );
}
