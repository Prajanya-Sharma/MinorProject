-- Create parking_events table to track sensor data
CREATE TABLE IF NOT EXISTS public.parking_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lot_id UUID NOT NULL REFERENCES public.parking_lots(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  spot_number TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('entry', 'exit', 'misparked', 'sensor_update')),
  sensor_data JSONB DEFAULT '{}',
  detected_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create penalties table for misparking charges
CREATE TABLE IF NOT EXISTS public.penalties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  lot_id UUID NOT NULL REFERENCES public.parking_lots(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  penalty_type TEXT NOT NULL CHECK (penalty_type IN ('misparking', 'overstay', 'other')),
  amount DECIMAL(10, 2) NOT NULL,
  reason TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'waived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  paid_at TIMESTAMP WITH TIME ZONE
);

-- Create push_subscriptions table for web push notifications
CREATE TABLE IF NOT EXISTS public.push_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, endpoint)
);

-- Create sensor_configs table to store ESP32 configurations
CREATE TABLE IF NOT EXISTS public.sensor_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lot_id UUID NOT NULL REFERENCES public.parking_lots(id) ON DELETE CASCADE,
  spot_number TEXT NOT NULL,
  sensor_id TEXT NOT NULL UNIQUE,
  api_key TEXT NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance')),
  last_heartbeat TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(lot_id, spot_number)
);

-- Enable RLS
ALTER TABLE public.parking_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.penalties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sensor_configs ENABLE ROW LEVEL SECURITY;

-- Parking events policies
CREATE POLICY "Lot owners can view events for their lots"
  ON public.parking_events FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.parking_lots
      WHERE parking_lots.id = parking_events.lot_id
      AND parking_lots.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view events for their bookings"
  ON public.parking_events FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.bookings
      WHERE bookings.id = parking_events.booking_id
      AND bookings.user_id = auth.uid()
    )
  );

-- Penalties policies
CREATE POLICY "Users can view their own penalties"
  ON public.penalties FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Lot owners can view penalties for their lots"
  ON public.penalties FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.parking_lots
      WHERE parking_lots.id = penalties.lot_id
      AND parking_lots.user_id = auth.uid()
    )
  );

-- Push subscriptions policies
CREATE POLICY "Users can manage their own push subscriptions"
  ON public.push_subscriptions FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Sensor configs policies
CREATE POLICY "Lot owners can manage sensor configs for their lots"
  ON public.sensor_configs FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.parking_lots
      WHERE parking_lots.id = sensor_configs.lot_id
      AND parking_lots.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.parking_lots
      WHERE parking_lots.id = sensor_configs.lot_id
      AND parking_lots.user_id = auth.uid()
    )
  );

-- Create indexes
CREATE INDEX idx_parking_events_lot_id ON public.parking_events(lot_id);
CREATE INDEX idx_parking_events_booking_id ON public.parking_events(booking_id);
CREATE INDEX idx_parking_events_detected_at ON public.parking_events(detected_at);
CREATE INDEX idx_penalties_booking_id ON public.penalties(booking_id);
CREATE INDEX idx_penalties_user_id ON public.penalties(user_id);
CREATE INDEX idx_push_subscriptions_user_id ON public.push_subscriptions(user_id);
CREATE INDEX idx_sensor_configs_lot_id ON public.sensor_configs(lot_id);
CREATE INDEX idx_sensor_configs_sensor_id ON public.sensor_configs(sensor_id);

-- Add vehicle_plate and vehicle_type columns to bookings if not exists
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS vehicle_plate TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS vehicle_type TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS vehicle_color TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS parking_status TEXT DEFAULT 'normal' CHECK (parking_status IN ('normal', 'misparked', 'overstay'));
