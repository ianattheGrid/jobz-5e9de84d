
export interface EmployerProfile {
  id: string;
  company_name: string;
  company_website?: string | null;
  company_logo_url?: string | null;
  profile_picture_url?: string | null;
  full_name: string;
  job_title: string;
}
