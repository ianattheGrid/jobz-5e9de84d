import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Control } from "react-hook-form";
import { MultiSelect } from "@/components/ui/multi-select";
import { useCertifications } from "@/hooks/useCertifications";
import CertificationSuggestionForm from "@/components/certifications/CertificationSuggestionForm";

interface CertificationsFieldProps {
  control: Control<any>;
  workArea?: string;
  specialization?: string;
}

const CertificationsField = ({ control, workArea, specialization }: CertificationsFieldProps) => {
  const { certifications, loading, refetch } = useCertifications(workArea, specialization);

  // Get both work-area specific and generic certifications
  const allCertifications = [
    ...certifications.filter(cert => cert.work_area === workArea || cert.work_area === 'Generic'),
  ];

  return (
    <FormField
      control={control}
      name="required_qualifications"
      render={({ field }) => (
        <FormItem>
          <div className="flex items-center justify-between">
            <FormLabel>Professional Certifications & Qualifications (Select up to 10)</FormLabel>
            <CertificationSuggestionForm 
              workArea={workArea || "IT"} 
              specialization={specialization}
              onSuggestionSubmitted={refetch}
            />
          </div>
          <FormControl>
            <MultiSelect
              options={allCertifications.map(cert => ({ 
                label: cert.certification_name, 
                value: cert.certification_name 
              }))}
              selected={field.value || []}
              onChange={(values) => {
                if (values.length <= 10) {
                  field.onChange(values);
                }
              }}
              placeholder={loading ? "Loading certifications..." : "Select required certifications..."}
            />
          </FormControl>
          {field.value?.length >= 10 && (
            <p className="text-sm text-muted-foreground mt-1">
              Maximum of 10 certifications reached
            </p>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CertificationsField;