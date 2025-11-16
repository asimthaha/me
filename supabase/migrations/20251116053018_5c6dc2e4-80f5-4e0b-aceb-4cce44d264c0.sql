-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Anyone can submit contact form" ON contact_submissions;

-- Create a new PERMISSIVE policy that allows public inserts
CREATE POLICY "Anyone can submit contact form"
ON contact_submissions
FOR INSERT
TO public
WITH CHECK (true);