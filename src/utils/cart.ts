import { products } from "../data/products";
import type { CartItem, Product } from "../types/product";
export const CART_KEY = "shubh-crockery-cart-v1";
export const MAX_QUANTITY = 99;
export const itemKey = (item: Pick<CartItem, "productId" | "variantId">) =>
  JSON.stringify([item.productId, item.variantId ?? null]);
export const normalizeQuantity = (quantity: number) =>
  Math.min(
    MAX_QUANTITY,
    Math.max(1, Math.floor(Number.isFinite(quantity) ? quantity : 1)),
  );
export function validItem(item: CartItem, list: Product[] = products) {
  const product = list.find((p) => p.id === item.productId);
  return (
    !!product &&
    product.availability !== "unavailable" &&
    (product.variants.length === 0
      ? item.variantId === undefined
      : product.variants.some(
          (v) => v.id === item.variantId && v.availability !== "unavailable",
        ))
  );
}
export function addItem(cart: CartItem[], item: CartItem): CartItem[] {
  if (!validItem(item)) return cart;
  const existing = cart.find((line) => itemKey(line) === itemKey(item));
  return existing
    ? cart.map((line) =>
        line === existing
          ? {
              ...line,
              quantity: normalizeQuantity(
                line.quantity + normalizeQuantity(item.quantity),
              ),
            }
          : line,
      )
    : [...cart, { ...item, quantity: normalizeQuantity(item.quantity) }];
}
export const updateQuantity = (
  cart: CartItem[],
  key: string,
  quantity: number,
) =>
  cart.map((item) =>
    itemKey(item) === key
      ? { ...item, quantity: normalizeQuantity(quantity) }
      : item,
  );
export const removeItem = (cart: CartItem[], key: string) =>
  cart.filter((item) => itemKey(item) !== key);
export const serializeCart = (cart: CartItem[]) =>
  JSON.stringify({ version: 1, items: cart });
export function deserializeCart(
  raw: string | null,
  list = products,
): CartItem[] {
  try {
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (
      !parsed ||
      typeof parsed !== "object" ||
      !("version" in parsed) ||
      parsed.version !== 1 ||
      !("items" in parsed) ||
      !Array.isArray(parsed.items)
    )
      return [];
    const result: CartItem[] = [];
    for (const entry of parsed.items) {
      if (
        !entry ||
        typeof entry !== "object" ||
        typeof entry.productId !== "string" ||
        (entry.variantId !== undefined &&
          typeof entry.variantId !== "string") ||
        typeof entry.quantity !== "number" ||
        !Number.isFinite(entry.quantity) ||
        entry.quantity < 1
      )
        continue;
      const item: CartItem = {
        productId: entry.productId,
        ...(entry.variantId ? { variantId: entry.variantId } : {}),
        quantity: normalizeQuantity(entry.quantity),
      };
      if (!validItem(item, list)) continue;
      const existing = result.find((line) => itemKey(line) === itemKey(item));
      if (existing)
        existing.quantity = normalizeQuantity(
          existing.quantity + item.quantity,
        );
      else result.push(item);
    }
    return result;
  } catch {
    return [];
  }
}
export function readCart(storage: Pick<Storage, "getItem">) {
  try {
    return deserializeCart(storage.getItem(CART_KEY));
  } catch {
    return [];
  }
}
export function saveCart(storage: Pick<Storage, "setItem">, items: CartItem[]) {
  try {
    storage.setItem(CART_KEY, serializeCart(items));
    return true;
  } catch {
    return false;
  }
}
