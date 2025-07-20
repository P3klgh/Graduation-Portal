-- Graduation Portal Database Setup
-- Run this in your Supabase SQL editor

-- Create RSVP submissions table
CREATE TABLE rsvp_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  dietary_restrictions TEXT,
  plus_one BOOLEAN DEFAULT FALSE,
  plus_one_name TEXT,
  graduation_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notifications table for tracking sent emails
CREATE TABLE notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  notification_type TEXT NOT NULL CHECK (notification_type IN ('graduation_reminder', 'event_update', 'general')),
  subject TEXT,
  message TEXT,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE rsvp_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations (for demo purposes)
-- In production, you should implement proper authentication
CREATE POLICY "Allow all operations on rsvp_submissions" ON rsvp_submissions
  FOR ALL USING (true);

CREATE POLICY "Allow all operations on notifications" ON notifications
  FOR ALL USING (true);

-- Create indexes for better performance
CREATE INDEX idx_rsvp_submissions_email ON rsvp_submissions(email);
CREATE INDEX idx_rsvp_submissions_created_at ON rsvp_submissions(created_at);
CREATE INDEX idx_notifications_email ON notifications(email);
CREATE INDEX idx_notifications_sent_at ON notifications(sent_at);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_rsvp_submissions_updated_at 
    BEFORE UPDATE ON rsvp_submissions 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data (optional)
INSERT INTO rsvp_submissions (first_name, last_name, email, phone, graduation_date, plus_one, plus_one_name, dietary_restrictions) VALUES
('John', 'Doe', 'john.doe@example.com', '+1234567890', '2024-06-15', true, 'Jane Doe', 'Vegetarian'),
('Alice', 'Smith', 'alice.smith@example.com', '+1234567891', '2024-06-15', false, NULL, NULL),
('Bob', 'Johnson', 'bob.johnson@example.com', '+1234567892', '2024-06-15', true, 'Mary Johnson', 'Gluten-free'); 