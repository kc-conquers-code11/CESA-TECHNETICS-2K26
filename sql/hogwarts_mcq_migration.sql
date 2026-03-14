-- Hogwarts Aptitude Questions for Round 1 (MCQ)
-- This script replaces existing Round 1 questions and RESETS submissions to avoid ID mismatch.

-- 1. Clear existing MCQ questions
DELETE FROM questions WHERE round_id = 'mcq';

-- 2. RESET MCQ Submissions (CRITICAL)
-- This ensures that users who already started the round get a fresh set of new questions.
-- Otherwise, the system tries to look for old, deleted question IDs.
DELETE FROM mcq_submissions;

-- 3. Insert new Hogwarts-themed aptitude questions
INSERT INTO questions (round_id, title, description, options, correct_answer, difficulty) VALUES
-- 1. Easy - Math
(
  'mcq',
  'A Draught of Living Death calls for Sloth Brain and Valerian Root in a 3:5 ratio. If Professor Snape uses 15 grams of Sloth Brain, how much Valerian Root is needed?',
  'Proportional reasoning and ratios.',
  '["20g", "25g", "30g", "35g"]'::jsonb,
  '25g',
  'easy'
),
-- 2. Easy - Geometry/Logic
(
  'mcq',
  'The Great Hall has 4 long tables. If each table seats 50 students, but 10% of seats are taken by ghosts, what is the maximum number of living students that can sit?',
  'Basic percentage and multiplication.',
  '["160", "180", "200", "190"]'::jsonb,
  '180',
  'easy'
),
-- 3. Medium - Math
(
  'mcq',
  'At Gringotts, 1 Galleon = 17 Sickles and 1 Sickle = 29 Knuts. How many Knuts are there in 2 Galleons?',
  'Compound multiplication.',
  '["493", "841", "986", "580"]'::jsonb,
  '986',
  'medium'
),
-- 4. Medium - Logic/Quidditch
(
  'mcq',
  'In Quidditch, a Snitch is worth 150 points. Gryffindor has 40 points and Slytherin has 200. How many goals (10 pts each) must Harry score before catching the Snitch to win?',
  'Algebraic logic and decision making.',
  '["1 goal", "2 goals", "None, they win anyway", "Harry cannot win the game"]'::jsonb,
  '2 goals',
  'medium'
),
-- 5. Hard - Time/Logic
(
  'mcq',
  'Hermione uses a Time-Turner. She attends Class A from 9:00 AM to 11:00 AM. She then turns the turner back 1 hour to attend Class B until 11:30 AM. How many total hours of "work" has she done?',
  'Logical time tracking.',
  '["2 hours", "2.5 hours", "3 hours", "3.5 hours"]'::jsonb,
  '2.5 hours',
  'hard'
),
-- 6. Medium - Probability
(
  'mcq',
  'The Sorting Hat has a 25% chance of placing a student in Gryffindor. If 40 students are sorted, what is the probability that exactly 10 are placed in Gryffindor?',
  'Binomial distribution concepts (conceptual).',
  '["1/4", "More than 0 but less than 1", "Exactly 1", "0"]'::jsonb,
  'More than 0 but less than 1',
  'medium'
),
-- 7. Easy - Series/Patterns
(
  'mcq',
  'Find the next term in the spell sequence: Lumos, Nox, Lumos, Nox, Lumos, ___?',
  'Pattern recognition.',
  '["Alohomora", "Lumos", "Nox", "Expelliarmus"]'::jsonb,
  'Nox',
  'easy'
),
-- 8. Hard - Logic/Permutation
(
  'mcq',
  'The Fat Lady needs a 3-word password. If she only accepts words from the list {Mimbulus, Mimbletonia, Caput, Draconis} and no word can be repeated, how many unique passwords can be formed?',
  'Permutations (nPr).',
  '["12", "24", "64", "6"]'::jsonb,
  '24',
  'hard'
),
-- 9. Medium - Logical Reasoning
(
  'mcq',
  'If all Hufflepuffs are hard workers, and Cedric is a Hufflepuff, which of the following MUST be true?',
  'Classic syllogism.',
  '["Cedric is a Prefect", "Cedric is a hard worker", "All hard workers are Hufflepuffs", "Hufflepuffs are never lazy"]'::jsonb,
  'Cedric is a hard worker',
  'medium'
),
-- 10. Easy - Math/Time
(
  'mcq',
  'The Hogwarts Express leaves Platform 9 3/4 at 11:00 AM. If it travels 400 miles at a speed of 80 mph, what time does it arrive at Hogsmeade?',
  'Time = Distance / Speed.',
  '["3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM"]'::jsonb,
  '4:00 PM',
  'easy'
),
-- 11. Hard - Cryptography/Patterns
(
  'mcq',
  'Decrypt this Rune cipher (Shift +3): "KDUUB".',
  'Caesar Cipher logic.',
  '["HARRY", "RONAL", "HERMIO", "MALFOY"]'::jsonb,
  'HARRY',
  'hard'
),
-- 12. Medium - Logic
(
  'mcq',
  'Professor McGonagall changes into a cat every Sunday. If today is Friday, how many days must pass before she transforms?',
  'Date logic.',
  '["1", "2", "3", "7"]'::jsonb,
  '2',
  'medium'
),
-- 13. Medium - Logic
(
  'mcq',
  'Three brooms (Firebolt, Nimbus, Comet) have different speeds. The Firebolt is faster than the Nimbus. The Comet is slower than the Nimbus. Which is the slowest broom?',
  'Relative ordering.',
  '["Firebolt", "Nimbus", "Comet", "Cannot be determined"]'::jsonb,
  'Comet',
  'medium'
),
-- 14. Hard - Advanced Logic
(
  'mcq',
  'Dumbledore has 5 socks in a drawer: 2 Red and 3 Blue. If he picks 2 socks blindly, what is the probability they are both Blue?',
  'Dependent probability.',
  '["3/10", "1/5", "2/5", "3/5"]'::jsonb,
  '3/10',
  'hard'
),
-- 15. Easy - Logic
(
  'mcq',
  'If "Wand" is coded as 41144, what is the sum of the digits used to code a wand in this mystery system?',
  'Pattern value summation.',
  '["14", "15", "10", "12"]'::jsonb,
  '14',
  'easy'
);
