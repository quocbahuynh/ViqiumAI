import { Product } from "./productType";

export interface PromotionType {
    _id: string;
    name: string;
    description: string;
    pathCreate:string;
  }
  
  export interface PostProductApply {
    productId: string;
    promoteType: "percent" | "fixed"; 
    promotePricing: number;
  }
  
  export interface PostPromotion {
    name: string;
    startTime: string; // ISO string, ví dụ "2025-05-01T08:00:00Z"
    endTime: string;   // ISO string
    promotionId: string;
    productApply: PostProductApply[];
  }

  export interface ProductApply {
    product:Product
    promoteType: "percent" | "fixed"; 
    promotePricing: number;
  }
  
  export interface Promotion {
    name: string;
    startTime: string; // ISO string, ví dụ "2025-05-01T08:00:00Z"
    endTime: string;   // ISO string
    promotionId: string;
    productApply: ProductApply[];
  }

//________________________________________________


export interface ProductGiftApply {
  promoteTarget: number;
  productGift: Product[];
}

export interface PromotionGift {
  name: string;
  startTime: string; // ISO 8601 format
  endTime: string;   // ISO 8601 format
  promotionId: string;
  product:Product[]
  productApply: ProductGiftApply[];
}




  export interface PostProductGiftApply {
    productId: string;
    promoteTarget: number;
    productGift: string[];
  }
  
  export interface PostPromotionGift {
    name: string;
    startTime: string; // ISO 8601 format
    endTime: string;   // ISO 8601 format
    productApply: PostProductGiftApply[];
  }
  //________________________________________________


  

  export interface ProductBulkApply {
    promoteTarget: number;
    promoteType: "percent" 
    promotePricing: number;
  }
  
  export interface PromotionBulk {
    name: string;
    startTime: string; // ISO 8601
    endTime: string;   // ISO 8601
    promotionId: string;
    product:Product[]
    productApply: ProductBulkApply[];
  }


  export interface PostProductBulkApply {
    productId: string;
    promoteTarget: number;
    promoteType: "percent" // tùy trường hợp, mình thêm luôn type an toàn hơn
    promotePricing: number;
  }
  
  export interface PostPromotionBulk {
    name: string;
    startTime: string; // ISO 8601
    endTime: string;   // ISO 8601
    promotionId: string;
    productApply: PostProductBulkApply[];
  }
  