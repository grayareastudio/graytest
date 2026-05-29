-- ============================================================================
-- SEED: Dimensions + assign dimension_id to questions
-- Run AFTER fresh.sql and seed-questions.sql
-- ============================================================================

-- ============================================================================
-- IQ Dimensions
-- ============================================================================
INSERT INTO dimensions (test_type, code, name, description, info_content, sort_order) VALUES
(
  'iq', 'LR', 'Logical Reasoning',
  'Measures your ability to analyze information and draw valid conclusions.',
  'In this section, you will be presented with logical problems and arguments. Read each question carefully and select the most logically sound answer.',
  1
),
(
  'iq', 'PR', 'Pattern Recognition',
  'Measures your ability to identify patterns and sequences.',
  'You will see number or symbol sequences. Your task is to identify the rule and find what comes next.',
  2
),
(
  'iq', 'VA', 'Verbal Ability',
  'Measures your vocabulary and verbal reasoning skills.',
  'These questions test your understanding of words, analogies, and language-based logic.',
  3
),
(
  'iq', 'PS', 'Processing Speed',
  'Measures how quickly and accurately you process simple information.',
  'Answer these questions as quickly and accurately as you can. Speed matters here.',
  4
);

-- Assign IQ questions to dimensions based on sort_order and question_type
-- pattern questions -> Pattern Recognition
-- multiple choice questions -> distributed across Logical Reasoning, Verbal Ability, Processing Speed
UPDATE questions SET dimension_id = (SELECT id FROM dimensions WHERE test_type = 'iq' AND code = 'PR')
  WHERE test_type = 'iq' AND question_type = 'pattern';

UPDATE questions SET dimension_id = (SELECT id FROM dimensions WHERE test_type = 'iq' AND code = 'LR')
  WHERE test_type = 'iq' AND question_type = 'multiple' AND sort_order IN (2, 4, 7, 9);

UPDATE questions SET dimension_id = (SELECT id FROM dimensions WHERE test_type = 'iq' AND code = 'VA')
  WHERE test_type = 'iq' AND question_type = 'multiple' AND sort_order IN (6, 10);

UPDATE questions SET dimension_id = (SELECT id FROM dimensions WHERE test_type = 'iq' AND code = 'PS')
  WHERE test_type = 'iq' AND question_type = 'multiple' AND sort_order IN (4);

-- Fallback: assign any remaining unassigned IQ questions to Logical Reasoning
UPDATE questions SET dimension_id = (SELECT id FROM dimensions WHERE test_type = 'iq' AND code = 'LR')
  WHERE test_type = 'iq' AND dimension_id IS NULL;

-- ============================================================================
-- EQ Dimensions
-- ============================================================================
INSERT INTO dimensions (test_type, code, name, description, info_content, sort_order) VALUES
(
  'eq', 'SA', 'Self-Awareness',
  'Your ability to recognize and understand your own emotions.',
  'These questions explore how well you understand your own emotional states and what triggers them.',
  1
),
(
  'eq', 'SR', 'Self-Regulation',
  'Your ability to manage and control your emotional responses.',
  'These questions assess how well you manage your emotions, especially in challenging situations.',
  2
),
(
  'eq', 'EM', 'Empathy',
  'Your ability to understand and share the feelings of others.',
  'These questions explore how well you perceive and understand the emotions of people around you.',
  3
),
(
  'eq', 'SS', 'Social Skills',
  'Your ability to manage relationships and navigate social situations.',
  'These questions assess how effectively you use emotional awareness in your interactions with others.',
  4
);

-- Assign EQ questions to dimensions based on sort_order (matching seed-questions.sql)
-- sort_order 1-4: Self-Awareness, 5-6: Self-Regulation, 7-9: Empathy, 10: Social Skills
UPDATE questions SET dimension_id = (SELECT id FROM dimensions WHERE test_type = 'eq' AND code = 'SA')
  WHERE test_type = 'eq' AND sort_order BETWEEN 1 AND 4;

UPDATE questions SET dimension_id = (SELECT id FROM dimensions WHERE test_type = 'eq' AND code = 'SR')
  WHERE test_type = 'eq' AND sort_order BETWEEN 5 AND 6;

UPDATE questions SET dimension_id = (SELECT id FROM dimensions WHERE test_type = 'eq' AND code = 'EM')
  WHERE test_type = 'eq' AND sort_order BETWEEN 7 AND 9;

UPDATE questions SET dimension_id = (SELECT id FROM dimensions WHERE test_type = 'eq' AND code = 'SS')
  WHERE test_type = 'eq' AND sort_order = 10;

-- ============================================================================
-- Personality Dimensions (Big Five / OCEAN)
-- ============================================================================
INSERT INTO dimensions (test_type, code, name, description, info_content, sort_order) VALUES
(
  'personality', 'O', 'Openness',
  'Reflects your curiosity, creativity, and openness to new experiences.',
  'These questions explore your intellectual curiosity and willingness to engage with new ideas and experiences.',
  1
),
(
  'personality', 'C', 'Conscientiousness',
  'Reflects your organization, dependability, and self-discipline.',
  'These questions assess how organized, responsible, and goal-directed you tend to be.',
  2
),
(
  'personality', 'E', 'Extraversion',
  'Reflects your sociability, assertiveness, and positive emotionality.',
  'These questions explore how energized you feel by social interaction and external stimulation.',
  3
),
(
  'personality', 'A', 'Agreeableness',
  'Reflects your cooperativeness, empathy, and trust in others.',
  'These questions assess how you relate to others — your tendency toward cooperation versus competition.',
  4
),
(
  'personality', 'N', 'Neuroticism',
  'Reflects your emotional stability and tendency toward negative emotions.',
  'These questions explore how you respond to stress and whether you tend toward emotional reactivity.',
  5
);

-- Assign Personality questions using the existing `dimension` column (O/C/E/A/N) from seed data
UPDATE questions SET dimension_id = (SELECT id FROM dimensions WHERE test_type = 'personality' AND code = 'O')
  WHERE test_type = 'personality' AND dimension = 'O';

UPDATE questions SET dimension_id = (SELECT id FROM dimensions WHERE test_type = 'personality' AND code = 'C')
  WHERE test_type = 'personality' AND dimension = 'C';

UPDATE questions SET dimension_id = (SELECT id FROM dimensions WHERE test_type = 'personality' AND code = 'E')
  WHERE test_type = 'personality' AND dimension = 'E';

UPDATE questions SET dimension_id = (SELECT id FROM dimensions WHERE test_type = 'personality' AND code = 'A')
  WHERE test_type = 'personality' AND dimension = 'A';

UPDATE questions SET dimension_id = (SELECT id FROM dimensions WHERE test_type = 'personality' AND code = 'N')
  WHERE test_type = 'personality' AND dimension = 'N';

-- ============================================================================
-- Spectrum Dimensions (AQ-based)
-- ============================================================================
INSERT INTO dimensions (test_type, code, name, description, info_content, sort_order) VALUES
(
  'spectrum', 'SOC', 'Social Communication',
  'Assesses comfort and ability in social situations.',
  'These questions explore how you experience and navigate social interactions and communication.',
  1
),
(
  'spectrum', 'ATT', 'Attention Switching',
  'Assesses your ability to shift focus between tasks.',
  'These questions look at how easily you transition between different activities or topics.',
  2
),
(
  'spectrum', 'ATD', 'Attention to Detail',
  'Assesses your focus on details and patterns.',
  'These questions explore your tendency to notice fine details and your relationship with information.',
  3
),
(
  'spectrum', 'IMG', 'Imagination',
  'Assesses your imaginative and creative thinking.',
  'These questions explore how you engage with fiction, hypotheticals, and creative thinking.',
  4
);

-- Assign Spectrum questions using the existing `spectrum_dimension` column from seed data
UPDATE questions SET dimension_id = (SELECT id FROM dimensions WHERE test_type = 'spectrum' AND code = 'SOC')
  WHERE test_type = 'spectrum' AND spectrum_dimension = 'social_skills';

UPDATE questions SET dimension_id = (SELECT id FROM dimensions WHERE test_type = 'spectrum' AND code = 'ATT')
  WHERE test_type = 'spectrum' AND spectrum_dimension = 'attention_switching';

UPDATE questions SET dimension_id = (SELECT id FROM dimensions WHERE test_type = 'spectrum' AND code = 'ATD')
  WHERE test_type = 'spectrum' AND spectrum_dimension = 'attention_to_detail';

UPDATE questions SET dimension_id = (SELECT id FROM dimensions WHERE test_type = 'spectrum' AND code = 'IMG')
  WHERE test_type = 'spectrum' AND spectrum_dimension = 'imagination';
