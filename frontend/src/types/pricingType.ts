export interface PricingFeature {
  text: string
  included: boolean
  isSpecial?: boolean
  specialText?: string
}

export interface PricingPlan {
  id: string
  name: string
  price: string
  period: string
  description: string
  badge?: string
  badgeColor?: string
  headerColor: string
  features: PricingFeature[]
  ctaText: string
  ctaLink: string
  ctaStyle: 'primary' | 'outline'
  featured?: boolean
}
