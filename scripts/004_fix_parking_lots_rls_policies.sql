-- Drop existing conflicting SELECT policies
DROP POLICY IF EXISTS "Anyone can view active lots" ON public.parking_lots;
DROP POLICY IF EXISTS "Users can view their own lots" ON public.parking_lots;

-- Create a single comprehensive SELECT policy that allows:
-- 1. Anyone (authenticated or not) to view active lots for browsing
-- 2. Users to view their own lots regardless of status
CREATE POLICY "View active lots or own lots"
  ON public.parking_lots FOR SELECT
  USING (
    status = 'active' 
    OR 
    (auth.uid() IS NOT NULL AND auth.uid() = user_id)
  );
