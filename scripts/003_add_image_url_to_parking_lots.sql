-- Add image_url column to parking_lots table if it doesn't exist
ALTER TABLE public.parking_lots
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Create index for image_url
CREATE INDEX IF NOT EXISTS idx_parking_lots_image_url ON public.parking_lots(image_url);
