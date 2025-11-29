-- Track who's currently online on Webby
CREATE TABLE IF NOT EXISTS webby_presence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL UNIQUE,
  user_type TEXT NOT NULL,
  last_seen TIMESTAMPTZ DEFAULT NOW(),
  is_online BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE webby_presence ENABLE ROW LEVEL SECURITY;

-- Users can view all presence data
CREATE POLICY "Anyone can view presence data" ON webby_presence
  FOR SELECT USING (true);

-- Users can update their own presence
CREATE POLICY "Users can update own presence" ON webby_presence
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can insert their own presence
CREATE POLICY "Users can insert own presence" ON webby_presence
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Mutual matches (both expressed interest)
CREATE TABLE IF NOT EXISTS webby_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID REFERENCES auth.users NOT NULL,
  employer_id UUID REFERENCES auth.users NOT NULL,
  job_id INTEGER,
  matched_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(candidate_id, employer_id)
);

-- Enable RLS
ALTER TABLE webby_matches ENABLE ROW LEVEL SECURITY;

-- Users can view their own matches
CREATE POLICY "Users can view own matches" ON webby_matches
  FOR SELECT USING (auth.uid() = candidate_id OR auth.uid() = employer_id);

-- Enable realtime for presence table
ALTER PUBLICATION supabase_realtime ADD TABLE webby_presence;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_webby_presence_user_id ON webby_presence(user_id);
CREATE INDEX IF NOT EXISTS idx_webby_presence_online ON webby_presence(is_online) WHERE is_online = true;
CREATE INDEX IF NOT EXISTS idx_webby_matches_candidate ON webby_matches(candidate_id);
CREATE INDEX IF NOT EXISTS idx_webby_matches_employer ON webby_matches(employer_id);