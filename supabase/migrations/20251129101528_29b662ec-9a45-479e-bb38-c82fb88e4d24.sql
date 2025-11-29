-- Webby preferences (toggle and settings)
CREATE TABLE IF NOT EXISTS webby_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_type TEXT NOT NULL CHECK (user_type IN ('candidate', 'employer')),
  webby_enabled BOOLEAN DEFAULT false,
  anonymity_level TEXT DEFAULT 'semi_anonymous' CHECK (anonymity_level IN ('semi_anonymous', 'first_name_only', 'full')),
  onboarding_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, user_type)
);

-- Structured profiles created by Webby's conversational intake
CREATE TABLE IF NOT EXISTS webby_candidate_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID NOT NULL REFERENCES candidate_profiles(id) ON DELETE CASCADE UNIQUE,
  rough_location TEXT,
  location_radius_miles INTEGER,
  hours_per_week_min INTEGER,
  hours_per_week_max INTEGER,
  availability_slots JSONB DEFAULT '{}',
  min_hourly_rate DECIMAL,
  min_annual_salary DECIMAL,
  skills_tags TEXT[] DEFAULT '{}',
  industry_tags TEXT[] DEFAULT '{}',
  avoid_tags TEXT[] DEFAULT '{}',
  environment_preferences TEXT[] DEFAULT '{}',
  soft_qualities JSONB DEFAULT '{}',
  webby_summary TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Structured job specs created by Webby
CREATE TABLE IF NOT EXISTS webby_job_specs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id BIGINT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE UNIQUE,
  seniority_level TEXT CHECK (seniority_level IN ('junior', 'mid', 'senior', 'lead')),
  employment_type TEXT CHECK (employment_type IN ('full-time', 'part-time', 'contract', 'casual', 'freelance')),
  remote_hybrid_flags JSONB DEFAULT '{}',
  required_skills TEXT[] DEFAULT '{}',
  nice_to_have_skills TEXT[] DEFAULT '{}',
  soft_requirements TEXT[] DEFAULT '{}',
  industry_type TEXT,
  business_context TEXT,
  webby_summary TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Interest/match tracking with anonymity states
CREATE TABLE IF NOT EXISTS webby_interests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID NOT NULL REFERENCES candidate_profiles(id) ON DELETE CASCADE,
  job_id BIGINT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  employer_id UUID NOT NULL REFERENCES employer_profiles(id) ON DELETE CASCADE,
  initiated_by TEXT NOT NULL CHECK (initiated_by IN ('candidate', 'employer')),
  candidate_interest_status TEXT CHECK (candidate_interest_status IN ('interested', 'declined', 'pending')),
  employer_interest_status TEXT CHECK (employer_interest_status IN ('interested', 'declined', 'pending')),
  anonymity_state TEXT DEFAULT 'anonymous' CHECK (anonymity_state IN ('anonymous', 'first_name_shared', 'full_revealed')),
  match_explanation TEXT,
  drafted_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(candidate_id, job_id)
);

-- Anonymous candidate cards for employers
CREATE TABLE IF NOT EXISTS webby_anonymous_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID NOT NULL REFERENCES candidate_profiles(id) ON DELETE CASCADE UNIQUE,
  anonymous_display_name TEXT NOT NULL,
  skills_summary TEXT[] DEFAULT '{}',
  experience_level TEXT,
  area_code TEXT,
  availability_summary TEXT,
  pay_expectation_range TEXT,
  soft_qualities_summary TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE webby_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE webby_candidate_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE webby_job_specs ENABLE ROW LEVEL SECURITY;
ALTER TABLE webby_interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE webby_anonymous_cards ENABLE ROW LEVEL SECURITY;

-- RLS Policies for webby_preferences
CREATE POLICY "Users can view own webby preferences"
  ON webby_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own webby preferences"
  ON webby_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own webby preferences"
  ON webby_preferences FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for webby_candidate_profiles
CREATE POLICY "Candidates can view own webby profile"
  ON webby_candidate_profiles FOR SELECT
  USING (candidate_id IN (SELECT id FROM candidate_profiles WHERE id = auth.uid()));

CREATE POLICY "Candidates can insert own webby profile"
  ON webby_candidate_profiles FOR INSERT
  WITH CHECK (candidate_id IN (SELECT id FROM candidate_profiles WHERE id = auth.uid()));

CREATE POLICY "Candidates can update own webby profile"
  ON webby_candidate_profiles FOR UPDATE
  USING (candidate_id IN (SELECT id FROM candidate_profiles WHERE id = auth.uid()));

-- RLS Policies for webby_job_specs
CREATE POLICY "Employers can view own job specs"
  ON webby_job_specs FOR SELECT
  USING (job_id IN (SELECT id FROM jobs WHERE employer_id = auth.uid()));

CREATE POLICY "Employers can insert own job specs"
  ON webby_job_specs FOR INSERT
  WITH CHECK (job_id IN (SELECT id FROM jobs WHERE employer_id = auth.uid()));

CREATE POLICY "Employers can update own job specs"
  ON webby_job_specs FOR UPDATE
  USING (job_id IN (SELECT id FROM jobs WHERE employer_id = auth.uid()));

-- RLS Policies for webby_interests
CREATE POLICY "Candidates can view own interests"
  ON webby_interests FOR SELECT
  USING (candidate_id IN (SELECT id FROM candidate_profiles WHERE id = auth.uid()));

CREATE POLICY "Employers can view interests for their jobs"
  ON webby_interests FOR SELECT
  USING (employer_id = auth.uid());

CREATE POLICY "Candidates can insert interests"
  ON webby_interests FOR INSERT
  WITH CHECK (candidate_id IN (SELECT id FROM candidate_profiles WHERE id = auth.uid()));

CREATE POLICY "Employers can insert interests"
  ON webby_interests FOR INSERT
  WITH CHECK (employer_id = auth.uid());

CREATE POLICY "Both parties can update interests"
  ON webby_interests FOR UPDATE
  USING (
    candidate_id IN (SELECT id FROM candidate_profiles WHERE id = auth.uid()) 
    OR employer_id = auth.uid()
  );

-- RLS Policies for webby_anonymous_cards
CREATE POLICY "Employers can view anonymous cards"
  ON webby_anonymous_cards FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM employer_profiles WHERE id = auth.uid()
  ));

CREATE POLICY "System can manage anonymous cards"
  ON webby_anonymous_cards FOR ALL
  USING (true);

-- Add updated_at trigger for webby tables
CREATE TRIGGER update_webby_preferences_updated_at
  BEFORE UPDATE ON webby_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_webby_candidate_profiles_updated_at
  BEFORE UPDATE ON webby_candidate_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_webby_interests_updated_at
  BEFORE UPDATE ON webby_interests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_webby_anonymous_cards_updated_at
  BEFORE UPDATE ON webby_anonymous_cards
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();