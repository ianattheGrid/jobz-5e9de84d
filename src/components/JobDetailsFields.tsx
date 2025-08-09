
import { Control } from "react-hook-form";
import SalaryFields from "./job-details/SalaryFields";
import WorkLocationFields from "./job-details/WorkLocationFields";

interface JobDetailsFieldsProps {
  control: Control<any>;
}

const JobDetailsFields = ({ control }: JobDetailsFieldsProps) => {
  return (
    <div className="space-y-4">
      {/* Salary and basic location filters only for candidate job search */}
      <SalaryFields control={control} />
      <WorkLocationFields control={control} />
    </div>
  );
};

export default JobDetailsFields;
