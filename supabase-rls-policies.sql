-- RLS Policies for Graduation Portal
-- Run these commands in your Supabase SQL Editor

-- Enable RLS on tables
ALTER TABLE rsvp_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_subscriptions ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RSVP SUBMISSIONS TABLE POLICIES
-- ============================================================================

-- Policy 1: Allow anyone to INSERT new RSVP submissions
-- This allows public RSVP submissions without authentication
CREATE POLICY "Allow public RSVP submissions" ON rsvp_submissions
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- Policy 2: Allow users to SELECT their own RSVP by email
-- This enables the anti-spam check functionality
CREATE POLICY "Allow users to view their own RSVP" ON rsvp_submissions
FOR SELECT 
TO anon, authenticated
USING (true); -- Allow public read access for email checking

-- Policy 3: Allow authenticated users to UPDATE their own RSVP
-- This allows users to update their information
CREATE POLICY "Allow users to update their own RSVP" ON rsvp_submissions
FOR UPDATE 
TO authenticated
USING (auth.email() = email)
WITH CHECK (auth.email() = email);

-- Policy 4: Allow authenticated users to DELETE their own RSVP
-- This allows users to cancel their RSVP
CREATE POLICY "Allow users to delete their own RSVP" ON rsvp_submissions
FOR DELETE 
TO authenticated
USING (auth.email() = email);

-- ============================================================================
-- NOTIFICATION SUBSCRIPTIONS TABLE POLICIES
-- ============================================================================

-- Policy 1: Allow anyone to INSERT new notification subscriptions
CREATE POLICY "Allow public notification subscriptions" ON notification_subscriptions
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- Policy 2: Allow users to SELECT their own notifications
CREATE POLICY "Allow users to view their own notifications" ON notification_subscriptions
FOR SELECT 
TO anon, authenticated
USING (true); -- Allow public read access

-- Policy 3: Allow authenticated users to UPDATE their own notifications
CREATE POLICY "Allow users to update their own notifications" ON notification_subscriptions
FOR UPDATE 
TO authenticated
USING (auth.email() = email)
WITH CHECK (auth.email() = email);

-- Policy 4: Allow authenticated users to DELETE their own notifications
CREATE POLICY "Allow users to delete their own notifications" ON notification_subscriptions
FOR DELETE 
TO authenticated
USING (auth.email() = email);

-- ============================================================================
-- ADMIN POLICIES (Optional - for admin dashboard)
-- ============================================================================

-- Create an admin role function
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if user has admin role (you can customize this logic)
  -- For now, we'll allow any authenticated user to be admin
  -- In production, you might want to check against a specific admin list
  RETURN auth.role() = 'authenticated';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Admin policy for viewing all RSVPs (for admin dashboard)
CREATE POLICY "Allow admin to view all RSVPs" ON rsvp_submissions
FOR SELECT 
TO authenticated
USING (is_admin());

-- Admin policy for managing all RSVPs
CREATE POLICY "Allow admin to manage all RSVPs" ON rsvp_submissions
FOR ALL 
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- ============================================================================
-- ADDITIONAL SECURITY MEASURES
-- ============================================================================

-- Add unique constraint on email to prevent duplicates
-- (This should already exist, but adding for completeness)
ALTER TABLE rsvp_submissions 
ADD CONSTRAINT unique_email UNIQUE (email);

-- Add index on email for better performance
CREATE INDEX IF NOT EXISTS idx_rsvp_submissions_email 
ON rsvp_submissions(email);

-- Add index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_rsvp_submissions_created_at 
ON rsvp_submissions(created_at DESC);

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Check if RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('rsvp_submissions', 'notification_subscriptions');

-- Check existing policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename IN ('rsvp_submissions', 'notification_subscriptions'); 