-- Fix mercybridge_contributions foreign key relationship
-- The sponsor_id should reference profiles.id for proper joins

-- First, drop the existing foreign key constraint
ALTER TABLE mercybridge_contributions 
DROP CONSTRAINT IF EXISTS mercybridge_contributions_sponsor_id_fkey;

-- Add new foreign key to profiles table
ALTER TABLE mercybridge_contributions
ADD CONSTRAINT mercybridge_contributions_sponsor_id_fkey 
FOREIGN KEY (sponsor_id) REFERENCES profiles(id) ON DELETE SET NULL;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_contributions_sponsor_profiles 
ON mercybridge_contributions(sponsor_id);

-- Update RLS policies to work with profiles
DROP POLICY IF EXISTS contributions_select_own ON mercybridge_contributions;
CREATE POLICY "contributions_select_own" ON mercybridge_contributions
  FOR SELECT USING (
    sponsor_id = auth.uid() 
    OR EXISTS (
      SELECT 1 FROM profiles p 
      WHERE p.id = sponsor_id AND p.id = auth.uid()
    )
  );

-- Ensure profiles table has the necessary fields for the join
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS display_name TEXT;

-- Add comment for documentation
COMMENT ON COLUMN mercybridge_contributions.sponsor_id IS 'References profiles.id for sponsor information';
