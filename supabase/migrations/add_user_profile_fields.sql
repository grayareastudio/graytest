-- Migration: Add demographic fields to user_profiles
-- Run this in Supabase SQL Editor

ALTER TABLE user_profiles
  ADD COLUMN IF NOT EXISTS age          INTEGER,
  ADD COLUMN IF NOT EXISTS gender       TEXT,        -- 'male' | 'female' | 'non_binary' | 'prefer_not_to_say'
  ADD COLUMN IF NOT EXISTS occupation   TEXT,
  ADD COLUMN IF NOT EXISTS education    TEXT,        -- 'high_school' | 'bachelor' | 'master' | 'doctorate' | 'other'
  ADD COLUMN IF NOT EXISTS onboarded_at TIMESTAMPTZ; -- NULL = not yet onboarded

-- Add check constraints
ALTER TABLE user_profiles
  ADD CONSTRAINT chk_age CHECK (age IS NULL OR (age >= 10 AND age <= 120)),
  ADD CONSTRAINT chk_gender CHECK (
    gender IS NULL OR gender IN ('male', 'female', 'non_binary', 'prefer_not_to_say')
  ),
  ADD CONSTRAINT chk_education CHECK (
    education IS NULL OR education IN ('high_school', 'bachelor', 'master', 'doctorate', 'other')
  );
