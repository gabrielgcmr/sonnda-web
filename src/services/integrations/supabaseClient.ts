// src/services/integrations/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'
import { env } from '../../config/env'

export const supabase = createClient(env.supabaseUrl, env.supabaseAnonKey, {
  auth: {
    persistSession: true,
    storage: globalThis.localStorage,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})
