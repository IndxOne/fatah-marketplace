// Types principaux pour Fatah
export interface User {
  id: string
  phone: string
  name: string
  avatarUrl?: string
  location?: [number, number]
  quartier?: string
  reputationScore: number
  isVerified: boolean
  createdAt: string
}

export interface Product {
  id: string
  userId: string
  title: string
  description?: string
  price: number
  category: ProductCategory
  condition: 'neuf' | 'occasion' | 'à réparer'
  images: string[]
  location?: [number, number]
  quartier?: string
  isNegotiable: boolean
  isAvailable: boolean
  viewsCount: number
  likesCount: number
  createdAt: string
}

export interface Story {
  id: string
  userId: string
  productId: string
  videoUrl: string
  thumbnailUrl?: string
  caption?: string
  expiresAt: string
  viewsCount: number
  createdAt: string
}

export type ProductCategory = 
  | 'electronique'
  | 'vetements' 
  | 'chaussures'
  | 'voitures'
  | 'maisons'
  | 'autres'

export interface Location {
  latitude: number
  longitude: number
  quartier?: string
}

export interface WaitlistEntry {
  id: string
  phone: string
  createdAt: string
  source: string
}