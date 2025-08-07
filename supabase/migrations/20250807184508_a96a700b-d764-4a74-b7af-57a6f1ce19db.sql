-- Add new columns to interview_slots table for enhanced interview scheduling
ALTER TABLE interview_slots 
ADD COLUMN interview_type TEXT DEFAULT 'phone' CHECK (interview_type IN ('phone', 'video', 'in_person', 'assessment')),
ADD COLUMN interview_stage INTEGER DEFAULT 1 CHECK (interview_stage >= 1 AND interview_stage <= 3),
ADD COLUMN duration_minutes INTEGER DEFAULT 60,
ADD COLUMN duration_other TEXT,
ADD COLUMN interview_location TEXT,
ADD COLUMN interviewer_name TEXT,
ADD COLUMN employer_notes TEXT;

-- Add new columns to interviews table as well for consistency
ALTER TABLE interviews
ADD COLUMN interview_type TEXT DEFAULT 'phone' CHECK (interview_type IN ('phone', 'video', 'in_person', 'assessment')),
ADD COLUMN interview_stage INTEGER DEFAULT 1 CHECK (interview_stage >= 1 AND interview_stage <= 3),
ADD COLUMN duration_minutes INTEGER DEFAULT 60,
ADD COLUMN duration_other TEXT,
ADD COLUMN interview_location TEXT;