-- Enable RLS on employer_names table 
ALTER TABLE employer_names ENABLE ROW LEVEL SECURITY;

-- Create policy for reading employer names (this is reference data, should be readable by all)
CREATE POLICY "Anyone can read employer names" ON employer_names
FOR SELECT USING (true);