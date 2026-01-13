/*
  # Remove employment_types Column

  1. Changes
    - Drop `employment_types` column from Recommended Banks table
  
  2. Purpose
    - Remove redundant data - now using primary_focus and secondary_focus exclusively
    - Cleaner data model with single source of truth for bank employment targeting
    - Improve maintainability by eliminating duplicate information
  
  3. Notes
    - This is a safe operation as the focus columns (primary_focus, secondary_focus) already contain all necessary employment type information
    - Application logic has been refactored to use focus fields instead
*/

-- Drop the employment_types column as it's now redundant
ALTER TABLE "Recommended Banks" 
DROP COLUMN IF EXISTS employment_types;