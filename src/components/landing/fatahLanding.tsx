'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { saveToWaitlist, testSupabaseConnection } from '@/utils/supabase'

// 🎯 POSITIONS FIXES POUR ÉVITER L'ERREUR D'HYDRATATION
const FLOATING_ELEMENTS = [
  { left: 10, top: 20 }, { left: 80, top: 30 }, { left: 25, top: 60 },
  { left: 90, top: 10 }, { left: 15, top: 80 }, { left: 60, top: 40 },
  { left: 40, top: 70 }, { left: 95, top: 85 }, { left: 5, top: 50 },
  { left: 70, top: 15 }, { left: 30, top: 90 }, { left: 85, top: 25 },
  { left: 50, top: 5 }, { left: 20, top: 45 }, { left: 75, top: 65 }
]

// 📱 VALIDATION NUMÉRO TÉLÉPHONE CÔTE D'IVOIRE
const validateIvorianPhone = (phone: string): boolean => {
  const cleanPhone = phone.replace(/[\s\-\(\)\.]/g, '')
  
  // 🇨🇮 PATTERNS CÔTE D'IVOIRE
  const patterns = [
    /^(\+225|00225)?[0-9]{10}$/,    // +225 + 10 chiffres
    /^(07|05|01)[0-9]{8}$/,         // 07/05/01 + 8 chiffres
    /^[0-9]{10}$/                   // 10 chiffres direct
  ]
  
  return patterns.some(pattern => pattern.test(cleanPhone))
}

// 🎨 FORMATAGE VISUEL DU NUMÉRO
const formatPhoneDisplay = (phone: string): string => {
  const cleanPhone = phone.replace(/[\s\-\(\)\.]/g, '')
  
  if (cleanPhone.length >= 2) {
    return cleanPhone.replace(/(\d{2})(\d{2})?(\d{2})?(\d{2})?(\d{2})?/, '$1 $2 $3 $4 $5').trim()
  }
  return cleanPhone
}

// 🏠 COMPONENT PRINCIPAL
export function FatahLanding() {
  // 📱 ÉTATS DU FORMULAIRE
  const [phone, setPhone] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // 🔍 TEST DE CONNEXION SUPABASE AU CHARGEMENT
  useEffect(() => {
    testSupabaseConnection()
  }, [])

  // ⌨️ GESTION DE LA SAISIE DU TÉLÉPHONE
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const formatted = formatPhoneDisplay(value)
    setPhone(formatted)
  }

  // 🚀 SOUMISSION DU FORMULAIRE
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    console.log('📝 Formulaire soumis avec:', phone)
    
    try {
      // ✅ VALIDATIONS
      if (!phone.trim()) {
        setError('Numéro de téléphone requis')
        return
      }
      
      if (!validateIvorianPhone(phone)) {
        setError('Format invalide. Ex: 07 09 12 34 56')
        return
      }
      
      // 💾 SAUVEGARDE
      await saveToWaitlist(phone)
      setIsSubmitted(true)
      
    } catch (error) {
      console.error('🚨 Erreur soumission:', error)
      
      // 🔍 GESTION DES ERREURS SPÉCIFIQUES
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      
      if (errorMessage === 'DUPLICATE_PHONE') {
        setError('Ce numéro est déjà inscrit ! 😊')
      } else if (errorMessage === 'TABLE_NOT_FOUND') {
        setError('Erreur technique. Contacte l\'équipe !')
      } else if (errorMessage.includes('SUPABASE_ERROR')) {
        setError('Problème de base de données. Réessaie !')
      } else {
        setError('Erreur technique. Réessaie dans quelques secondes !')
      }
      
    } finally {
      setIsLoading(false)
    }
  }

  // 🎉 PAGE DE CONFIRMATION
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="text-center text-white max-w-md"
        >
          <div className="text-8xl mb-6">🎉</div>
          <h2 className="text-4xl font-bold mb-4">Merci champion !</h2>
          <p className="text-xl mb-6">Tu es maintenant sur la liste VIP ! 🚀</p>
          <p className="text-lg opacity-80">
            On te contacte dès que Fatah est prêt pour révolutionner Abidjan ! 💪
          </p>
          
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mt-8 text-6xl"
          >
            📱
          </motion.div>
        </motion.div>
      </div>
    )
  }

  // 🏠 LANDING PAGE PRINCIPALE
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 overflow-hidden">
      <div className="container mx-auto px-4 py-8 relative">
        
        {/* 🌟 ÉLÉMENTS FLOTTANTS */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {FLOATING_ELEMENTS.map((pos, i) => (
            <motion.div
              key={i}
              className="absolute"
              animate={{
                x: [0, 100, 0],
                y: [0, -100, 0],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 4 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{
                left: `${pos.left}%`,
                top: `${pos.top}%`,
              }}
            >
              <div className="w-3 h-3 bg-white rounded-full opacity-20" />
            </motion.div>
          ))}
        </div>

        <div className="relative z-10 text-center text-white">
          
          {/* 🎯 HERO SECTION */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <motion.h1 
              className="text-6xl md:text-8xl font-black mb-4 bg-gradient-to-r from-yellow-300 via-white to-yellow-300 bg-clip-text text-transparent"
              animate={{ 
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{ duration: 3, repeat: Infinity }}
              style={{ backgroundSize: '200% 200%' }}
            >
              FATAH
            </motion.h1>
            
            <p className="text-2xl md:text-4xl font-bold mb-2">
              🔥 Le TikTok du Commerce 🔥
            </p>
            <p className="text-lg md:text-xl mb-8 opacity-90">
              Stories • Nego • Livraison • 🇨🇮 Made in Abidjan
            </p>
          </motion.div>

          {/* 🎯 FEATURES */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-5xl mx-auto"
          >
            {[
              {
                icon: "📱",
                title: "Stories Produits",
                desc: "Poste tes produits en story comme sur TikTok ! Disparaît en 24h = urgence d'acheter !",
                delay: 0.1
              },
              {
                icon: "💬",
                title: "Nego Direct",
                desc: "Chat et négocie comme au marché ! Prix flexible, deal en temps réel.",
                delay: 0.2
              },
              {
                icon: "🏍️",
                title: "Livraison Flash",
                desc: "Ton produit chez toi en 30min max ! Partout à Abidjan.",
                delay: 0.3
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + feature.delay, duration: 0.6 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white/15 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="font-bold text-xl mb-3">{feature.title}</h3>
                <p className="text-sm opacity-90 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* 🚀 FORMULAIRE PRINCIPAL */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="max-w-lg mx-auto px-4"
          >
            <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-6 md:p-8 border border-white/30 shadow-2xl">
              <h2 className="text-2xl md:text-3xl font-bold mb-2 text-center">
                🚀 Rejoins la révolution !
              </h2>
              <p className="text-base md:text-lg opacity-80 mb-6 text-center">
                Sois parmi les premiers à tester Fatah
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="w-full">
                  <input
                    type="tel"
                    placeholder="Ex: 07 09 12 34 56"
                    value={phone}
                    onChange={handlePhoneChange}
                    required
                    className="w-full p-4 rounded-2xl text-black text-base md:text-lg font-medium placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-yellow-300 transition-all text-center md:text-left"
                  />
                </div>
                
                {error && (
                  <motion.p
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-yellow-300 text-sm font-medium text-center"
                  >
                    ⚠️ {error}
                  </motion.p>
                )}
                
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-black py-4 rounded-2xl text-base md:text-lg hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-black border-t-transparent rounded-full mr-2"
                      />
                      Inscription...
                    </span>
                  ) : (
                    '🔥 JE VEUX ÊTRE LE PREMIER !'
                  )}
                </motion.button>
              </form>
              
              <p className="text-xs md:text-sm opacity-70 mt-4 leading-relaxed text-center">
                * Inscription 100% gratuite • On te contacte dès le lancement ! 🎯
              </p>
            </div>
          </motion.div>

          {/* 🎯 FOOTER */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="mt-16 space-y-4"
          >
            <div className="flex justify-center space-x-6 text-2xl">
              <span>🇨🇮</span>
              <span>💎</span>
              <span>🚀</span>
              <span>💪</span>
            </div>
            <p className="text-lg opacity-70">
              Bientôt disponible dans tout Abidjan
            </p>
            <p className="text-sm opacity-50">
              Made with ❤️ by the Fatah Team
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}