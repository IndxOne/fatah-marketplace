'use client' // Indique que ce component s'exécute côté client (browser)
import { useState } from 'react' // Hook pour gérer les states du component
import { motion } from 'framer-motion' // Librairie pour les animations
import { saveToWaitlist } from '@/utils/supabase' // Notre fonction pour sauver en BDD

// ✅ TYPE POUR LES ERREURS (au lieu de 'any')
interface ApiError {
  message?: string
  code?: string
}

// 🎯 POSITIONS FIXES POUR LES ÉLÉMENTS FLOTTANTS
// On évite Math.random() pour pas d'erreur d'hydratation
const FLOATING_ELEMENTS = [
  { left: 10, top: 20 },   // Position en % de l'élément 1
  { left: 80, top: 30 },   // Position en % de l'élément 2
  { left: 25, top: 60 },   // Position en % de l'élément 3
  { left: 90, top: 10 },   // etc...
  { left: 15, top: 80 },
  { left: 60, top: 40 },
  { left: 40, top: 70 },
  { left: 95, top: 85 },
  { left: 5, top: 50 },
  { left: 70, top: 15 },
  { left: 30, top: 90 },
  { left: 85, top: 25 },
  { left: 50, top: 5 },
  { left: 20, top: 45 },
  { left: 75, top: 65 }
]

// 🎯 COMPONENT PRINCIPAL DE LA LANDING PAGE
export function FatahLanding() {
  // 📱 STATES DU FORMULAIRE
  const [phone, setPhone] = useState('') // Numéro de téléphone saisi
  const [isSubmitted, setIsSubmitted] = useState(false) // Si formulaire envoyé avec succès
  const [isLoading, setIsLoading] = useState(false) // Si en cours d'envoi
  const [error, setError] = useState('') // Message d'erreur à afficher

  // 🚀 FONCTION QUI GÈRE L'ENVOI DU FORMULAIRE
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault() // Empêche le rechargement de page par défaut
    setIsLoading(true) // Active le loader
    setError('') // Reset les erreurs précédentes
    
    // ✅ VALIDATION CÔTÉ CLIENT
    if (!phone || phone.length < 8) {
      setError('Numéro de téléphone invalide')
      setIsLoading(false)
      return // Arrête la fonction ici
    }
    
    try {
      // 📊 TENTATIVE DE SAUVEGARDE EN BASE DE DONNÉES
      await saveToWaitlist(phone)
      setIsSubmitted(true) // Affiche la page de confirmation
    } catch (error) {
      // ✅ GESTION D'ERREUR TYPÉE (plus de 'any')
      console.error('Error:', error)
      const apiError = error as ApiError
      
      // 🔍 DIFFÉRENTS TYPES D'ERREURS
      if (apiError.message?.includes('duplicate')) {
        setError('Ce numéro est déjà inscrit ! 😊')
      } else {
        setError('Erreur lors de l\'inscription. Réessaie stp !')
      }
    } finally {
      // ⏹️ TOUJOURS EXÉCUTÉ, même si erreur
      setIsLoading(false) // Désactive le loader
    }
  }

  // 🎉 PAGE DE CONFIRMATION (si inscription réussie)
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center p-4">
        {/* 🎬 ANIMATION D'ENTRÉE AVEC ROTATION */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }} // État initial (invisible, tourné)
          animate={{ scale: 1, rotate: 0 }}     // État final (visible, droit)
          transition={{ duration: 0.8, type: "spring" }} // Type d'animation
          className="text-center text-white max-w-md"
        >
          <div className="text-8xl mb-6">🎉</div>
          <h2 className="text-4xl font-bold mb-4">Merci champion !</h2>
          <p className="text-xl mb-6">Tu es maintenant sur la liste VIP ! 🚀</p>
          <p className="text-lg opacity-80">
            On te contacte dès que Fatah est prêt pour révolutionner Abidjan ! 💪
          </p>
          
          {/* 📱 ICÔNE ANIMÉE QUI BOUNCE */}
          <motion.div
            animate={{ y: [0, -10, 0] }} // Animation up/down
            transition={{ duration: 2, repeat: Infinity }} // Répète à l'infini
            className="mt-8 text-6xl"
          >
            📱
          </motion.div>
        </motion.div>
      </div>
    )
  }

  // 🏠 PAGE PRINCIPALE DE LA LANDING
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 overflow-hidden">
      <div className="container mx-auto px-4 py-8 relative">
        
        {/* 🌟 ÉLÉMENTS FLOTTANTS EN ARRIÈRE-PLAN */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {FLOATING_ELEMENTS.map((pos, i) => (
            <motion.div
              key={i} // Clé unique pour React
              className="absolute"
              // 🎬 ANIMATIONS DES ÉLÉMENTS
              animate={{
                x: [0, 100, 0],      // Mouvement horizontal
                y: [0, -100, 0],     // Mouvement vertical
                rotate: [0, 180, 360], // Rotation complète
              }}
              transition={{
                duration: 4 + i * 0.5, // Durée différente pour chaque élément
                repeat: Infinity,        // Répète à l'infini
                ease: "easeInOut"       // Type d'accélération
              }}
              style={{
                left: `${pos.left}%`,  // Position horizontale
                top: `${pos.top}%`,    // Position verticale
              }}
            >
              {/* 🔴 PETIT POINT BLANC FLOTTANT */}
              <div className="w-3 h-3 bg-white rounded-full opacity-20" />
            </motion.div>
          ))}
        </div>

        {/* 📄 CONTENU PRINCIPAL */}
        <div className="relative z-10 text-center text-white">
          
          {/* 🎯 SECTION HERO (titre principal) */}
          <motion.div
            initial={{ opacity: 0, y: 50 }} // Commence invisible et en bas
            animate={{ opacity: 1, y: 0 }}  // Devient visible et centré
            transition={{ duration: 1 }}     // Durée de l'animation
          >
            {/* 🔥 TITRE PRINCIPAL AVEC DÉGRADÉ ANIMÉ */}
            <motion.h1 
              className="text-6xl md:text-8xl font-black mb-4 bg-gradient-to-r from-yellow-300 via-white to-yellow-300 bg-clip-text text-transparent"
              animate={{ 
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'], // Animation du dégradé
              }}
              transition={{ duration: 3, repeat: Infinity }} // Répète toutes les 3 secondes
              style={{ backgroundSize: '200% 200%' }} // Taille du dégradé
            >
              FATAH
            </motion.h1>
            
            {/* 📝 SOUS-TITRES */}
            <p className="text-2xl md:text-4xl font-bold mb-2">
              🔥 Le TikTok du Commerce 🔥
            </p>
            <p className="text-lg md:text-xl mb-8 opacity-90">
              Stories • Nego • Livraison • 🇨🇮 Made in Abidjan
            </p>
          </motion.div>

          {/* 🎯 SECTION FEATURES (caractéristiques) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }} // Commence petit et invisible
            animate={{ opacity: 1, scale: 1 }}   // Devient normal et visible
            transition={{ delay: 0.5, duration: 0.8 }} // Délai de 0.5s avant animation
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-5xl mx-auto"
          >
            {/* 📊 TABLEAU DES FEATURES */}
            {[
              {
                icon: "📱",
                title: "Stories Produits",
                desc: "Poste tes produits en story comme sur TikTok ! Disparaît en 24h = urgence d'acheter !",
                delay: 0.1 // Délai d'animation pour cet élément
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
            ].map((feature, i) => ( // Pour chaque feature dans le tableau
              <motion.div
                key={i} // Clé unique
                initial={{ opacity: 0, y: 50 }} // État initial
                animate={{ opacity: 1, y: 0 }}  // État final
                transition={{ delay: 0.5 + feature.delay, duration: 0.6 }} // Délai personnalisé
                whileHover={{ scale: 1.05, y: -5 }} // Animation au survol souris
                className="bg-white/15 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="font-bold text-xl mb-3">{feature.title}</h3>
                <p className="text-sm opacity-90 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* 🎯 FORMULAIRE PRINCIPAL D'INSCRIPTION */}
          <motion.div
            initial={{ opacity: 0, y: 30 }} // Commence en bas et invisible
            animate={{ opacity: 1, y: 0 }}  // Monte et devient visible
            transition={{ delay: 1, duration: 0.8 }} // Délai de 1 seconde
            className="max-w-lg mx-auto"
          >
            <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-8 border border-white/30 shadow-2xl">
              <h2 className="text-3xl font-bold mb-2">
                🚀 Rejoins la révolution !
              </h2>
              <p className="text-lg opacity-80 mb-6">
                Sois parmi les premiers à tester Fatah
              </p>
              
              {/* 📝 FORMULAIRE HTML */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  {/* 📱 INPUT TÉLÉPHONE */}
                  <input
                    type="tel" // Type téléphone pour clavier mobile optimisé
                    placeholder="Ton numéro WhatsApp (ex: 07 09 12 34 56)"
                    value={phone} // Valeur liée au state
                    onChange={(e) => setPhone(e.target.value)} // Met à jour le state
                    required // Champ obligatoire
                    className="w-full p-4 rounded-2xl text-black text-lg font-medium placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-yellow-300 transition-all"
                  />
                </div>
                
                {/* ⚠️ AFFICHAGE DES ERREURS */}
                {error && (
                  <motion.p
                    initial={{ opacity: 0, x: -20 }} // Animation d'entrée de l'erreur
                    animate={{ opacity: 1, x: 0 }}
                    className="text-yellow-300 text-sm font-medium"
                  >
                    ⚠️ {error}
                  </motion.p>
                )}
                
                {/* 🚀 BOUTON DE SOUMISSION */}
                <motion.button
                  type="submit"
                  disabled={isLoading} // Désactivé pendant le chargement
                  whileHover={{ scale: 1.05 }} // Animation au survol
                  whileTap={{ scale: 0.95 }}   // Animation au clic
                  className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-black py-4 rounded-2xl text-lg hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    // 🔄 ÉTAT DE CHARGEMENT
                    <span className="flex items-center justify-center">
                      {/* ⏳ SPINNER ANIMÉ */}
                      <motion.div
                        animate={{ rotate: 360 }} // Rotation 360°
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }} // Répète linéairement
                        className="w-5 h-5 border-2 border-black border-t-transparent rounded-full mr-2"
                      />
                      Inscription...
                    </span>
                  ) : (
                    // 🔥 ÉTAT NORMAL
                    '🔥 JE VEUX ÊTRE LE PREMIER !'
                  )}
                </motion.button>
              </form>
              
              {/* 📝 TEXTE LÉGAL */}
              <p className="text-sm opacity-70 mt-4 leading-relaxed">
                * Inscription 100% gratuite • On te contacte dès le lancement ! 🎯
              </p>
            </div>
          </motion.div>

          {/* 🎯 SECTION FOOTER */}
          <motion.div
            initial={{ opacity: 0 }} // Commence invisible
            animate={{ opacity: 1 }}  // Devient visible
            transition={{ delay: 1.5, duration: 1 }} // Délai de 1.5 secondes
            className="mt-16 space-y-4"
          >
            {/* 🎪 ÉMOJIS DÉCORATIFS */}
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