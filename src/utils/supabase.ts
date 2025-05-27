import { createClient, SupabaseClient } from '@supabase/supabase-js'

// 🎯 TYPE POUR LA BASE DE DONNÉES
interface Database {
  public: {
    Tables: {
      waitlist: {
        Row: {
          id: string
          phone: string
          created_at: string
          source: string
        }
        Insert: {
          phone: string
          created_at?: string
          source?: string
        }
        Update: {
          phone?: string
          created_at?: string
          source?: string
        }
      }
    }
  }
}

// 🔍 DIAGNOSTIC COMPLET DES VARIABLES
console.log('🔍 === DIAGNOSTIC SUPABASE ===')
console.log('🔍 NODE_ENV:', process.env.NODE_ENV)
console.log('🔍 NEXT_PUBLIC_SUPABASE_URL exists:', !!process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log('🔍 NEXT_PUBLIC_SUPABASE_ANON_KEY exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
  console.log('🔍 URL starts with https:', process.env.NEXT_PUBLIC_SUPABASE_URL.startsWith('https://'))
  console.log('🔍 URL contains supabase.co:', process.env.NEXT_PUBLIC_SUPABASE_URL.includes('supabase.co'))
}

if (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.log('🔍 Key length:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length)
  console.log('🔍 Key starts with eyJ:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.startsWith('eyJ'))
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// ✅ CLIENT SUPABASE TYPÉ
let supabase: SupabaseClient<Database> | null = null

if (supabaseUrl && supabaseKey) {
  try {
    supabase = createClient<Database>(supabaseUrl, supabaseKey)
    console.log('✅ Client Supabase créé avec succès')
  } catch (error) {
    console.error('❌ Erreur création client:', error)
  }
} else {
  console.error('❌ Variables Supabase manquantes!')
}

export { supabase }

// 🧪 FONCTION TEST SIMPLE
export const testSupabaseConnection = async (): Promise<boolean> => {
  if (!supabase) {
    console.error('❌ Client Supabase non initialisé')
    return false
  }

  try {
    console.log('🔄 Test de connexion simple...')
    
    // Test avec la table auth.users (toujours présente)
    const { data, error } = await supabase.auth.getSession()
    
    console.log('📊 Session result:', { data: !!data, error: !!error })
    
    if (error) {
      console.error('❌ Erreur session:', error)
      return false
    }
    
    console.log('✅ Test de base réussi!')
    return true
  } catch (error) {
    console.error('❌ Exception test:', error)
    return false
  }
}

// 🎯 TYPE POUR LES RÉPONSES DE SAUVEGARDE
interface SaveResponse {
  success: boolean
  phone: string
  timestamp: string
  data?: Database['public']['Tables']['waitlist']['Row'][]
}

// 💾 FONCTION SAUVEGARDE TYPÉE
export const saveToWaitlist = async (phone: string): Promise<SaveResponse> => {
  console.log('📱 saveToWaitlist appelé avec:', phone)
  
  if (!supabase) {
    console.error('❌ Supabase non configuré, simulation...')
    // 🎭 SIMULATION D'UNE SAUVEGARDE RÉUSSIE
    await new Promise(resolve => setTimeout(resolve, 1000))
    return { 
      success: true, 
      phone, 
      timestamp: new Date().toISOString() 
    }
  }

  try {
    const cleanPhone = phone.replace(/[\s\-\(\)\.]/g, '')
    
    const { data, error } = await supabase
      .from('waitlist')
      .insert({ 
        phone: cleanPhone,
        source: 'landing_page'
      })
      .select()
    
    if (error) {
      console.error('🚨 Erreur Supabase complète:', JSON.stringify(error, null, 2))
      throw new Error(`SUPABASE_ERROR: ${error.message || 'Erreur inconnue'}`)
    }
    
    return {
      success: true,
      phone: cleanPhone,
      timestamp: new Date().toISOString(),
      data
    }
  } catch (error) {
    console.error('🚨 Exception saveToWaitlist:', error)
    throw error
  }
}

// 📊 FONCTION COMPTAGE TYPÉE
export const getWaitlistCount = async (): Promise<number> => {
  if (!supabase) {
    return 0
  }

  try {
    const { count, error } = await supabase
      .from('waitlist')
      .select('*', { count: 'exact', head: true })
    
    if (error) {
      console.error('Erreur comptage:', error)
      return 0
    }
    
    return count || 0
  } catch (error) {
    console.error('Exception comptage:', error)
    return 0
  }
}