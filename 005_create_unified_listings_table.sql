-- Create unified listings table that matches the component expectations
CREATE TABLE IF NOT EXISTS public.listings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name VARCHAR(255) NOT NULL,  -- Component expects 'name', not 'title'
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  category VARCHAR(100) NOT NULL,
  condition VARCHAR(50) NOT NULL DEFAULT 'Good',
  status VARCHAR(50) NOT NULL DEFAULT 'Active',
  image_url TEXT,
  location VARCHAR(255),
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for listings
CREATE POLICY "Users can view all active listings" ON public.listings
  FOR SELECT USING (status = 'Active' OR user_id = auth.uid());

CREATE POLICY "Users can insert their own listings" ON public.listings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own listings" ON public.listings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own listings" ON public.listings
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_listings_user_id ON public.listings(user_id);
CREATE INDEX IF NOT EXISTS idx_listings_status ON public.listings(status);
CREATE INDEX IF NOT EXISTS idx_listings_category ON public.listings(category);

-- Insert sample data for testing
INSERT INTO public.listings (user_id, name, description, price, category, condition, image_url, status, views) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Vintage Leather Jacket', 'Classic brown leather jacket in excellent condition', 89.99, 'Fashion', 'Like New', '/vintage-leather-jacket.png', 'Active', 15),
  ('00000000-0000-0000-0000-000000000001', 'Bamboo Water Bottle', 'Eco-friendly bamboo water bottle, 500ml capacity', 24.99, 'Home & Garden', 'New', '/bamboo-water-bottle.jpg', 'Active', 8),
  ('00000000-0000-0000-0000-000000000002', 'iPhone 12 Pro', 'Gently used iPhone 12 Pro, 128GB, unlocked', 599.99, 'Electronics', 'Good', '/iphone-12-pro.png', 'Active', 23),
  ('00000000-0000-0000-0000-000000000002', 'Wooden Phone Stand', 'Handcrafted wooden phone stand for desk', 15.99, 'Electronics', 'Like New', '/wooden-phone-stand.jpg', 'Active', 5)
ON CONFLICT DO NOTHING;
