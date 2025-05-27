import { FatahLanding } from '@/components/landing/fatahLanding'

export default function Home() {
  return <FatahLanding />
}

export const metadata = {
  title: 'Fatah - Le TikTok du Commerce à Abidjan 🔥',
  description: 'Stories, Nego, Livraison rapide - La marketplace nouvelle génération pour Abidjan. Rejoins la révolution du commerce local !',
  keywords: 'marketplace, abidjan, côte d\'ivoire, commerce, tiktok, stories, négociation',
  openGraph: {
    title: 'Fatah - Le TikTok du Commerce à Abidjan',
    description: '🔥 La révolution du commerce arrive à Abidjan ! Stories, Nego, Livraison flash.',
    type: 'website',
  },
}