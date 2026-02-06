import { createClient } from '@supabase/supabase-js';

// Server-side client with service role key for admin operations
// Use this ONLY in server components, API routes, and server actions
// DO NOT use in client components - it has elevated privileges
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);
