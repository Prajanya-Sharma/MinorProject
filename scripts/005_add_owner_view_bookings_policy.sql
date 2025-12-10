-- Allow parking lot owners to view bookings for their lots
CREATE POLICY "Owners can view bookings for their lots"
  ON public.bookings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.parking_lots
      WHERE parking_lots.id = bookings.lot_id
      AND parking_lots.user_id = auth.uid()
    )
  );
