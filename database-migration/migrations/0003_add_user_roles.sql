CREATE TABLE user_roles (
  user_id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  role TEXT DEFAULT 'user'
);

-- Enable RLS
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- AO Insert Access: Only users with the 'AO' role can insert
CREATE POLICY "AO can insert announcements" 
ON announcements FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() AND role = 'AO'
  )
);
