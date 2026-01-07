-- Harden profiles RLS: ensure updates cannot change ownership
-- Add WITH CHECK to the existing UPDATE policy so users can only write rows where they are the owner
ALTER POLICY "Users can update their own profile"
ON public.profiles
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
