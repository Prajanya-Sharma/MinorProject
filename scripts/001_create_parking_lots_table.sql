-- Create parking lots table
CREATE TABLE IF NOT EXISTS public.parking_lots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  total_spots INTEGER NOT NULL,
  available_spots INTEGER NOT NULL,
  price_per_hour DECIMAL(10, 2) NOT NULL,
  description TEXT,
  amenities JSONB DEFAULT '{"lighting": false, "cctv": false, "covered": false, "evCharging": false}',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance')),
  occupancy_rate DECIMAL(5, 2) DEFAULT 0,
  monthly_revenue DECIMAL(12, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE public.parking_lots ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view all active lots (for browsing)
CREATE POLICY "Anyone can view active lots"
  ON public.parking_lots FOR SELECT
  USING (status = 'active');

-- Policy: Users can view their own lots
CREATE POLICY "Users can view their own lots"
  ON public.parking_lots FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can create their own lots
CREATE POLICY "Users can create lots"
  ON public.parking_lots FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own lots
CREATE POLICY "Users can update their own lots"
  ON public.parking_lots FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own lots
CREATE POLICY "Users can delete their own lots"
  ON public.parking_lots FOR DELETE
  USING (auth.uid() = user_id);

-- Create index for user_id and status
CREATE INDEX idx_parking_lots_user_id ON public.parking_lots(user_id);
CREATE INDEX idx_parking_lots_status ON public.parking_lots(status);
