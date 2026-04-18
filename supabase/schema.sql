-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ENUM types for data consistency
CREATE TYPE test_type_enum AS ENUM ('iq', 'eq', 'personality', 'spectrum');
CREATE TYPE question_type_enum AS ENUM ('pattern', 'multiple', 'likert_5', 'likert_4', 'matrix', 'visual');
CREATE TYPE personality_dimension_enum AS ENUM ('O', 'C', 'E', 'A', 'N');
CREATE TYPE spectrum_dimension_enum AS ENUM ('social_skills', 'attention_switching', 'attention_to_detail', 'imagination');

-- ============================================================================
-- TABLE: questions
-- ============================================================================
CREATE TABLE questions (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  
  -- Question classification
  test_type test_type_enum NOT NULL,
  question_type question_type_enum NOT NULL,
  
  -- Question content
  text TEXT NOT NULL,
  options JSONB DEFAULT '[]'::jsonb,  -- [{id: "a", label: "Option A"}, ...]
  rows JSONB,                         -- Used for matrix questions
  main_image TEXT,                    -- Image URL for visual/pattern questions
  
  -- Answers & scoring
  correct_answer TEXT,                -- Only for IQ (optional for auto-scoring)
  dimension personality_dimension_enum, -- For Personality (O/C/E/A/N)
  spectrum_dimension spectrum_dimension_enum, -- For Spectrum dimensions
  reverse_scored BOOLEAN DEFAULT FALSE, -- For EQ/Spectrum items requiring reverse coding
  difficulty INTEGER,                -- 1-10 scale, used for IQ adaptive engine
  
  -- Metadata
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for faster queries
CREATE INDEX idx_questions_test_type ON questions(test_type) WHERE is_active = TRUE;
CREATE INDEX idx_questions_sort ON questions(test_type, sort_order) WHERE is_active = TRUE;
CREATE INDEX idx_questions_dimension ON questions(dimension) WHERE dimension IS NOT NULL;

-- ============================================================================
-- TABLE: test_results
-- ============================================================================
CREATE TABLE test_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- User reference (nullable for guest users)
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Test information
  test_type test_type_enum NOT NULL,
  total_questions INTEGER NOT NULL,
  answers JSONB NOT NULL DEFAULT '{}'::jsonb,  -- {question_id: answer_value}
  
  -- Scoring results
  score INTEGER,
  percentile TEXT,
  tag TEXT,  -- e.g., "High Average", "Elevated AQ"
  dimension_scores JSONB,  -- {Logical: 92, Pattern: 85, ...}
  
  -- Metadata
  duration_seconds INTEGER,  -- Time taken in seconds
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for dashboard & analytics queries
CREATE INDEX idx_results_user ON test_results(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX idx_results_test_type ON test_results(test_type);
CREATE INDEX idx_results_completed ON test_results(completed_at DESC);

-- ============================================================================
-- TABLE: user_profiles (optional, for additional user data)
-- ============================================================================
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  timezone TEXT DEFAULT 'UTC',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) Policies
-- ============================================================================

-- Questions: Public read-only access
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read active questions" 
  ON questions FOR SELECT 
  USING (is_active = TRUE);

-- Test Results: Users can read/write their own results
ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own results" 
  ON test_results FOR INSERT 
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can view their own results" 
  ON test_results FOR SELECT 
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update their own results" 
  ON test_results FOR UPDATE 
  USING (auth.uid() = user_id);

-- User Profiles: Users manage their own profile
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own profile" 
  ON user_profiles FOR ALL 
  USING (auth.uid() = id);

-- ============================================================================
-- TRIGGER: Auto-update updated_at timestamp
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_questions_updated_at
  BEFORE UPDATE ON questions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();