-- Add status tracking columns to webby_interests table
ALTER TABLE webby_interests 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'matched' 
CHECK (status IN (
  'matched',
  'employer_interested',
  'candidate_viewed',
  'candidate_interested_anon',
  'chatting',
  'declined'
));

ALTER TABLE webby_interests ADD COLUMN IF NOT EXISTS candidate_viewed_at TIMESTAMPTZ;
ALTER TABLE webby_interests ADD COLUMN IF NOT EXISTS employer_viewed_at TIMESTAMPTZ;
ALTER TABLE webby_interests ADD COLUMN IF NOT EXISTS declined_by TEXT;
ALTER TABLE webby_interests ADD COLUMN IF NOT EXISTS candidate_first_name TEXT;

-- Enable real-time updates for webby_interests
ALTER TABLE webby_interests REPLICA IDENTITY FULL;

-- Add webby_interests to realtime publication
DO $$
BEGIN
  -- Check if table is already in publication
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND tablename = 'webby_interests'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE webby_interests;
  END IF;
END $$;