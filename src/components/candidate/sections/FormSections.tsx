
import { Control } from "react-hook-form";
import { CandidateFormValues } from "../candidateFormSchema";
import ContactInformation from "./ContactInformation";
import WorkAreaField from "@/components/WorkAreaField";
import SalaryRangeField from "@/components/SalaryRangeField";
import AvailabilityField from "@/components/AvailabilityField";
import WorkPreferencesField from "@/components/WorkPreferencesField";
import JobSeekingMotivation from "./JobSeekingMotivation";
import SkillsSection from "./SkillsSection";
import WorkEligibilityField from "@/components/job-details/WorkEligibilityField";
import CommissionPreferences from "./CommissionPreferences";
import IndustryProfileSection from "./IndustryProfileSection";
import ContactPreferencesSection from "./ContactPreferencesSection";
import EducationSection from "./EducationSection";
import SkillsExperienceSection from "./SkillsExperienceSection";

interface FormSectionsProps {
  control: Control<CandidateFormValues>;
}

const FormSections = ({ control }: FormSectionsProps) => {
  return (
    <div className="space-y-8">
      <div className="text-left">
        <ContactInformation control={control} />
      </div>
      <div className="text-left">
        <WorkAreaField control={control} />
      </div>
      <div className="text-left">
        <SalaryRangeField control={control} />
      </div>
      <div className="text-left">
        <AvailabilityField control={control} />
      </div>
      <div className="text-left">
        <WorkPreferencesField control={control} />
      </div>
      <div className="text-left">
        <JobSeekingMotivation control={control} />
      </div>
      <div className="text-left">
        <SkillsSection control={control} />
      </div>
      <div className="text-left">
        <SkillsExperienceSection control={control} />
      </div>
      <div className="text-left">
        <IndustryProfileSection control={control} />
      </div>
      <div className="text-left">
        <EducationSection control={control} />
      </div>
      <div className="text-left">
        <ContactPreferencesSection control={control} />
      </div>
      <div className="text-left">
        <WorkEligibilityField control={control} />
      </div>
      <div className="text-left">
        <CommissionPreferences control={control} />
      </div>
    </div>
  );
};

export default FormSections;
