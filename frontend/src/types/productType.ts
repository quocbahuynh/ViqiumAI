export interface Product {
    _id: string
    name: string
    numberOfVariants:number
    photoUrls:[string]
    prices:[number]
}
// Interface cho từng classification
export interface ClassificationPost {
    classificationId: string
    label: string  
    value: string
    typeRoles: string
  
    valueClassificationId: string
    valueLabel: string
    valueValue:string
    valueTypeRoles: string
  
    aidescription: string
    valueAidescription: string
  
  }
  
  // Interface cho variant
  export interface Variant {
    photoUrl: string
    classifications: ClassificationPost[]
    price: number
  }
  
  // Interface chính của product
  export interface PostProduct {
    name: string
    description: string
    basePhotoUrl:string
    basePrice: number
    variant: Variant[]
  }

// Thêm các type cần thiết cho product detail

  export interface ProductDetail {
    _id: string
    name: string
    description: string
    basePrice: number
    basePhotoUrl?: string
    classifications: Classification[]
    variants: Variant[]
  }
  
  export interface ClassificationOption {
    _id: string
    label: string
    value: string
    isCustom: boolean
  }
  
  export interface Classification {
    _id: string
    label: string
    value: string
    name: string
    isCustom: boolean
    options: ClassificationOption[]
  }
  