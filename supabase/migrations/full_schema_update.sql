-- ============================================================================
-- FULL SCHEMA UPDATE — Production-safe migration
-- Bridges schema.sql (old) to the full fresh.sql state.
-- Safe to run on a live database — no data is dropped.
-- Run order: full_schema_update.sql → seed-dimensions.sql
-- ============================================================================

-- ============================================================================
-- 1. Add missing ENUM values to question_type_enum
--    schema.sql had: pattern, multiple, likert_5, likert_4, matrix, visual
--    fresh.sql adds: likert, open, checkbox
-- ============================================================================
ALTER TYPE question_type_enum ADD VALUE IF NOT EXISTS 'likert';
ALTER TYPE question_type_enum ADD VALUE IF NOT EXISTS 'open';
ALTER TYPE question_type_enum ADD VALUE IF NOT EXISTS 'checkbox';

-- ============================================================================
-- 2. Create dimensions table (new — did not exist in schema.sql)
-- ============================================================================
CREATE TABLE IF NOT EXISTS dimensions (
  id           UUID           PRIMARY KEY DEFAULT uuid_generate_v4(),
  test_type    test_type_enum NOT NULL,
  code         TEXT,
  name         TEXT           NOT NULL,
  description  TEXT,
  info_content TEXT,          -- text displayed in DimensionInfoScreen
  sort_order   INTEGER        DEFAULT 0,
  is_active    BOOLEAN        DEFAULT TRUE,
  created_at   TIMESTAMPTZ    DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_dimensions_test_type
  ON dimensions(test_type) WHERE is_active = TRUE;

CREATE INDEX IF NOT EXISTS idx_dimensions_sort
  ON dimensions(test_type, sort_order) WHERE is_active = TRUE;

-- RLS for dimensions
ALTER TABLE dimensions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read active dimensions" ON dimensions;
CREATE POLICY "Public can read active dimensions"
  ON dimensions FOR SELECT
  USING (is_active = TRUE);

-- ============================================================================
-- 3. Add dimension_id column to questions (new foreign key to dimensions)
-- ============================================================================
ALTER TABLE questions
  ADD COLUMN IF NOT EXISTS dimension_id UUID REFERENCES dimensions(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_questions_dim_id
  ON questions(dimension_id) WHERE dimension_id IS NOT NULL;

-- ============================================================================
-- 4. Add missing columns to test_results
--    schema.sql had: id, user_id, test_type, total_questions, answers,
--                    score, percentile, tag, dimension_scores,
--                    duration_seconds, completed_at, created_at
--    fresh.sql adds: dimension_metadata, dimension_breakdown,
--                    ai_artistic_title, ai_artistic_description,
--                    ai_insights, ai_recommendations
-- ============================================================================
ALTER TABLE test_results
  ADD COLUMN IF NOT EXISTS dimension_metadata      JSONB,
  ADD COLUMN IF NOT EXISTS dimension_breakdown     JSONB,
  ADD COLUMN IF NOT EXISTS ai_artistic_title       TEXT,
  ADD COLUMN IF NOT EXISTS ai_artistic_description TEXT,
  ADD COLUMN IF NOT EXISTS ai_insights             JSONB,
  ADD COLUMN IF NOT EXISTS ai_recommendations      JSONB;

-- ============================================================================
-- 5. Add demographic columns to user_profiles
--    schema.sql had: id, display_name, avatar_url, timezone, created_at, updated_at
--    fresh.sql adds: age, gender, occupation, education, onboarded_at
-- ============================================================================
ALTER TABLE user_profiles
  ADD COLUMN IF NOT EXISTS age          INTEGER,
  ADD COLUMN IF NOT EXISTS gender       TEXT,
  ADD COLUMN IF NOT EXISTS occupation   TEXT,
  ADD COLUMN IF NOT EXISTS education    TEXT,
  ADD COLUMN IF NOT EXISTS onboarded_at TIMESTAMPTZ;

-- Add check constraints (guarded to avoid duplicate constraint errors)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_age') THEN
    ALTER TABLE user_profiles ADD CONSTRAINT chk_age
      CHECK (age IS NULL OR (age >= 10 AND age <= 120));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_gender') THEN
    ALTER TABLE user_profiles ADD CONSTRAINT chk_gender
      CHECK (gender IS NULL OR gender IN ('male', 'female', 'non_binary', 'prefer_not_to_say'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_education') THEN
    ALTER TABLE user_profiles ADD CONSTRAINT chk_education
      CHECK (education IS NULL OR education IN ('high_school', 'bachelor', 'master', 'doctorate', 'other'));
  END IF;
END $$;

-- ============================================================================
-- 6. Fix user_profiles RLS policy — add WITH CHECK clause (was missing in schema.sql)
-- ============================================================================
DROP POLICY IF EXISTS "Users can manage own profile" ON user_profiles;
CREATE POLICY "Users can manage own profile"
  ON user_profiles FOR ALL
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ============================================================================
-- 7. Grant privileges to Supabase roles
--    These were missing from schema.sql entirely
-- ============================================================================
GRANT SELECT ON public.questions  TO anon;
GRANT SELECT ON public.dimensions TO anon;

GRANT SELECT ON public.questions              TO authenticated;
GRANT SELECT ON public.dimensions             TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.test_results  TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.user_profiles TO authenticated;

-- ============================================================================
-- 8. Add auto-create user_profiles trigger on signup
--    Was not present in schema.sql
-- ============================================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, display_name)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'display_name',
      split_part(NEW.email, '@', 1)
    )
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
