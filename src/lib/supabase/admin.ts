import { createClient } from '@supabase/supabase-js';
import { getSupabaseConfig, getSupabaseSecretKey } from './config';

export function createSupabaseAdminClient() {
  const { url } = getSupabaseConfig();

  return createClient(url, getSupabaseSecretKey(), {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });
}
