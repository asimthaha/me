-- Create contact_submissions table
CREATE TABLE public.contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT,
  ip_address TEXT,
  user_agent TEXT,
  recaptcha_token TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived', 'spam')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Validation constraints
  CONSTRAINT valid_name_length CHECK (char_length(name) >= 2 AND char_length(name) <= 100),
  CONSTRAINT valid_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$'),
  CONSTRAINT valid_message_length CHECK (message IS NULL OR char_length(message) <= 5000)
);

-- Create indexes for common queries
CREATE INDEX idx_contact_submissions_created_at ON public.contact_submissions(created_at DESC);
CREATE INDEX idx_contact_submissions_status ON public.contact_submissions(status);
CREATE INDEX idx_contact_submissions_email ON public.contact_submissions(email);

-- Enable Row Level Security
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Public can insert (submit forms)
CREATE POLICY "Anyone can submit contact form"
  ON public.contact_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- RLS Policy: Only service role can read (for admin dashboard later)
CREATE POLICY "Service role can read all submissions"
  ON public.contact_submissions
  FOR SELECT
  TO service_role
  USING (true);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.contact_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Add comment for documentation
COMMENT ON TABLE public.contact_submissions IS 'Stores contact form submissions from the portfolio website with email notification tracking';