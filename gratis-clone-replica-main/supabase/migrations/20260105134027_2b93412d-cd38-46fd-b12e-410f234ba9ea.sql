-- Fix PUBLIC_DATA_EXPOSURE: Prize codes exposed to all users
-- Drop the overly permissive SELECT policy
DROP POLICY IF EXISTS "Users can check if their code is valid" ON secret_cap_prizes;

-- Create restrictive policy: users can only see prizes they have claimed
CREATE POLICY "Users can view their claimed prizes"
  ON secret_cap_prizes FOR SELECT
  USING (auth.uid() = claimed_by);

-- Create secure RPC function to validate a prize code (returns boolean only)
CREATE OR REPLACE FUNCTION public.validate_prize_code(code_input TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS(
    SELECT 1 FROM secret_cap_prizes 
    WHERE code = code_input 
    AND claimed = false 
    AND (expiry_date IS NULL OR expiry_date >= CURRENT_DATE)
  );
$$;

-- Create secure RPC function to claim a prize (atomic operation)
CREATE OR REPLACE FUNCTION public.claim_prize(code_input TEXT)
RETURNS TABLE(
  success BOOLEAN,
  prize_title TEXT,
  prize_description TEXT,
  prize_value TEXT,
  prize_type TEXT,
  error_message TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_prize_id UUID;
  v_prize_title TEXT;
  v_prize_description TEXT;
  v_prize_value TEXT;
  v_prize_type TEXT;
BEGIN
  -- Check if user is authenticated
  IF auth.uid() IS NULL THEN
    RETURN QUERY SELECT false, NULL::TEXT, NULL::TEXT, NULL::TEXT, NULL::TEXT, 'Authentication required'::TEXT;
    RETURN;
  END IF;

  -- Find and lock the prize row
  SELECT id, secret_cap_prizes.prize_title, secret_cap_prizes.prize_description, 
         secret_cap_prizes.prize_value, secret_cap_prizes.prize_type
  INTO v_prize_id, v_prize_title, v_prize_description, v_prize_value, v_prize_type
  FROM secret_cap_prizes
  WHERE code = code_input 
    AND claimed = false 
    AND (expiry_date IS NULL OR expiry_date >= CURRENT_DATE)
  FOR UPDATE SKIP LOCKED;

  -- Check if prize was found
  IF v_prize_id IS NULL THEN
    RETURN QUERY SELECT false, NULL::TEXT, NULL::TEXT, NULL::TEXT, NULL::TEXT, 'Invalid or already claimed code'::TEXT;
    RETURN;
  END IF;

  -- Claim the prize
  UPDATE secret_cap_prizes
  SET claimed = true,
      claimed_by = auth.uid(),
      claimed_at = now()
  WHERE id = v_prize_id;

  -- Create claim record
  INSERT INTO prize_claims (user_id, prize_id, code_entered, claim_status)
  VALUES (auth.uid(), v_prize_id, code_input, 'claimed');

  -- Return success with prize details
  RETURN QUERY SELECT true, v_prize_title, v_prize_description, v_prize_value, v_prize_type, NULL::TEXT;
END;
$$;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION public.validate_prize_code(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.claim_prize(TEXT) TO authenticated;