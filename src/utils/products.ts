import { products } from "../data/products";
import type { Product } from "../types/product";
export const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
export const findProduct = (slug: string | undefined, list = products) =>
  list.find((product) => product.slug === slug);
export function deriveGroups(field: "category" | "brand", list = products) {
  const names = [
    ...new Set(
      list
        .map((product) => product[field])
        .filter((name): name is string => Boolean(name)),
    ),
  ];
  return names.map((name) => ({
    name,
    slug: slugify(name),
    count: list.filter((product) => product[field] === name).length,
  }));
}
export function filterProducts(
  list: Product[],
  {
    query = "",
    category = "",
    brand = "",
  }: { query?: string; category?: string; brand?: string },
) {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  return list.filter(
    (product) =>
      (!category || product.category === category) &&
      (!brand || product.brand === brand) &&
      terms.every((term) =>
        [
          product.name,
          product.brand,
          product.category,
          product.subcategory,
          product.modelCode,
          product.shortDescription,
          ...product.tags,
          ...product.variants.map((v) => v.label),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(term),
      ),
  );
}
