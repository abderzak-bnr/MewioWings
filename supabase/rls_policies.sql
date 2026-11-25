-- ==============================================================================
-- WINGO! (MewioWings) — Supabase PostgreSQL Row Level Security (RLS) Policies
-- Ready-to-run in Supabase SQL Editor
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. ENABLE ROW LEVEL SECURITY ON ALL TABLES
-- ------------------------------------------------------------------------------
ALTER TABLE IF EXISTS public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.store_settings ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- 2. POLICIES FOR "orders" TABLE
--    - Public (anon): can INSERT orders only (cannot read, edit, or delete orders)
--    - Admin (authenticated): full SELECT, INSERT, UPDATE, DELETE
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public can submit new orders" ON public.orders;
DROP POLICY IF EXISTS "Public cannot read orders" ON public.orders;
DROP POLICY IF EXISTS "Admins have full access to orders" ON public.orders;

-- Anon can create new orders (order submission)
CREATE POLICY "Public can submit new orders"
  ON public.orders
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Authenticated admins can view, update, and manage all orders
CREATE POLICY "Admins have full access to orders"
  ON public.orders
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Note: No SELECT policy for 'anon' means customer order privacy is preserved;
-- anonymous visitors cannot query or read other customers' orders, addresses, or phone numbers.


-- ------------------------------------------------------------------------------
-- 3. POLICIES FOR "menu_items" TABLE
--    - Public (anon): can SELECT menu items to view the storefront menu
--    - Admin (authenticated): full SELECT, INSERT, UPDATE, DELETE
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public can view menu items" ON public.menu_items;
DROP POLICY IF EXISTS "Admins have full access to menu items" ON public.menu_items;

-- Public can read menu items to display sauces, dips, sides, and ready boxes
CREATE POLICY "Public can view menu items"
  ON public.menu_items
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Authenticated admins can insert, update, or delete menu items
CREATE POLICY "Admins have full access to menu items"
  ON public.menu_items
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);


-- ------------------------------------------------------------------------------
-- 4. POLICIES FOR "store_settings" TABLE
--    - Public (anon): can SELECT store settings (open/closed, delivery fee)
--    - Admin (authenticated): full SELECT, INSERT, UPDATE, DELETE
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public can view store settings" ON public.store_settings;
DROP POLICY IF EXISTS "Admins have full access to store settings" ON public.store_settings;

-- Public can read store settings to check is_open and delivery_fee
CREATE POLICY "Public can view store settings"
  ON public.store_settings
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Authenticated admins can update store settings
CREATE POLICY "Admins have full access to store settings"
  ON public.store_settings
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);


-- ------------------------------------------------------------------------------
-- 5. OPTIONAL: STRICT ADMIN EMAIL RESTRICTION (Lockdown Mode)
--    If you wish to restrict admin operations strictly to your specific email,
--    replace 'YOUR_ADMIN_EMAIL@example.com' and uncomment the policies below:
-- ------------------------------------------------------------------------------
/*
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN (
    auth.role() = 'authenticated' AND
    (auth.jwt() ->> 'email') = 'ali.boubn1@example.com'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Example replacing generic authenticated policy with strict email check:
-- DROP POLICY IF EXISTS "Admins have full access to orders" ON public.orders;
-- CREATE POLICY "Strict admin access to orders"
--   ON public.orders FOR ALL
--   TO authenticated
--   USING (public.is_admin())
--   WITH CHECK (public.is_admin());
*/


-- ------------------------------------------------------------------------------
-- 6. STORAGE BUCKET POLICIES ("menu-images")
--    - Public: read/download images
--    - Admin (authenticated): upload, update, delete images
-- ------------------------------------------------------------------------------
-- Ensure bucket exists and is public
INSERT INTO storage.buckets (id, name, public)
VALUES ('menu-images', 'menu-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public can view menu images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload menu images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update menu images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete menu images" ON storage.objects;

-- Public can view/download uploaded images
CREATE POLICY "Public can view menu images"
  ON storage.objects
  FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'menu-images');

-- Only authenticated admins can upload images
CREATE POLICY "Admins can upload menu images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'menu-images');

-- Only authenticated admins can update images
CREATE POLICY "Admins can update menu images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'menu-images');

-- Only authenticated admins can delete images
CREATE POLICY "Admins can delete menu images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'menu-images');
