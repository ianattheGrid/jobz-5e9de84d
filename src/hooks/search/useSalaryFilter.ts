
import { CandidateProfile } from "@/integrations/supabase/types/profiles";

export const useSalaryFilter = () => {
  const getFlexibleSalaryRange = (minSalary: number, maxSalary: number) => {
    const flexibleMinSalary = minSalary - 5000;
    const flexibleMaxSalary = maxSalary + 5000;
    return { flexibleMinSalary, flexibleMaxSalary };
  };

  const buildSalaryQuery = (query: any, minSalary: number, maxSalary: number) => {
    const { flexibleMinSalary, flexibleMaxSalary } = getFlexibleSalaryRange(minSalary, maxSalary);
    return query.or(`min_salary.lte.${flexibleMaxSalary},max_salary.gte.${flexibleMinSalary}`);
  };

  return { buildSalaryQuery };
};
