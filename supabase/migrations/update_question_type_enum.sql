-- Migration: Update question_type_enum to include all supported types
-- Run this in Supabase SQL Editor

-- Add likert variants (IF NOT EXISTS prevents errors if already added)
ALTER TYPE question_type_enum ADD VALUE IF NOT EXISTS 'likert';
ALTER TYPE question_type_enum ADD VALUE IF NOT EXISTS 'likert_5';
ALTER TYPE question_type_enum ADD VALUE IF NOT EXISTS 'likert_4';
