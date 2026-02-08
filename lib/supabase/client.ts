import { createClient } from '@supabase/supabase-js';

// Create a single supabase client for interacting with your database
// This client can be used in client components and API routes
export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);
