-- Harden product_reviews RLS policy roles and checks
ALTER POLICY "Users can update their own reviews"
ON public.product_reviews
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

ALTER POLICY "Users can delete their own reviews"
ON public.product_reviews
TO authenticated
USING (auth.uid() = user_id);

-- Ensure no unintended privileges on the anonymized view
REVOKE ALL ON public.public_reviews FROM PUBLIC;
GRANT SELECT ON public.public_reviews TO anon;
GRANT SELECT ON public.public_reviews TO authenticated;