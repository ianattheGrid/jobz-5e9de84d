
export interface EmployerProfile {
  id: string;
  company_name: string;
  company_website?: string | null;
  company_logo_url?: string | null;
  profile_picture_url?: string | null;
  full_name: string;
  job_title: string;
  company_size?: number | null;
  is_sme?: boolean | null;
  company_description?: string | null;
  office_amenities?: string | null;
  nearby_amenities?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface CompanyGalleryImage {
  id: string;
  employer_id: string;
  image_url: string;
  created_at: string;
}

export interface ContractorRecruitmentFeedback {
  id: string;
  is_interested: boolean;
  user_type?: string;
  created_at: string;
}
