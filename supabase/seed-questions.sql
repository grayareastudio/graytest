-- ============================================================================
-- SEED: IQ Assessment Questions (10 questions MVP)
-- ============================================================================

-- Q1: Pattern - Sequence 2,4,8,16,?
INSERT INTO questions (test_type, question_type, text, options, correct_answer, sort_order, difficulty)
VALUES (
  'iq', 'pattern',
  'What comes next in the sequence: 2 → 4 → 8 → 16 → ?',
  '[{"id":"a","label":"24"},{"id":"b","label":"32"},{"id":"c","label":"20"},{"id":"d","label":"30"}]',
  'b', 1, 3
);

-- Q2: Multiple - Logical syllogism
INSERT INTO questions (test_type, question_type, text, options, correct_answer, sort_order, difficulty)
VALUES (
  'iq', 'multiple',
  'If all Bloops are Razzies and all Razzies are Lazzies, are all Bloops definitely Lazzies?',
  '[{"id":"a","label":"Yes"},{"id":"b","label":"No"},{"id":"c","label":"Cannot be determined"},{"id":"d","label":"Only sometimes"}]',
  'a', 2, 4
);

-- Q3: Pattern - Sequence 3,9,27,81,?
INSERT INTO questions (test_type, question_type, text, options, correct_answer, sort_order, difficulty)
VALUES (
  'iq', 'pattern',
  'Sequence: 3 → 9 → 27 → 81 → ? Which number completes the pattern?',
  '[{"id":"a","label":"162"},{"id":"b","label":"243"},{"id":"c","label":"108"},{"id":"d","label":"180"}]',
  'b', 3, 5
);

-- Q4: Multiple - Clock angle
INSERT INTO questions (test_type, question_type, text, options, correct_answer, sort_order, difficulty)
VALUES (
  'iq', 'multiple',
  'A clock shows 3:15. What is the angle between the hour and minute hands?',
  '[{"id":"a","label":"0°"},{"id":"b","label":"7.5°"},{"id":"c","label":"15°"},{"id":"d","label":"22.5°"}]',
  'b', 4, 6
);

-- Q5: Pattern - Fibonacci 1,1,2,3,5,8,?
INSERT INTO questions (test_type, question_type, text, options, correct_answer, sort_order, difficulty)
VALUES (
  'iq', 'pattern',
  'Sequence: 1 → 1 → 2 → 3 → 5 → 8 → ? Find the missing number.',
  '[{"id":"a","label":"11"},{"id":"b","label":"12"},{"id":"c","label":"13"},{"id":"d","label":"14"}]',
  'c', 5, 5
);

-- Q6: Multiple - Odd one out
INSERT INTO questions (test_type, question_type, text, options, correct_answer, sort_order, difficulty)
VALUES (
  'iq', 'multiple',
  'Which word is the odd one out?',
  '[{"id":"a","label":"Equinox"},{"id":"b","label":"Solstice"},{"id":"c","label":"Eclipse"},{"id":"d","label":"Latitude"}]',
  'd', 6, 4
);

-- Q7: Multiple - Bat and ball problem
INSERT INTO questions (test_type, question_type, text, options, correct_answer, sort_order, difficulty)
VALUES (
  'iq', 'multiple',
  'A bat and ball cost $1.10 total. The bat costs $1.00 more than the ball. How much is the ball?',
  '[{"id":"a","label":"$0.10"},{"id":"b","label":"$0.05"},{"id":"c","label":"$0.15"},{"id":"d","label":"$0.20"}]',
  'b', 7, 7
);

-- Q8: Pattern - Halving sequence 100,50,25,12.5,?
INSERT INTO questions (test_type, question_type, text, options, correct_answer, sort_order, difficulty)
VALUES (
  'iq', 'pattern',
  'Sequence: 100 → 50 → 25 → 12.5 → ? What is the next number?',
  '[{"id":"a","label":"6"},{"id":"b","label":"6.25"},{"id":"c","label":"5"},{"id":"d","label":"7"}]',
  'b', 8, 4
);

-- Q9: Multiple - Race position logic
INSERT INTO questions (test_type, question_type, text, options, correct_answer, sort_order, difficulty)
VALUES (
  'iq', 'multiple',
  'In a race you overtake the person in 2nd place. What position are you in?',
  '[{"id":"a","label":"1st"},{"id":"b","label":"2nd"},{"id":"c","label":"3rd"},{"id":"d","label":"4th"}]',
  'b', 9, 3
);

-- Q10: Multiple - Anagram CIFAIPC
INSERT INTO questions (test_type, question_type, text, options, correct_answer, sort_order, difficulty)
VALUES (
  'iq', 'multiple',
  'If you rearrange CIFAIPC you get the name of an:',
  '[{"id":"a","label":"Country"},{"id":"b","label":"Ocean"},{"id":"c","label":"City"},{"id":"d","label":"Mountain"}]',
  'b', 10, 5
);

-- ============================================================================
-- SEED: EQ Assessment Questions (10 Likert questions, MSCEIT-based)
-- ============================================================================

INSERT INTO questions (test_type, question_type, text, options, dimension, reverse_scored, sort_order)
VALUES 
-- Self-Awareness dimension
('eq', 'likert_5', 'I can tell when someone is upset even if they don''t say anything.', 
 '[{"id":"1","label":"Strongly Disagree"},{"id":"2","label":"Disagree"},{"id":"3","label":"Neutral"},{"id":"4","label":"Agree"},{"id":"5","label":"Strongly Agree"}]', 
 NULL, FALSE, 1),

('eq', 'likert_5', 'When I''m in a bad mood, I can usually figure out why.', 
 '[{"id":"1","label":"Strongly Disagree"},{"id":"2","label":"Disagree"},{"id":"3","label":"Neutral"},{"id":"4","label":"Agree"},{"id":"5","label":"Strongly Agree"}]', 
 NULL, FALSE, 2),

('eq', 'likert_5', 'I notice when my emotions are affecting my performance.', 
 '[{"id":"1","label":"Strongly Disagree"},{"id":"2","label":"Disagree"},{"id":"3","label":"Neutral"},{"id":"4","label":"Agree"},{"id":"5","label":"Strongly Agree"}]', 
 NULL, FALSE, 3),

('eq', 'likert_5', 'I am aware of the emotional atmosphere in a room when I enter it.', 
 '[{"id":"1","label":"Strongly Disagree"},{"id":"2","label":"Disagree"},{"id":"3","label":"Neutral"},{"id":"4","label":"Agree"},{"id":"5","label":"Strongly Agree"}]', 
 NULL, FALSE, 4),

-- Self-Regulation dimension
('eq', 'likert_5', 'I find it easy to stay calm under pressure.', 
 '[{"id":"1","label":"Strongly Disagree"},{"id":"2","label":"Disagree"},{"id":"3","label":"Neutral"},{"id":"4","label":"Agree"},{"id":"5","label":"Strongly Agree"}]', 
 NULL, FALSE, 5),

('eq', 'likert_5', 'When I feel frustrated, I can stop myself from acting impulsively.', 
 '[{"id":"1","label":"Strongly Disagree"},{"id":"2","label":"Disagree"},{"id":"3","label":"Neutral"},{"id":"4","label":"Agree"},{"id":"5","label":"Strongly Agree"}]', 
 NULL, FALSE, 6),

-- Empathy dimension
('eq', 'likert_5', 'I am good at understanding how people are feeling.', 
 '[{"id":"1","label":"Strongly Disagree"},{"id":"2","label":"Disagree"},{"id":"3","label":"Neutral"},{"id":"4","label":"Agree"},{"id":"5","label":"Strongly Agree"}]', 
 NULL, FALSE, 7),

('eq', 'likert_5', 'I can usually predict how a conversation will make someone feel.', 
 '[{"id":"1","label":"Strongly Disagree"},{"id":"2","label":"Disagree"},{"id":"3","label":"Neutral"},{"id":"4","label":"Agree"},{"id":"5","label":"Strongly Agree"}]', 
 NULL, FALSE, 8),

('eq', 'likert_5', 'I find it easy to see things from another person''s point of view.', 
 '[{"id":"1","label":"Strongly Disagree"},{"id":"2","label":"Disagree"},{"id":"3","label":"Neutral"},{"id":"4","label":"Agree"},{"id":"5","label":"Strongly Agree"}]', 
 NULL, FALSE, 9),

-- Social Skills dimension
('eq', 'likert_5', 'People come to me for emotional support.', 
 '[{"id":"1","label":"Strongly Disagree"},{"id":"2","label":"Disagree"},{"id":"3","label":"Neutral"},{"id":"4","label":"Agree"},{"id":"5","label":"Strongly Agree"}]', 
 NULL, FALSE, 10);

-- ============================================================================
-- SEED: Personality Assessment Questions (Big Five/OCEAN)
-- ============================================================================

INSERT INTO questions (test_type, question_type, text, options, dimension, sort_order)
VALUES 
-- Openness (O)
('personality', 'likert_5', 'I enjoy having a wide variety of experiences and trying new things.', 
 '[{"id":"1","label":"Very Unlike Me"},{"id":"2","label":"Unlike Me"},{"id":"3","label":"Neutral"},{"id":"4","label":"Like Me"},{"id":"5","label":"Very Like Me"}]', 
 'O', 1),

('personality', 'likert_5', 'I enjoy abstract ideas and philosophical discussions.', 
 '[{"id":"1","label":"Very Unlike Me"},{"id":"2","label":"Unlike Me"},{"id":"3","label":"Neutral"},{"id":"4","label":"Like Me"},{"id":"5","label":"Very Like Me"}]', 
 'O', 2),

-- Conscientiousness (C)
('personality', 'likert_5', 'I keep my belongings neat and am always well-prepared.', 
 '[{"id":"1","label":"Very Unlike Me"},{"id":"2","label":"Unlike Me"},{"id":"3","label":"Neutral"},{"id":"4","label":"Like Me"},{"id":"5","label":"Very Like Me"}]', 
 'C', 3),

('personality', 'likert_5', 'I follow through on my commitments and seldom back out.', 
 '[{"id":"1","label":"Very Unlike Me"},{"id":"2","label":"Unlike Me"},{"id":"3","label":"Neutral"},{"id":"4","label":"Like Me"},{"id":"5","label":"Very Like Me"}]', 
 'C', 4),

-- Extraversion (E)
('personality', 'likert_5', 'I feel comfortable being the center of attention at social events.', 
 '[{"id":"1","label":"Very Unlike Me"},{"id":"2","label":"Unlike Me"},{"id":"3","label":"Neutral"},{"id":"4","label":"Like Me"},{"id":"5","label":"Very Like Me"}]', 
 'E', 5),

('personality', 'likert_5', 'I find meeting new people energizing rather than draining.', 
 '[{"id":"1","label":"Very Unlike Me"},{"id":"2","label":"Unlike Me"},{"id":"3","label":"Neutral"},{"id":"4","label":"Like Me"},{"id":"5","label":"Very Like Me"}]', 
 'E', 6),

-- Agreeableness (A)
('personality', 'likert_5', 'I genuinely care about others'' wellbeing and try to be helpful.', 
 '[{"id":"1","label":"Very Unlike Me"},{"id":"2","label":"Unlike Me"},{"id":"3","label":"Neutral"},{"id":"4","label":"Like Me"},{"id":"5","label":"Very Like Me"}]', 
 'A', 7),

('personality', 'likert_5', 'I avoid arguments and try to keep the peace even when I disagree.', 
 '[{"id":"1","label":"Very Unlike Me"},{"id":"2","label":"Unlike Me"},{"id":"3","label":"Neutral"},{"id":"4","label":"Like Me"},{"id":"5","label":"Very Like Me"}]', 
 'A', 8),

-- Neuroticism (N)
('personality', 'likert_5', 'I often feel anxious or worried, even about small things.', 
 '[{"id":"1","label":"Very Unlike Me"},{"id":"2","label":"Unlike Me"},{"id":"3","label":"Neutral"},{"id":"4","label":"Like Me"},{"id":"5","label":"Very Like Me"}]', 
 'N', 9),

('personality', 'likert_5', 'My mood can shift quickly from positive to negative.', 
 '[{"id":"1","label":"Very Unlike Me"},{"id":"2","label":"Unlike Me"},{"id":"3","label":"Neutral"},{"id":"4","label":"Like Me"},{"id":"5","label":"Very Like Me"}]', 
 'N', 10);

-- ============================================================================
-- SEED: Spectrum Assessment Questions (AQ-50, 4-point Likert)
-- Note: reverse_scored = TRUE untuk items yang perlu reverse coding per AQ-50 manual
-- Items yang reverse-coded: 2,4,5,6,7,9 (sesuai doc: ~50% items)
-- ============================================================================

INSERT INTO questions (test_type, question_type, text, options, spectrum_dimension, reverse_scored, sort_order)
VALUES 
-- Social Skills dimension
('spectrum', 'likert_4', 'I prefer doing things the same way over and over again.', 
 '[{"id":"1","label":"Definitely Agree"},{"id":"2","label":"Slightly Agree"},{"id":"3","label":"Slightly Disagree"},{"id":"4","label":"Definitely Disagree"}]', 
 'social_skills', FALSE, 1),

('spectrum', 'likert_4', 'I find social situations easy to navigate.', 
 '[{"id":"1","label":"Definitely Agree"},{"id":"2","label":"Slightly Agree"},{"id":"3","label":"Slightly Disagree"},{"id":"4","label":"Definitely Disagree"}]', 
 'social_skills', TRUE, 2),

('spectrum', 'likert_4', 'I find it easy to "read between the lines" when someone is talking to me.', 
 '[{"id":"1","label":"Definitely Agree"},{"id":"2","label":"Slightly Agree"},{"id":"3","label":"Slightly Disagree"},{"id":"4","label":"Definitely Disagree"}]', 
 'social_skills', TRUE, 3),

('spectrum', 'likert_4', 'In social situations I find it difficult to know when it''s my turn to speak.', 
 '[{"id":"1","label":"Definitely Agree"},{"id":"2","label":"Slightly Agree"},{"id":"3","label":"Slightly Disagree"},{"id":"4","label":"Definitely Disagree"}]', 
 'social_skills', FALSE, 4),

-- Attention Switching dimension
('spectrum', 'likert_4', 'I can switch between tasks easily without feeling disrupted.', 
 '[{"id":"1","label":"Definitely Agree"},{"id":"2","label":"Slightly Agree"},{"id":"3","label":"Slightly Disagree"},{"id":"4","label":"Definitely Disagree"}]', 
 'attention_switching', TRUE, 5),

('spectrum', 'likert_4', 'I find myself drawn to routines and feel unsettled when they are disrupted.', 
 '[{"id":"1","label":"Definitely Agree"},{"id":"2","label":"Slightly Agree"},{"id":"3","label":"Slightly Disagree"},{"id":"4","label":"Definitely Disagree"}]', 
 'attention_switching', FALSE, 6),

-- Attention to Detail dimension
('spectrum', 'likert_4', 'I often notice small sounds that others don''t seem to hear.', 
 '[{"id":"1","label":"Definitely Agree"},{"id":"2","label":"Slightly Agree"},{"id":"3","label":"Slightly Disagree"},{"id":"4","label":"Definitely Disagree"}]', 
 'attention_to_detail', FALSE, 7),

('spectrum', 'likert_4', 'I tend to notice details that others don''t.', 
 '[{"id":"1","label":"Definitely Agree"},{"id":"2","label":"Slightly Agree"},{"id":"3","label":"Slightly Disagree"},{"id":"4","label":"Definitely Disagree"}]', 
 'attention_to_detail', FALSE, 8),

('spectrum', 'likert_4', 'I am fascinated by numbers, dates, and detailed factual information.', 
 '[{"id":"1","label":"Definitely Agree"},{"id":"2","label":"Slightly Agree"},{"id":"3","label":"Slightly Disagree"},{"id":"4","label":"Definitely Disagree"}]', 
 'attention_to_detail', FALSE, 9),

-- Imagination dimension
('spectrum', 'likert_4', 'When reading a story, I find it difficult to work out characters'' intentions.', 
 '[{"id":"1","label":"Definitely Agree"},{"id":"2","label":"Slightly Agree"},{"id":"3","label":"Slightly Disagree"},{"id":"4","label":"Definitely Disagree"}]', 
 'imagination', FALSE, 10);