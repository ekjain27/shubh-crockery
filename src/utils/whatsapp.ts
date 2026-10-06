import { business } from "../config/business";
import { products } from "../data/products";
import type { CartItem, Product, ProductVariant } from "../types/product";
export function whatsappUrl(
  message: string,
  number: string = business.whatsappNumber,
) {
  const digits = number.replace(/[^0-9]/g, "");
  if (!/^\d{7,15}$/.test(digits)) throw new Error("Invalid WhatsApp number");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
const demoNote = (demo: boolean) =>
  demo ? "\n[Development sample — not a verified catalogue product]" : "";
export function productMessage(
  product: Product,
  variant?: ProductVariant,
  quantity = 1,
) {
  return `Hello ${business.businessName},\nI would like to enquire about:\n\n${product.name}${variant ? `\nVariant: ${variant.label}` : ""}\nQuantity: ${quantity}${demoNote(product.dataStatus === "demo")}\n\nPlease share the price and availability.`;
}
export function cartMessage(items: CartItem[]) {
  const lines = items.flatMap((item) => {
    const product = products.find((p) => p.id === item.productId);
    if (!product) return [];
    const variant = product.variants.find((v) => v.id === item.variantId);
    return [
      `${product.name}${variant ? ` — ${variant.label}` : ""}\nQuantity: ${item.quantity}${demoNote(product.dataStatus === "demo")}`,
    ];
  });
  return `Hello ${business.businessName},\nI would like to enquire about the following items:\n\n${lines.join("\n\n")}\n\nPlease confirm prices and availability. This is an enquiry, not a confirmed order.`;
}
export const generalEnquiryUrl = () =>
  whatsappUrl(
    `Hello ${business.businessName}, please help me with a product enquiry.`,
  );
