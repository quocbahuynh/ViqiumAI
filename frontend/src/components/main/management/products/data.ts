export interface ClassificationOption {
  _id: string;
  label: string;
  value: string;
  count?: string;
  isCustom?: boolean;
}


export interface Classification {
  _id: string;
  label: string;
  value: string;
  options: ClassificationOption[];
  name?: string; // For UI display
}

export interface VariantCombination {
  id: string;
  values: Record<string, string>; // classificationId -> optionValue
  valueLabels: Record<string, string>; // classificationId -> optionLabel
  valueIds: Record<string, string>; // classificationId -> optionId
  price: number;
  stock: number;
  photoUrl?: string;
}

// Interface for the form data
export interface FormProductData {
  name: string;
  description: string;
  basePrice: number;
  classifications: Classification[];
  variants: VariantCombination[];
}

// Interface for the POST data
export interface PostProduct {
  name: string;
  description: string;
  basePrice: number;
  variant: {
    photoUrl: string;
    classifications: {
      classificationId: string;
      label: string;
      valueClassificationId: string;
      valueLabel: string;
      aidescription: string;
      value: string;
      typeRoles: string;
      valueAidescription: string;
      valueTypeRoles: string;
    }[];
    price: number;
  }[];
}