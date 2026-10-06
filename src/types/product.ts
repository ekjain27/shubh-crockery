export interface ProductImage {
  src: string;
  alt: string;
  source: "local-demo" | "catalogue" | "manufacturer" | "owner" | "other";
  sourceReference?: string;
  licenseStatus?:
    "original" | "permission-confirmed" | "review-required" | "unknown";
  isRepresentative: boolean;
}
export interface ProductVariant {
  id: string;
  label: string;
  modelCode?: string;
  capacity?: string;
  size?: string;
  color?: string;
  availability?: "unknown" | "available" | "unavailable";
}
export interface Product {
  id: string;
  slug: string;
  name: string;
  brand?: string;
  category: string;
  subcategory?: string;
  modelCode?: string;
  shortDescription?: string;
  description?: string;
  variants: ProductVariant[];
  capacity?: string;
  size?: string;
  colors?: string[];
  images: ProductImage[];
  catalogueSource?: { fileName: string; page?: number; reference?: string };
  priceMode: "enquiry";
  availability: "unknown" | "available" | "unavailable";
  featured: boolean;
  tags: string[];
  dataStatus: "demo" | "verified";
}
export interface CartItem {
  productId: string;
  variantId?: string;
  quantity: number;
}
