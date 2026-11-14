import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://imyrifehrmawbotbvlnr.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_U3eWMyvUm6VfJS-DluaV7g_C_muFs6V'

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)
