-- Migration: Create user_auth_limit table
-- Purpose: Track user authentication info updates (email/phone) with 7-day rate limiting
-- Created: 2024

-- Create the user_auth_limit table
CREATE TABLE IF NOT EXISTS public.user_auth_limit (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  last_auth_updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  CONSTRAINT unique_user_id UNIQUE(user_id)
);

-- Add comments for documentation
COMMENT ON TABLE public.user_auth_limit IS 'Tracks when users last updated their authentication information (email or phone) to enforce 7-day rate limiting';
COMMENT ON COLUMN public.user_auth_limit.id IS 'Primary key';
COMMENT ON COLUMN public.user_auth_limit.user_id IS 'Reference to auth.users, unique per user';
COMMENT ON COLUMN public.user_auth_limit.last_auth_updated_at IS 'Timestamp of the last email or phone update';
COMMENT ON COLUMN public.user_auth_limit.created_at IS 'Timestamp when the record was first created';

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_user_auth_limit_user_id
  ON public.user_auth_limit(user_id);

CREATE INDEX IF NOT EXISTS idx_user_auth_limit_updated_at
  ON public.user_auth_limit(last_auth_updated_at);

-- Enable Row Level Security (RLS)
ALTER TABLE public.user_auth_limit ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only read their own rate limit record
CREATE POLICY "Users can view their own auth limit"
  ON public.user_auth_limit
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policy: Service role can do everything (for server actions)
CREATE POLICY "Service role has full access"
  ON public.user_auth_limit
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- RLS Policy: Users cannot directly insert/update (only via server actions)
-- This prevents clients from bypassing the rate limit
CREATE POLICY "Users cannot directly modify auth limit"
  ON public.user_auth_limit
  FOR INSERT
  TO authenticated
  USING (false);

CREATE POLICY "Users cannot directly update auth limit"
  ON public.user_auth_limit
  FOR UPDATE
  TO authenticated
  USING (false);

-- Create a function to get days remaining for a user
CREATE OR REPLACE FUNCTION public.get_auth_update_days_remaining(p_user_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_last_update TIMESTAMP WITH TIME ZONE;
  v_days_since_update INTEGER;
  v_days_remaining INTEGER;
BEGIN
  -- Get the last update timestamp
  SELECT last_auth_updated_at INTO v_last_update
  FROM public.user_auth_limit
  WHERE user_id = p_user_id;

  -- If no record exists, user can update (return 0 days remaining)
  IF v_last_update IS NULL THEN
    RETURN 0;
  END IF;

  -- Calculate days since last update
  v_days_since_update := EXTRACT(DAY FROM NOW() - v_last_update)::INTEGER;

  -- Calculate days remaining
  v_days_remaining := 7 - v_days_since_update;

  -- Return 0 if negative (can update), otherwise return days remaining
  IF v_days_remaining < 0 THEN
    RETURN 0;
  ELSE
    RETURN v_days_remaining;
  END IF;
END;
$$;

COMMENT ON FUNCTION public.get_auth_update_days_remaining(UUID) IS
  'Returns the number of days remaining before a user can update their auth info again. Returns 0 if they can update.';

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated, service_role;
GRANT SELECT ON public.user_auth_limit TO authenticated;
GRANT ALL ON public.user_auth_limit TO service_role;
GRANT EXECUTE ON FUNCTION public.get_auth_update_days_remaining(UUID) TO authenticated, service_role;

-- Insert example/test data (optional, comment out for production)
-- INSERT INTO public.user_auth_limit (user_id, last_auth_updated_at)
-- VALUES ('00000000-0000-0000-0000-000000000000', NOW() - INTERVAL '8 days');
