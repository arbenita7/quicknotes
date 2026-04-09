import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://mjjefuohloukxvcrglwg.supabase.co"
const supabaseAnonKey = "sb_publishable_Q5WiPFcoJPsODrA-_8aI6g_dm0rNVhh"
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
)
