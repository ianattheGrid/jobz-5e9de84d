-- Add company email and phone fields to employer_profiles table
ALTER TABLE public.employer_profiles 
ADD COLUMN company_email TEXT,
ADD COLUMN company_phone TEXT;