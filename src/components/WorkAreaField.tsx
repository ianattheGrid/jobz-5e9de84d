import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from "react-hook-form";
import { workAreas } from "./work-area/constants";
import { 
  recruitmentRoles,
  employeeRelationsRoles,
  compensationRoles,
  learningDevelopmentRoles,
  hrOperationsRoles,
  deiRoles,
  hrLeadershipRoles,
  specializedHrRoles
} from "./work-area/constants/hr-roles";
import {
  solicitorRoles,
  barristerRoles,
  legalSupportRoles,
  inHouseLegalRoles,
  legalOperationsRoles,
  alspRoles,
  complianceRoles,
  legalEducationRoles,
  specializedLegalRoles
} from "./work-area/constants/legal-roles";
import ITSpecializationSelect from "./work-area/ITSpecializationSelect";
import CustomerServiceSpecializationSelect from "./work-area/CustomerServiceSpecializationSelect";
import FinanceSpecializationSelect from "./work-area/FinanceSpecializationSelect";
import HRSpecializationSelect from "./work-area/HRSpecializationSelect";
import LegalSpecializationSelect from "./work-area/LegalSpecializationSelect";
import JobTitleSelect from "./work-area/JobTitleSelect";
import OtherWorkAreaInput from "./work-area/OtherWorkAreaInput";
import { useState } from "react";

interface WorkAreaFieldProps {
  control: Control<any>;
}

const WorkAreaField = ({ control }: WorkAreaFieldProps) => {
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [showITSpecialization, setShowITSpecialization] = useState(false);
  const [showCustomerServiceSpecialization, setShowCustomerServiceSpecialization] = useState(false);
  const [showFinanceSpecialization, setShowFinanceSpecialization] = useState(false);
  const [showHRSpecialization, setShowHRSpecialization] = useState(false);
  const [showLegalSpecialization, setShowLegalSpecialization] = useState(false);
  const [showRecruitmentRoles, setShowRecruitmentRoles] = useState(false);
  const [showEmployeeRelationsRoles, setShowEmployeeRelationsRoles] = useState(false);
  const [showCompensationRoles, setShowCompensationRoles] = useState(false);
  const [showLearningDevelopmentRoles, setShowLearningDevelopmentRoles] = useState(false);
  const [showHROperationsRoles, setShowHROperationsRoles] = useState(false);
  const [showDEIRoles, setShowDEIRoles] = useState(false);
  const [showHRLeadershipRoles, setShowHRLeadershipRoles] = useState(false);
  const [showSpecializedHRRoles, setShowSpecializedHRRoles] = useState(false);
  const [showSolicitorRoles, setShowSolicitorRoles] = useState(false);
  const [showBarristerRoles, setShowBarristerRoles] = useState(false);
  const [showLegalSupportRoles, setShowLegalSupportRoles] = useState(false);
  const [showInHouseLegalRoles, setShowInHouseLegalRoles] = useState(false);
  const [showLegalOperationsRoles, setShowLegalOperationsRoles] = useState(false);
  const [showALSPRoles, setShowALSPRoles] = useState(false);
  const [showComplianceRoles, setShowComplianceRoles] = useState(false);
  const [showLegalEducationRoles, setShowLegalEducationRoles] = useState(false);
  const [showSpecializedLegalRoles, setShowSpecializedLegalRoles] = useState(false);

  const handleHRSpecializationChange = (value: string) => {
    setShowRecruitmentRoles(value === "Recruitment and Talent Acquisition");
    setShowEmployeeRelationsRoles(value === "Employee Relations and Engagement");
    setShowCompensationRoles(value === "Compensation and Benefits");
    setShowLearningDevelopmentRoles(value === "Learning and Development");
    setShowHROperationsRoles(value === "HR Operations and Administration");
    setShowDEIRoles(value === "Diversity, Equity, and Inclusion");
    setShowHRLeadershipRoles(value === "HR Leadership");
    setShowSpecializedHRRoles(value === "Specialized HR Roles");
  };

  const handleLegalSpecializationChange = (value: string) => {
    setShowSolicitorRoles(value === "Solicitors and Legal Advisory");
    setShowBarristerRoles(value === "Barristers and Advocacy");
    setShowLegalSupportRoles(value === "Legal Support");
    setShowInHouseLegalRoles(value === "In-House Legal");
    setShowLegalOperationsRoles(value === "Legal Operations and Management");
    setShowALSPRoles(value === "Alternative Legal Service Providers (ALSPs) and New Law");
    setShowComplianceRoles(value === "Compliance, Risk, and Regulatory");
    setShowLegalEducationRoles(value === "Legal Education and Training");
    setShowSpecializedLegalRoles(value === "Specialized Legal");
  };

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="workArea"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Current Area of Work</FormLabel>
            <FormControl>
              <Select 
                onValueChange={(value) => {
                  field.onChange(value);
                  setShowOtherInput(value === "Other");
                  setShowITSpecialization(value === "IT");
                  setShowCustomerServiceSpecialization(value === "Customer Service");
                  setShowFinanceSpecialization(value === "Accounting & Finance");
                  setShowHRSpecialization(value === "Human Resources");
                  setShowLegalSpecialization(value === "Legal");
                }} 
                defaultValue={field.value}
              >
                <SelectTrigger className="w-full bg-white border border-gray-300">
                  <SelectValue placeholder="Select your current area of work" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {workAreas.map((area) => (
                    <SelectItem key={area} value={area}>
                      {area}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {showITSpecialization && (
        <ITSpecializationSelect 
          control={control}
          onSpecializationChange={() => {}}
        />
      )}

      {showCustomerServiceSpecialization && (
        <CustomerServiceSpecializationSelect 
          control={control}
          onSpecializationChange={() => {}}
        />
      )}

      {showFinanceSpecialization && (
        <FinanceSpecializationSelect
          control={control}
          onSpecializationChange={() => {}}
        />
      )}

      {showHRSpecialization && (
        <HRSpecializationSelect
          control={control}
          onSpecializationChange={handleHRSpecializationChange}
        />
      )}

      {showLegalSpecialization && (
        <LegalSpecializationSelect
          control={control}
          onSpecializationChange={handleLegalSpecializationChange}
        />
      )}

      {showRecruitmentRoles && (
        <JobTitleSelect control={control} titles={recruitmentRoles} />
      )}

      {showEmployeeRelationsRoles && (
        <JobTitleSelect control={control} titles={employeeRelationsRoles} />
      )}

      {showCompensationRoles && (
        <JobTitleSelect control={control} titles={compensationRoles} />
      )}

      {showLearningDevelopmentRoles && (
        <JobTitleSelect control={control} titles={learningDevelopmentRoles} />
      )}

      {showHROperationsRoles && (
        <JobTitleSelect control={control} titles={hrOperationsRoles} />
      )}

      {showDEIRoles && (
        <JobTitleSelect control={control} titles={deiRoles} />
      )}

      {showHRLeadershipRoles && (
        <JobTitleSelect control={control} titles={hrLeadershipRoles} />
      )}

      {showSpecializedHRRoles && (
        <JobTitleSelect control={control} titles={specializedHrRoles} />
      )}

      {showSolicitorRoles && (
        <JobTitleSelect control={control} titles={solicitorRoles} />
      )}

      {showBarristerRoles && (
        <JobTitleSelect control={control} titles={barristerRoles} />
      )}

      {showLegalSupportRoles && (
        <JobTitleSelect control={control} titles={legalSupportRoles} />
      )}

      {showInHouseLegalRoles && (
        <JobTitleSelect control={control} titles={inHouseLegalRoles} />
      )}

      {showLegalOperationsRoles && (
        <JobTitleSelect control={control} titles={legalOperationsRoles} />
      )}

      {showALSPRoles && (
        <JobTitleSelect control={control} titles={alspRoles} />
      )}

      {showComplianceRoles && (
        <JobTitleSelect control={control} titles={complianceRoles} />
      )}

      {showLegalEducationRoles && (
        <JobTitleSelect control={control} titles={legalEducationRoles} />
      )}

      {showSpecializedLegalRoles && (
        <JobTitleSelect control={control} titles={specializedLegalRoles} />
      )}

      {showOtherInput && (
        <OtherWorkAreaInput control={control} />
      )}
    </div>
  );
};

export default WorkAreaField;