-- Add location radius fields to jobs table
ALTER TABLE jobs 
ADD COLUMN require_location_radius BOOLEAN DEFAULT FALSE,
ADD COLUMN office_postcode TEXT,
ADD COLUMN location_radius INTEGER;