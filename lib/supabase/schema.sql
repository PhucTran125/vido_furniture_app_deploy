-- Products Table Schema for VIDO Furniture
-- Run this in your Supabase SQL Editor

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  item_no TEXT UNIQUE NOT NULL,
  
  -- Bilingual names
  name_en TEXT NOT NULL,
  name_vi TEXT NOT NULL,
  
  -- Category
  category TEXT NOT NULL,
  
  -- Image path
  image TEXT,
  
  -- Descriptions (arrays for bullet points)
  description_en TEXT[],
  description_vi TEXT[],
  
  -- Dimensions stored as JSONB for flexibility
  -- Example: { "width": "120cm", "depth": "40cm", "height": "45cm" }
  dimensions JSONB,
  
  -- Material stored as JSONB
  -- Example: { "frame": "Steel", "upholstery": "Fabric" }
  material JSONB,
  
  -- Set components (optional, for multi-piece products)
  -- Example: { "ottoman": "2 pieces", "cushion": "4 pieces" }
  set_components JSONB,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_item_no ON products(item_no);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read products (public access)
CREATE POLICY "Public products are viewable by everyone"
  ON products
  FOR SELECT
  USING (true);

-- Policy: Authenticated users can insert products
-- (We'll refine this later with proper admin authentication)
CREATE POLICY "Authenticated users can insert products"
  ON products
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Policy: Authenticated users can update products
CREATE POLICY "Authenticated users can update products"
  ON products
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Policy: Authenticated users can delete products
CREATE POLICY "Authenticated users can delete products"
  ON products
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE products IS 'VIDO Furniture product catalog';
COMMENT ON COLUMN products.slug IS 'URL-friendly identifier generated from name';
COMMENT ON COLUMN products.dimensions IS 'Product dimensions in JSONB format';
COMMENT ON COLUMN products.material IS 'Material composition in JSONB format';
COMMENT ON COLUMN products.set_components IS 'Components for multi-piece sets';
