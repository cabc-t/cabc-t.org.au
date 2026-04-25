-- 1. Remove the NOT NULL constraint from day, time, and location
ALTER TABLE public.event_translations 
  ALTER COLUMN day_text DROP NOT NULL,
  ALTER COLUMN time_text DROP NOT NULL,
  ALTER COLUMN location DROP NOT NULL;

-- 2. Modify the 'locale' column:
-- First, remove any existing default if it exists
ALTER TABLE public.event_translations 
  ALTER COLUMN locale SET DEFAULT 'en';

-- Change the type to VARCHAR(2) and ensure it is NOT NULL
ALTER TABLE public.event_translations 
  ALTER COLUMN locale TYPE VARCHAR(2),
  ALTER COLUMN locale SET NOT NULL;

-- 3. Add the Check Constraint
-- Note: You asked for "CHECK (language IN...)", but the column name is "locale". 
-- I have corrected it to "locale" to match your schema.
ALTER TABLE public.event_translations 
  ADD CONSTRAINT check_valid_locale 
  CHECK (locale IN ('en', 'tc', 'sc'));
