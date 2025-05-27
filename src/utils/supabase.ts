// src/utils/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

// Helper functions
export const saveToWaitlist = async (phone: string) => {
  const { data, error } = await supabase
    .from('waitlist')
    .insert({ phone })
    .select()
  
  if (error) throw error
  return data
}

export const getWaitlistCount = async () => {
  const { count, error } = await supabase
    .from('waitlist')
    .select('*', { count: 'exact', head: true })
  
  if (error) throw error
  return count || 0
}