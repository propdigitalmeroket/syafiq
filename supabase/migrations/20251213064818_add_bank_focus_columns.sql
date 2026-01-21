/*
  # Add Bank Focus and Notes Columns

  1. Changes
    - Add `primary_focus` column (text array) - List of employment types that are primary target for this bank
    - Add `secondary_focus` column (text array) - List of employment types that are secondary target for this bank
    - Add `notes` column (text) - Additional information about the bank's preferences and characteristics
  
  2. Purpose
    - Better categorize banks based on their target employment types
    - Provide more detailed information to help users choose the right bank
    - Improve bank recommendation accuracy
*/

-- Add three new columns to Recommended Banks table
ALTER TABLE "Recommended Banks" 
ADD COLUMN IF NOT EXISTS primary_focus text[] DEFAULT ARRAY[]::text[],
ADD COLUMN IF NOT EXISTS secondary_focus text[] DEFAULT ARRAY[]::text[],
ADD COLUMN IF NOT EXISTS notes text DEFAULT '';

-- Update Maybank
UPDATE "Recommended Banks" 
SET 
  primary_focus = ARRAY['Fixed Salary', 'Government Employee'],
  secondary_focus = ARRAY['Commission Based'],
  notes = 'Paling mesra untuk Fixed Salary dan Government Employee. Mudah dapat approval untuk profil stabil.'
WHERE bank_name = 'Maybank';

-- Update Hong Leong Bank
UPDATE "Recommended Banks" 
SET 
  primary_focus = ARRAY['Fixed Salary', 'Commission Based'],
  secondary_focus = ARRAY['Self Employed', 'Government Employee'],
  notes = 'Lebih practical untuk Commission Based dan sangat mesra Fixed Salary.'
WHERE bank_name = 'Hong Leong Bank';

-- Update Public Bank
UPDATE "Recommended Banks" 
SET 
  primary_focus = ARRAY['Fixed Salary', 'Government Employee'],
  secondary_focus = ARRAY['Commission Based', 'Self Employed'],
  notes = 'Tetap no.1 untuk profil stabil. Keras tapi lulus kalau betul untuk self-employed.'
WHERE bank_name = 'Public Bank';

-- Update Alliance Bank
UPDATE "Recommended Banks" 
SET 
  primary_focus = ARRAY['Fixed Salary', 'Self Employed'],
  secondary_focus = ARRAY['Commission Based'],
  notes = 'Mesra Fixed Salary dan Self Employed.'
WHERE bank_name = 'Alliance Bank';

-- Update AmBank
UPDATE "Recommended Banks" 
SET 
  primary_focus = ARRAY['Fixed Salary', 'Self Employed'],
  secondary_focus = ARRAY['Commission Based'],
  notes = 'Mesra Fixed Salary dan Self Employed.'
WHERE bank_name = 'AmBank';

-- Update RHB Bank
UPDATE "Recommended Banks" 
SET 
  primary_focus = ARRAY['Fixed Salary'],
  secondary_focus = ARRAY['Commission Based'],
  notes = 'Paling mesra Fixed Salary. Approval cepat untuk gaji tetap.'
WHERE bank_name = 'RHB Bank';

-- Update BSN
UPDATE "Recommended Banks" 
SET 
  primary_focus = ARRAY['Government Employee', 'Self Employed'],
  secondary_focus = ARRAY['Fixed Salary'],
  notes = 'Favour penjawat awam dan self-employed. Kadar kompetitif untuk kakitangan kerajaan.'
WHERE bank_name = 'BSN';

-- Update CIMB Bank
UPDATE "Recommended Banks" 
SET 
  primary_focus = ARRAY['Commission Based', 'Government Employee'],
  secondary_focus = ARRAY['Self Employed', 'Fixed Salary'],
  notes = 'Lebih practical untuk Commission Based dan Government Employee. Approval flexible.'
WHERE bank_name = 'CIMB Bank';

-- Update Bank Islam
UPDATE "Recommended Banks" 
SET 
  primary_focus = ARRAY['Self Employed', 'Government Employee'],
  secondary_focus = ARRAY['Fixed Salary'],
  notes = 'Mesra Self Employed dan Government Employee. Islamic banking compliance.'
WHERE bank_name = 'Bank Islam';

-- Update UOB Malaysia
UPDATE "Recommended Banks" 
SET 
  primary_focus = ARRAY['Commission Based'],
  secondary_focus = ARRAY['Fixed Salary'],
  notes = 'Picky, suka high income & strong profile. Kadar menarik tapi strict requirements.'
WHERE bank_name = 'UOB Malaysia';

-- Update MBSB Bank
UPDATE "Recommended Banks" 
SET 
  primary_focus = ARRAY['Self Employed'],
  secondary_focus = ARRAY['Fixed Salary'],
  notes = 'Niche untuk self-employed. Rate biasanya lebih tinggi dan approval lambat, tapi lebih flexible dengan dokumen.'
WHERE bank_name = 'MBSB Bank';

-- Update Affin Bank
UPDATE "Recommended Banks" 
SET 
  primary_focus = ARRAY['Fixed Salary'],
  secondary_focus = ARRAY['Commission Based'],
  notes = 'Mesra Fixed Salary. Standard approval process.'
WHERE bank_name = 'Affin Bank';

-- Update LPPSA
UPDATE "Recommended Banks" 
SET 
  primary_focus = ARRAY['Government Employee'],
  secondary_focus = ARRAY[]::text[],
  notes = 'Khusus untuk kakitangan kerajaan sahaja. Kadar faedah kompetitif 4% dan DSR maksimum 60%.'
WHERE bank_name = 'LPPSA';

-- Add missing banks if they don't exist

-- Insert HSBC if not exists
INSERT INTO "Recommended Banks" (
  bank_name, 
  interest_rate_min, 
  interest_rate_max, 
  employment_types,
  min_income,
  max_dsr,
  primary_focus,
  secondary_focus,
  notes
)
SELECT 
  'HSBC',
  3.80,
  4.70,
  ARRAY['Fixed Salary'],
  3000,
  70,
  ARRAY['Fixed Salary'],
  ARRAY[]::text[],
  'Paling mesra Fixed Salary. Bank antarabangsa dengan standard tinggi.'
WHERE NOT EXISTS (
  SELECT 1 FROM "Recommended Banks" WHERE bank_name = 'HSBC'
);

-- Insert Bank Rakyat if not exists
INSERT INTO "Recommended Banks" (
  bank_name, 
  interest_rate_min, 
  interest_rate_max, 
  employment_types,
  min_income,
  max_dsr,
  primary_focus,
  secondary_focus,
  notes
)
SELECT 
  'Bank Rakyat',
  3.65,
  4.60,
  ARRAY['Government Employee', 'Fixed Salary'],
  2000,
  70,
  ARRAY['Government Employee'],
  ARRAY['Fixed Salary'],
  'Memang favour penjawat awam. Proses approval cepat untuk kakitangan kerajaan.'
WHERE NOT EXISTS (
  SELECT 1 FROM "Recommended Banks" WHERE bank_name = 'Bank Rakyat'
);

-- Insert Standard Chartered if not exists
INSERT INTO "Recommended Banks" (
  bank_name, 
  interest_rate_min, 
  interest_rate_max, 
  employment_types,
  min_income,
  max_dsr,
  primary_focus,
  secondary_focus,
  notes
)
SELECT 
  'Standard Chartered',
  3.90,
  4.85,
  ARRAY['Commission Based', 'Fixed Salary'],
  5000,
  70,
  ARRAY['Commission Based'],
  ARRAY['Fixed Salary'],
  'Picky, suka high income & strong profile. Minimum income tinggi tapi kadar kompetitif.'
WHERE NOT EXISTS (
  SELECT 1 FROM "Recommended Banks" WHERE bank_name = 'Standard Chartered'
);

-- Insert OCBC if not exists
INSERT INTO "Recommended Banks" (
  bank_name, 
  interest_rate_min, 
  interest_rate_max, 
  employment_types,
  min_income,
  max_dsr,
  primary_focus,
  secondary_focus,
  notes
)
SELECT 
  'OCBC',
  3.85,
  4.75,
  ARRAY['Commission Based', 'Fixed Salary'],
  4500,
  70,
  ARRAY['Commission Based'],
  ARRAY['Fixed Salary'],
  'Picky, suka high income & strong profile. Approval strict tapi service baik.'
WHERE NOT EXISTS (
  SELECT 1 FROM "Recommended Banks" WHERE bank_name = 'OCBC'
);